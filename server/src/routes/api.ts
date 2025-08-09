import express from "express";

import { newsRouter } from "./news/news.router";
import { userRouter } from "./users/user.router";
import { googleAuthRouter } from "./google-auth/google-auth.router";
import { validateGoogleToken } from "../middleware/validate-google-token.middleware";

const api = express.Router();

api.use(googleAuthRouter);
api.use(validateGoogleToken);

api.use(userRouter);
api.use(newsRouter);

export { api };
