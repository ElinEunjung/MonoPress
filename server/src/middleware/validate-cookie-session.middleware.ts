import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/global-jwt-token";

export function validateCookieSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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

    // The session is valid. You can now use the decoded data (e.g., decoded.userId)
    // res.status(200).json({ message: "Session is valid!", user: decoded });
    next();
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
