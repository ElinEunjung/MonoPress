import dotenv from "dotenv";
import express from "express";
import {
  handleOAuthGoogleLogin,
  handleOAuthGoogleLogout,
  handleGetGoogleLoginCallback,
} from "./auth-google.controller";

dotenv.config();

const authGoogleRouter = express.Router();

authGoogleRouter.get("/auth/login", handleOAuthGoogleLogin);
authGoogleRouter.get("/auth/logout", handleOAuthGoogleLogout);
authGoogleRouter.get("/login/google/callback", handleGetGoogleLoginCallback);

export { authGoogleRouter };
