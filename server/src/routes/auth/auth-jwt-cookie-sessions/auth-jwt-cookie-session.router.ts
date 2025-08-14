import express from "express";
import { handleJwtCookieSession } from "./auth-jwt-cookie-session.controller";

const authJwtCookieSessionRouter = express.Router();

authJwtCookieSessionRouter.get(
  "/auth/validate-session",
  handleJwtCookieSession
);

export { authJwtCookieSessionRouter };
