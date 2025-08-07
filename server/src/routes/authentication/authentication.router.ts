import dotenv from "dotenv";
import express from "express";
import {
  httpGetAuthGoogleLogin,
  httpGetGoogleLoginCallbackAsync,
} from "./authentication.controller";

dotenv.config();

const authenticationRouter = express.Router();

authenticationRouter.get("/login/google/start", httpGetAuthGoogleLogin);

authenticationRouter.get(
  "/login/google/callback",
  httpGetGoogleLoginCallbackAsync
);

export { authenticationRouter };
