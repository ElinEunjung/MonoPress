import express from "express";

import { newsRouter } from "./news/news.router";
import { authRouter } from "./auth/auth.router";
import { validateCookieSession } from "../middleware/validate-cookie-session.middleware";
import { publicNewsRouter } from "./public-news/public-news.router";
import { commentsRouter } from "./comments.routes";
import { articlesRouter } from "./articles.routes";

const api = express.Router();

api.use(publicNewsRouter);
api.use(authRouter);
api.use(validateCookieSession);
api.use(commentsRouter);
api.use(articlesRouter);

api.use(newsRouter);

export { api };
