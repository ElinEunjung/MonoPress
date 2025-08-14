import express from "express";

import { googleAuthRouter } from "./googles/google-auth.router";
import { jwtCookieSessionRouter } from "./jwt-cookie-sessions/jwt-cookie-session.router";
import { mongoLoginRouter } from "./mongo-login/mongo-login.router";

const authRouter = express.Router();

authRouter.use(mongoLoginRouter);
authRouter.use(googleAuthRouter);
authRouter.use(jwtCookieSessionRouter);

export { authRouter };
