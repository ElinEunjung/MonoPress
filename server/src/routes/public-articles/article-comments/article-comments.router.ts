import express from "express";
import {
  handleAddComment,
  handleAddReply,
  handleDeleteComment,
  handleEditComment,
  handleToggleCommentReaction,
  handleGetComments,
} from "./article-comment.controller";

const articleCommentsRouter = express.Router();

// TODO: implementere middleware for å sjekke om brukeren har rettigheter til å skrive kommentarer eller ikke
articleCommentsRouter.use((req, res, next) => {
  next();
});

articleCommentsRouter.get("/articles/:articleId/comments", handleGetComments);
articleCommentsRouter.post("/articles/:articleId/comments", handleAddComment);
articleCommentsRouter.post(
  "/articles/:articleId/comments/:commentId/replies",
  handleAddReply
);
articleCommentsRouter.post(
  "/articles/:articleId/comments/:commentId/replies/:replyId/replies",
  handleAddReply
);

articleCommentsRouter.post(
  "/articles/:articleId/comments/:commentId/react",
  handleToggleCommentReaction
);

articleCommentsRouter.put(
  "/articles/:articleId/comments/:commentId",
  handleEditComment
);

articleCommentsRouter.delete(
  "/articles/:articleId/comments/:commentId",
  handleDeleteComment
);

export { articleCommentsRouter };
