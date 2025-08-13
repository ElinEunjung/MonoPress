import type { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IS_PRODUCTION_ENVIRONMENT } from "../../../configs/is-production-environment";
import { UserModel } from "../models/types/user-model.type";
import { COOKIE_MAX_AGE } from "./constants/cookie-max-age";
import { USER_ROLE } from "./constants/user-role.constant";
import { JwtTokenHelper } from "./helpers/jwt-token.helper";

import { userService } from "../../../services/user.service";
import { createJwtUserPayloadFactory } from "./helpers/create-jwt-user-payload-factory";
import { googleAuthService } from "./services/google-auth.service";

export async function handleOAuthGoogleLogin(
  _request: Request,
  response: Response,
) {
  const result = await googleAuthService.fetchDiscoveryConfiguration();

  if (result.ok) {
    const authorizationUrl = result.data;
    response.redirect(authorizationUrl);
  }

  if (!result.ok) {
    return response.status(500).json({ error: result.error });
  }
}

export async function handleOAuthGoogleLogout(
  request: Request,
  response: Response,
) {
  const token = request.cookies.access_token;

  if (!token) {
    return response
      .status(401)
      .json({ message: "Session outdated. Please log in again." });
  }

  type DecodedUserModelToken = UserModel & Pick<JwtPayload, "iat" | "exp">;
  const { accessToken } =
    JwtTokenHelper.verifyAndDecrypt<DecodedUserModelToken>(token);

  const result =
    await googleAuthService.revokeGoogleSignByAccessToken(accessToken);

  if (result.ok) {
    response.clearCookie("access_token");
    response.status(result.status).end();
  }

  if (!result.ok) {
    response.clearCookie("access_token");
    response.status(result.status).json({ error: result.error });
  }
}

export async function handleGetGoogleLoginCallback(
  request: Request<{}, {}, {}, { code: string }>,
  response: Response,
) {
  const { code } = request.query;

  if (!code) {
    return response.status(400).json({
      status: "error",
      error: "Missing authorization code",
      error_description: "The authorization code is required to proceed.",
    });
  }

  const authResult =
    await googleAuthService.fetchUserAccessTokenByAuthCode(code);

  if (!authResult.ok) {
    return response.json(authResult);
  }

  const accessToken = authResult.data;

  const userResult =
    await googleAuthService.fetchUserInformationByAccessToken(accessToken);

  if (!userResult.ok) {
    return response.status(userResult.status).json(userResult);
  }

  const { id: googleId, email, name, picture } = userResult.data;

  const user = await userService.findUserByGoogleId(googleId);

  if (user) {
    await userService.updateUserAccessToken(googleId, accessToken);
  }

  let isUserRegistered = false;

  const jwtPayload = createJwtUserPayloadFactory({
    accessToken,
    name,
    email,
    picture,
    googleId,
    resources: {
      role: user?.resources?.role || USER_ROLE.NoneEditor,
    },
  });

  const token = JwtTokenHelper.create(jwtPayload);

  if (user === null) {
    await userService.insertUser(jwtPayload);

    response.cookie("access_token", token, {
      httpOnly: true,
      secure: IS_PRODUCTION_ENVIRONMENT,
      maxAge: COOKIE_MAX_AGE.THREE_HOURS,
    });

    response.json({
      isUserRegistered,
    });
  }

  if (user !== null) {
    isUserRegistered = true;

    response.cookie("access_token", token, {
      httpOnly: true,
      secure: IS_PRODUCTION_ENVIRONMENT,
      maxAge: COOKIE_MAX_AGE.THREE_HOURS,
    });

    response.json({
      isUserRegistered,
    });
  }
}
