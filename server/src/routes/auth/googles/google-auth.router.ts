import dotenv from "dotenv";
import express from "express";
import {
  handleOAuthGoogleLogin,
  handleOAuthGoogleLogout,
  handleGetGoogleLoginCallback,
} from "./google-auth.controller";

dotenv.config();

const googleAuthRouter = express.Router();

googleAuthRouter.get("/auth/login", handleOAuthGoogleLogin);
googleAuthRouter.get("/auth/logout", handleOAuthGoogleLogout);
googleAuthRouter.get("/login/google/callback", handleGetGoogleLoginCallback);

export { googleAuthRouter };
