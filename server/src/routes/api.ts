import express from "express";
import { newsRouter } from "./news/news.router";
import { userRouter } from "./users/user.router";

const api = express.Router();

api.use(userRouter);
api.use(newsRouter);

export { api };
