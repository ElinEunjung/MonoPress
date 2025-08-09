import express from "express";

import { newsRouter } from "./news/news.router";
import { userRouter } from "./users/user.router";
import { authRouter } from "./auth/auth.router";
import { validateCookieSession } from "../middleware/validate-cookie-session.middleware";

const api = express.Router();

api.use(authRouter);
api.use(validateCookieSession);

api.use(userRouter);
api.use(newsRouter);

export { api };
