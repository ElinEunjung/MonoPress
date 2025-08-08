import express from "express";

import { newsRouter } from "./news/news.router";
import { userRouter } from "./users/user.router";
import { googleAuthRouter } from "./google-auth/google-auth.router";
import { googleTokenValidator } from "../middleware/google-token-validator.middleware";

const api = express.Router();

api.use(googleAuthRouter);
api.use(googleTokenValidator);

api.use(newsRouter);
api.use(userRouter);

export { api };
