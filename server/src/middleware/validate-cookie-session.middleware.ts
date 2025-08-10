import type { NextFunction, Request, Response } from "express";

export function validateCookieSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.access_token;

  if (!token) {
    // If there's no token cookie, the session is outdated or never existed
    return res
      .status(401)
      .json({ message: "Session outdated. Please log in again." });
  }

  try {
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
