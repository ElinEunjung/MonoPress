import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

import { JWT_SECRET } from "../../../constants/global-jwt-token";
import type { UserModel } from "../models/types/user-model.type";

export async function handleJwtCookieSession(req: Request, res: Response) {
  const token = req.cookies.access_token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Session outdated. Please log in again." });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    type DecodedUserModelToken = UserModel & Pick<JwtPayload, "iat" | "exp">;

    const { email, name, picture, accessToken } =
      decodedToken as DecodedUserModelToken;

    return res.status(200).json({
      name,
      email,
      picture,
    });
  } catch (error) {
    // The token is invalid (e.g., expired or tampered with)
    console.log("JWT verification failed:", (error as Error).message);
    // Clear the cookie in the browser
    res.clearCookie("access_token");

    return res
      .status(401)
      .json({ message: "Session outdated. Please log in again." });
  }
}
