import express from "express";
import {
  toggleArticleReaction,
  getArticleReactions,
} from "../controllers/articles.controller";

const articlesRouter = express.Router();

// Route handler to log all requests
articlesRouter.use((req, res, next) => {
  next();
});

// Get reactions for an article
articlesRouter.get("/articles/:articleId/reactions", getArticleReactions);

// Toggle reaction (like/dislike) on an article
articlesRouter.post("/articles/:articleId/react", toggleArticleReaction);

export { articlesRouter };
