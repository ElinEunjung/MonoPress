import dotenv from "dotenv";
import express from "express";
import {
  httpGetAuthGoogleLogin,
  httpGetGoogleLoginCallbackAsync,
  httpGetGoogleEndSession,
} from "./auth.controller";

dotenv.config();

const authenticationRouter = express.Router();

authenticationRouter.get("/auth/login", httpGetAuthGoogleLogin);
authenticationRouter.post("/auth/logout", httpGetGoogleEndSession);

authenticationRouter.get(
  "/login/google/callback",
  httpGetGoogleLoginCallbackAsync
);

export { authenticationRouter };
