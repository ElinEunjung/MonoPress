import type { Request, Response } from "express";
import { GLOBAL_SERVER_HOST_NAME } from "../../../configs/googles/global-server-host-name";
import { GOOGLE_DISCOVERY_ENDPOINT } from "./constants/endpoint.constant";
import { GLOBAL_GOOGLE_CONFIG } from "../../../configs/googles/global-google-config";
import { GoogleDiscoveryConfiguration } from "./types/google-discovery-configuration.type";
import { userGoogleSchemaModel } from "./models/user-google-schema.model";
import { USER_ROLE } from "./constants/user-role.constant";
import { USER_POLICY } from "./constants/user-policy.constant";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../../constants/auth/global-jwt-token";
import { UserModel } from "../models/types/user-model.type";
import { COOKIE_MAX_AGE } from "./constants/cookie-max-age";
import { IS_PRODUCTION_ENVIRONMENT } from "../../../configs/is-production-environment";
import { JwtToken } from "./helpers/jwt-token.helper";

export async function handleOAuthGoogleLogin(
  _request: Request,
  response: Response,
) {
  const googleDiscoveryConfiguration = await fetch(GOOGLE_DISCOVERY_ENDPOINT);
  const { authorization_endpoint } =
    (await googleDiscoveryConfiguration.json()) as GoogleDiscoveryConfiguration;

  const redirect_uri = GLOBAL_SERVER_HOST_NAME + "/api/login/google/callback";
  const urlParameter = {
    response_type: "code",
    scope: "openid profile email",
    client_id: GLOBAL_GOOGLE_CONFIG.client_id,
    redirect_uri: redirect_uri,
  };

  const authorization_url = `${authorization_endpoint}?${new URLSearchParams(urlParameter)}`;
  response.redirect(authorization_url);
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

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    type DecodedUserModelToken = UserModel & Pick<JwtPayload, "iat" | "exp">;

    const { accessToken } = decodedToken as DecodedUserModelToken;
    // Make a request to Google's token revocation endpoint
    const revokeResponse = await fetch(
      `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    if (revokeResponse.ok) {
      response.clearCookie("access_token");
      response.status(204).end();
    } else {
      const error = await revokeResponse.json();
      return response.status(400).json({
        status: "error",
        error: error.error,
        error_description: error.error_description,
      });
    }
  } catch (error) {
    console.log("JWT verification failed:", (error as Error).message);
    response.clearCookie("access_token");

    return response
      .status(401)
      .json({ message: "Session outdated. Please log in again." });
  }
}

export async function handleGetGoogleLoginCallback(
  request: Request,
  response: Response,
) {
  const { error, error_description, code } = request.query as any;

  if (error) {
    return response.json({
      status: "error",
      error,
      error_description,
    });
  }

  if (!code) {
    return response.status(400).json({
      status: "error",
      error: "Missing authorization code",
      error_description: "The authorization code is required to proceed.",
    });
  }

  const { discovery_endpoint, client_id, client_secret, scope } =
    GLOBAL_GOOGLE_CONFIG;

  const configuration = await fetch(discovery_endpoint);
  const { token_endpoint } = await configuration.json();

  const redirect_uri = GLOBAL_SERVER_HOST_NAME + "/api/login/google/callback";

  // Create the token request payload
  const tokenRequest = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: code as string,
      client_id: client_id as string,
      client_secret: client_secret as string,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
      scope: scope,
    }).toString(),
  };

  const tokenResult = await fetch(token_endpoint, tokenRequest);

  const tokenData = await tokenResult.json();

  if (tokenResult.ok) {
    const { access_token } = tokenData;

    // Fetch user information using the access token
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const userData = await userInfoResponse.json();

    const { id: googleId, email, name, picture } = userData;

    const user = await userGoogleSchemaModel.findOne({ googleId });

    if (user) {
      await userGoogleSchemaModel.updateOne(
        { googleId }, // Filter criteria
        {
          $set: {
            accessToken: access_token,
          },
        },
      );
    }

    let isUserRegistered = false;

    // Create the JWT payload
    const jwtPayload = {
      accessToken: access_token,
      name,
      email,
      picture,
      googleId,
      resources: {
        role: user?.resources?.role || USER_ROLE.NoneEditor,
        policy: {
          article: {
            reaction: [USER_POLICY.READ, USER_POLICY.UPDATE],
            comments: [
              USER_POLICY.READ,
              USER_POLICY.WRITE,
              USER_POLICY.DELETE,
              USER_POLICY.UPDATE,
            ],
          },
        },
      },
    };
    const token = JwtToken.create(jwtPayload);

    if (user === null) {
      await userGoogleSchemaModel.insertOne(jwtPayload);

      response.cookie("access_token", token, {
        httpOnly: true,
        secure: IS_PRODUCTION_ENVIRONMENT,
        maxAge: COOKIE_MAX_AGE.THREE_HOURS,
      });

      response.json({
        isUserRegistered,
      });
    } else {
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
  } else {
    return response.json({
      status: "error",
      error: tokenData.error,
      error_description: tokenData.error_description,
    });
  }
}
