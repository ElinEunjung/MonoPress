import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

import { JwtTokenHelper } from "../googles/helpers/jwt-token.helper";
import type { UserModel } from "../models/types/user-model.type";

export async function handleJwtCookieSession(req: Request, res: Response) {
  const token = req.cookies.access_token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Session outdated. Please log in again." });
  }

  try {
    const decodedToken = JwtTokenHelper.verifyAndDecrypt(token);

    type DecodedUserModelToken = UserModel & Pick<JwtPayload, "iat" | "exp">;

    const { email, name, picture, resources, accessToken } =
      decodedToken as DecodedUserModelToken;

    return res.status(200).json({
      accessToken,
      name,
      email,
      picture,
      resources,
    });
  } catch (error) {
    console.log("JWT verification failed:", (error as Error).message);
    res.clearCookie("access_token");

    return res
      .status(401)
      .json({ message: "Session outdated. Please log in again." });
  }
}
