import express from "express";
import { handleGetArticles } from "./article-views.controller";

const articleViewsRouter = express.Router();

articleViewsRouter.get("/public-news", handleGetArticles);

export { articleViewsRouter };
