import express from "express";
import {
  handleToggleArticleReaction,
  handleGetArticleReactions,
} from "./articles.controller";

const articlesRouter = express.Router();

articlesRouter.get("/articles/:articleId/reactions", handleGetArticleReactions);
articlesRouter.post("/articles/:articleId/react", handleToggleArticleReaction);

export { articlesRouter };
