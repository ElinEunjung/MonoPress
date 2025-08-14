import express from "express";
import {
  addComment,
  addReply,
  deleteComment,
  editComment,
  toggleReaction,
  getComments,
} from "./comments.controller";

const commentsRouter = express.Router();

// Route handler to log all requests
commentsRouter.use((req, res, next) => {
  console.log("Comments router handling:", req.method, req.path);
  next();
});

// Get comments for an article
commentsRouter.get("/articles/:articleId/comments", getComments);

// Add a new comment to an article
commentsRouter.post("/articles/:articleId/comments", addComment);

// Add a reply to a comment or another reply
commentsRouter.post(
  "/articles/:articleId/comments/:commentId/replies",
  addReply
);
commentsRouter.post(
  "/articles/:articleId/comments/:commentId/replies/:replyId/replies",
  addReply
);

// Toggle reaction (like/dislike) on a comment
commentsRouter.post(
  "/articles/:articleId/comments/:commentId/react",
  toggleReaction
);

// Edit a comment or reply
commentsRouter.put("/articles/:articleId/comments/:commentId", editComment);

// Delete a comment
commentsRouter.delete(
  "/articles/:articleId/comments/:commentId",
  deleteComment
);

export { commentsRouter };
