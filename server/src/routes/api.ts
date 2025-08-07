import express from "express";
import { newsRouter } from "./news/news.router";
import { userRouter } from "./users/user.router";
import { authenticationRouter } from "./authentication/authentication.router";

const api = express.Router();

api.use(authenticationRouter);
api.use(userRouter);
api.use(newsRouter);

export { api };
