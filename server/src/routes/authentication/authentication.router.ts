import dotenv from "dotenv";
import express from "express";
import {
  httpGetAuthGoogleLogin,
  httpGetGoogleLoginCallbackasync,
} from "./authentication.controller";

dotenv.config();

const authenticationRouter = express.Router();

authenticationRouter.get("/login/google/start", httpGetAuthGoogleLogin);

authenticationRouter.get(
  "/login/google/callback",
  httpGetGoogleLoginCallbackasync
);

export { authenticationRouter };
