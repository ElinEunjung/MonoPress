import { Request, Response } from "express";
import { userSchemaModel } from "../../../models/users/user.mongoose";
import { createJwtUserPayloadFactory } from "../auth-googles/helpers/create-jwt-user-payload-factory";
import { USER_ROLE } from "../auth-googles/constants/user-role.constant";
import { JwtTokenHelper } from "../auth-googles/helpers/jwt-token.helper";
import { IS_PRODUCTION_ENVIRONMENT } from "../../../configs/is-production-environment";
import { COOKIE_MAX_AGE } from "../auth-googles/constants/cookie-max-age";
import { userService } from "../../../services/user-services/user.service";
import { UserModel } from "../models/types/user-model.type";

export async function handleLoginFakeUser(
  request: Request<{}, {}, { email: string; password: string }>,
  response: Response
) {
  const { email, password } = request.body;

  const result = await userSchemaModel.findOne({ email, password });

  if (!result) {
    return response.status(401).json({ message: "Invalid credentials" });
  }

  const jwtPayload = createJwtUserPayloadFactory({
    accessToken: JwtTokenHelper.generateRandomAccessToken(),
    name: "Captein Admin Meow",
    email: "editor@monopress.com",
    picture:
      "https://mono-press-5a039da642a5.herokuapp.com/uploads/happy-cat.jpg",
    googleId: "7822355050144507",
    resources: {
      role: USER_ROLE.Editor,
    },
  });

  const token = JwtTokenHelper.create(jwtPayload);
  const mockGoogleId = "7822355050144507";

  await userService.updateUser(mockGoogleId, jwtPayload);

  response.cookie("access_token", token, {
    httpOnly: true,
    secure: IS_PRODUCTION_ENVIRONMENT,
    maxAge: COOKIE_MAX_AGE.THREE_HOURS,
  });

  response.status(200).json(result);
}

export async function handleLogoutFakeUser(
  request: Request,
  response: Response
) {
  const token = request.cookies.access_token;

  if (!token) {
    return response
      .status(401)
      .json({ message: "Session outdated. Please log in again." });
  }

  const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);

  const foundUser = await userService.findUserByAccessToken(accessToken);

  userService.updateUserAccessToken(foundUser!.googleId, "");

  response.clearCookie("access_token");
  response.status(204).end();
}
