import express from "express";

import { editorArticleRouter } from "./editor-articles/editor-article.router";
import { authRouter } from "./auth/auth.router";
import { validateCookieSession } from "../middleware/validate-cookie-session.middleware";
import { publicNewsRouter } from "./public-news/public-news.router";
import { commentsRouter } from "./comments.routes";
import { articlesRouter } from "./articles.routes";

const api = express.Router();

api.use(publicNewsRouter);
api.use(authRouter);

api.use(validateCookieSession); // Middleware for validating cookie session

api.use(commentsRouter);
api.use(articlesRouter);
api.use(editorArticleRouter);

export { api };
