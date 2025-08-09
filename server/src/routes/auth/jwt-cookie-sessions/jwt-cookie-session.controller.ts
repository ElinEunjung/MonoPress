import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../constants/global-jwt-token";

export async function handleJwtCookieSession(req: Request, res: Response) {
  const token = req.cookies.access_token;

  if (!token) {
    // If there's no token cookie, the session is outdated or never existed
    console.log("No token found in cookie.");
    return res
      .status(401)
      .json({ message: "Session outdated. Please log in again." });
  }

  try {
    // Verify the JWT with the secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("JWT is valid.", decoded);

    return res.status(200).end();
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
