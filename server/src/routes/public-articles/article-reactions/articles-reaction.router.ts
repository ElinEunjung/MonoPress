import express from "express";
import {
  handleToggleArticleReaction,
  handleGetArticleReactions,
} from "./articles-reaction.controller";

const articleReactionRouter = express.Router();

// TODO: implementere middleware for å sjekke om brukeren har rettigheter til å skrive kommentarer eller ikke
articleReactionRouter.use((req, res, next) => {
  // console.log("Reactions router handling:", req.method, req.path);
  next();
});

articleReactionRouter.get(
  "/articles/:articleId/reactions",
  handleGetArticleReactions
);
articleReactionRouter.post(
  "/articles/:articleId/react",
  handleToggleArticleReaction
);

export { articleReactionRouter };
