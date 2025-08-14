import express from "express";

import { authGoogleRouter } from "./auth-googles/auth-google.router";
import { authJwtCookieSessionRouter } from "./auth-jwt-cookie-sessions/auth-jwt-cookie-session.router";
import { authFakeUserRouter } from "./auth-fake-users/auth-fake-user.router";

const authRouter = express.Router();

authRouter.use(authFakeUserRouter);
authRouter.use(authGoogleRouter);
authRouter.use(authJwtCookieSessionRouter);

export { authRouter };
