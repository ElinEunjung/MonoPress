import { Request, Response } from "express";
import { newsSchemaModel } from "../models/news-schema.mongoose";
import { JwtTokenHelper } from "../routes/auth/googles/helpers/jwt-token.helper";
import { UserModel } from "../routes/auth/models/types/user-model.type";
import { userService } from "../services/user.service";
import { Types, Document } from "mongoose";

interface ReactionDocument extends Document {
  userId: string;
}

interface IReactions {
  likes: ReactionDocument[];
  dislikes: ReactionDocument[];
}

interface ReplyDocument extends Document {
  _id: Types.ObjectId;
  user: {
    googleId: string;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  reactions?: IReactions;
}

interface CommentDocument extends Document {
  _id: Types.ObjectId;
  user: {
    googleId: string;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  reactions?: IReactions;
  replies: ReplyDocument[];
}

export const getComments = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;

    const article = await newsSchemaModel
      .findById(new Types.ObjectId(articleId))
      .lean();

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Function to recursively process replies and add proper IDs
    const processReplies = (items: any[]) => {
      return items.map((item) => {
        const processed = {
          ...item,
          _id: item._id.toString(),
          reactions: {
            likes: item.reactions?.likes || [],
            dislikes: item.reactions?.dislikes || [],
          },
        };
        if (item.replies && item.replies.length > 0) {
          processed.replies = processReplies(item.replies);
        }
        return processed;
      });
    };

    // Process all comments and their replies
    const processedComments = processReplies(article.comments || []);
    res.status(200).json(processedComments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.access_token;
    const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);
    const user = await userService.findUserByAccessToken(accessToken);
    const googleId = user!.googleId;
    const { articleId } = req.params;
    const { content } = req.body;

    if (!googleId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const article = await newsSchemaModel.findById(
      new Types.ObjectId(articleId),
    );
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const newComment = {
      _id: new Types.ObjectId(),
      user: { googleId },
      content,
      createdAt: new Date(),
      updatedAt: null,
      reactions: {
        likes: [],
        dislikes: [],
      },
      replies: [],
    };

    article.comments.push(newComment);
    await article.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

export const addReply = async (req: Request, res: Response) => {
  console.log("=== ADD REPLY START ===");
  console.log("Request params:", req.params);
  console.log("Request body:", req.body);

  try {
    const { articleId, commentId } = req.params;
    const { content } = req.body;

    // Basic validation
    if (!articleId || !commentId || !content) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get user info
    const token = req.cookies.access_token;
    if (!token) {
      console.log("No access token");
      return res.status(401).json({ message: "Unauthorized - no token" });
    }

    const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);
    const user = await userService.findUserByAccessToken(accessToken);
    if (!user || !user.googleId) {
      console.log("No user found");
      return res.status(401).json({ message: "Unauthorized - no user" });
    }

    console.log("User authenticated:", user.googleId);

    // Find article
    const article = await newsSchemaModel.findById(
      new Types.ObjectId(articleId),
    );
    if (!article) {
      console.log("Article not found");
      return res.status(404).json({ message: "Article not found" });
    }

    console.log("Article found with", article.comments.length, "comments");

    // Create new reply object
    const newReply = {
      _id: new Types.ObjectId(),
      user: { googleId: user.googleId },
      content,
      createdAt: new Date(),
      updatedAt: null,
      reactions: {
        likes: [],
        dislikes: [],
      },
      replies: [],
    };

    console.log("Created new reply object");

    // Find target comment and add reply
    let replyAdded = false;

    // First try to find it as a top-level comment
    const topLevelComment = article.comments.id(new Types.ObjectId(commentId));
    if (topLevelComment) {
      console.log("Found as top-level comment");
      topLevelComment.replies.push(newReply as any);
      replyAdded = true;
    } else {
      console.log("Not found as top-level, searching nested replies...");

      // Search recursively in nested replies
      const addToNestedReplies = (replies: any[]): boolean => {
        for (const reply of replies) {
          if (reply._id.toString() === commentId) {
            console.log("Found in nested replies");
            // Initialize replies array if it doesn't exist
            if (!reply.replies) {
              reply.replies = [];
            }
            reply.replies.push(newReply as any);
            return true;
          }
          if (reply.replies && reply.replies.length > 0) {
            if (addToNestedReplies(reply.replies)) {
              return true;
            }
          }
        }
        return false;
      };

      // Search through all comments' replies
      for (const comment of article.comments) {
        if (comment.replies && comment.replies.length > 0) {
          if (addToNestedReplies(comment.replies)) {
            replyAdded = true;
            break;
          }
        }
      }
    }

    if (!replyAdded) {
      console.log("Target comment not found:", commentId);
      return res.status(404).json({ message: "Target comment not found" });
    }

    console.log("Reply added, saving article...");
    article.markModified("comments");
    await article.save();

    console.log("Article saved successfully");
    console.log("=== ADD REPLY SUCCESS ===");

    res.status(201).json({
      message: "Reply added successfully",
      reply: newReply,
    });
  } catch (error) {
    console.error("=== ADD REPLY ERROR ===");
    console.error("Error:", error);
    if (error instanceof Error) {
      console.error("Stack:", error.stack);
    }
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const toggleReaction = async (req: Request, res: Response) => {
  try {
    console.log("=== TOGGLE REACTION START ===");
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);

    const token = req.cookies.access_token;
    const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);
    const user = await userService.findUserByAccessToken(accessToken);
    const googleId = user!.googleId;
    const { articleId, commentId } = req.params;
    const { reactionType } = req.body as { reactionType: "like" | "dislike" };

    if (!googleId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!commentId) {
      return res.status(400).json({ message: "Comment ID is required" });
    }

    console.log("Looking for article:", articleId);
    const article = await newsSchemaModel.findById(
      new Types.ObjectId(articleId),
    );
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log("Article found, searching for comment/reply:", commentId);

    // Function to find comment or reply recursively
    let targetComment: any = null;
    const findCommentOrReply = (items: any[], id: string): any => {
      for (const item of items) {
        if (item._id.toString() === id) {
          return item;
        }
        if (item.replies && item.replies.length > 0) {
          const found = findCommentOrReply(item.replies, id);
          if (found) return found;
        }
      }
      return null;
    };

    // First try to find as top-level comment
    targetComment = article.comments.id(new Types.ObjectId(commentId));

    // If not found at top level, search in nested replies
    if (!targetComment) {
      console.log(
        "Not found as top-level comment, searching in nested replies...",
      );
      targetComment = findCommentOrReply(article.comments, commentId);
    }

    if (!targetComment) {
      console.log("Comment/reply not found:", commentId);
      return res.status(404).json({ message: "Comment/reply not found" });
    }

    console.log("Found target comment/reply:", targetComment._id.toString());

    // Ensure reactions object exists
    if (!targetComment.reactions) {
      targetComment.reactions = {
        likes: [],
        dislikes: [],
      };
    }

    const reactionArray =
      reactionType === "like"
        ? targetComment.reactions.likes
        : targetComment.reactions.dislikes;

    const oppositeArray =
      reactionType === "like"
        ? targetComment.reactions.dislikes
        : targetComment.reactions.likes;

    // Remove from opposite reaction if exists
    const oppositeIndex = oppositeArray.findIndex(
      (r: ReactionDocument) => r.userId === googleId,
    );
    if (oppositeIndex !== -1) {
      oppositeArray.splice(oppositeIndex, 1);
      console.log("Removed from opposite reaction array");
    }

    // Toggle current reaction
    const existingIndex = reactionArray.findIndex(
      (r: ReactionDocument) => r.userId === googleId,
    );
    if (existingIndex !== -1) {
      reactionArray.splice(existingIndex, 1);
      console.log("Removed existing reaction");
    } else {
      reactionArray.push({ userId: googleId } as any);
      console.log("Added new reaction");
    }

    // Mark the document as modified
    article.markModified("comments");
    await article.save();

    console.log("Article saved successfully");
    console.log("=== TOGGLE REACTION SUCCESS ===");

    res.status(200).json({
      message: "Reaction toggled successfully",
      reactions: targetComment.reactions,
    });
  } catch (error) {
    console.error("=== TOGGLE REACTION ERROR ===");
    console.error("Error:", error);
    res.status(500).json({ message: "Error toggling reaction", error });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    console.log("=== DELETE COMMENT START ===");
    console.log("Request params:", req.params);

    const token = req.cookies.access_token;
    const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);
    const user = await userService.findUserByAccessToken(accessToken);
    const googleId = user!.googleId;
    const { articleId, commentId } = req.params;

    if (!googleId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!commentId) {
      return res.status(400).json({ message: "Comment ID is required" });
    }

    console.log("Looking for article:", articleId);
    const article = await newsSchemaModel.findById(
      new Types.ObjectId(articleId),
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log(
      "Article found, searching for comment/reply to delete:",
      commentId,
    );

    let commentDeleted = false;

    // First try to delete as a top-level comment
    const topLevelCommentIndex = article.comments.findIndex(
      (comment: any) => comment._id.toString() === commentId,
    );

    if (topLevelCommentIndex !== -1) {
      console.log("Found as top-level comment, deleting...");
      article.comments.splice(topLevelCommentIndex, 1);
      commentDeleted = true;
    } else {
      console.log(
        "Not found as top-level comment, searching in nested replies...",
      );

      // Function to recursively search and delete from nested replies
      const deleteFromNestedReplies = (replies: any[]): boolean => {
        for (let i = 0; i < replies.length; i++) {
          const reply = replies[i];

          // Check if this is the reply to delete
          if (reply._id.toString() === commentId) {
            console.log("Found nested reply to delete");
            replies.splice(i, 1);
            return true;
          }

          // If this reply has nested replies, search in them
          if (reply.replies && reply.replies.length > 0) {
            if (deleteFromNestedReplies(reply.replies)) {
              return true;
            }
          }
        }
        return false;
      };

      // Search through all top-level comments' replies
      for (const comment of article.comments) {
        if (comment.replies && comment.replies.length > 0) {
          if (deleteFromNestedReplies(comment.replies)) {
            commentDeleted = true;
            break;
          }
        }
      }
    }

    if (!commentDeleted) {
      console.log("Comment/reply not found:", commentId);
      return res.status(404).json({ message: "Comment/reply not found" });
    }

    console.log("Comment/reply deleted, saving article...");
    article.markModified("comments");
    await article.save();

    console.log("Article saved successfully");
    console.log("=== DELETE COMMENT SUCCESS ===");

    res.status(200).json({
      message: "Comment/reply deleted successfully",
    });
  } catch (error) {
    console.error("=== DELETE COMMENT ERROR ===");
    console.error("Error:", error);
    res.status(500).json({ message: "Error deleting comment/reply", error });
  }
};

export const editComment = async (req: Request, res: Response) => {
  try {
    console.log("=== EDIT COMMENT START ===");
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);

    const token = req.cookies.access_token;
    const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);
    const user = await userService.findUserByAccessToken(accessToken);
    const googleId = user!.googleId;
    const { articleId, commentId } = req.params;
    const { content } = req.body;

    if (!googleId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!commentId || !content) {
      return res
        .status(400)
        .json({ message: "Comment ID and content are required" });
    }

    console.log("Looking for article:", articleId);
    const article = await newsSchemaModel.findById(
      new Types.ObjectId(articleId),
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log(
      "Article found, searching for comment/reply to edit:",
      commentId,
    );

    // Function to find and edit comment or reply recursively
    let targetComment: any = null;
    const findAndEditComment = (items: any[], id: string): boolean => {
      for (const item of items) {
        if (item._id.toString() === id) {
          // Check if user is authorized to edit this comment
          if (item.user.googleId !== googleId) {
            return false; // Will be handled as unauthorized
          }

          console.log("Found target comment/reply, updating content");
          item.content = content;
          item.updatedAt = new Date();
          targetComment = item;
          return true;
        }

        if (item.replies && item.replies.length > 0) {
          if (findAndEditComment(item.replies, id)) {
            return true;
          }
        }
      }
      return false;
    };

    // Search for the comment/reply to edit
    const commentFound = findAndEditComment(article.comments, commentId);

    if (!commentFound) {
      console.log("Comment/reply not found:", commentId);
      return res.status(404).json({ message: "Comment/reply not found" });
    }

    if (!targetComment) {
      console.log("User not authorized to edit this comment");
      return res
        .status(403)
        .json({ message: "You can only edit your own comments" });
    }

    console.log("Comment/reply updated, saving article...");
    article.markModified("comments");
    await article.save();

    console.log("Article saved successfully");
    console.log("=== EDIT COMMENT SUCCESS ===");

    res.status(200).json({
      message: "Comment/reply updated successfully",
      comment: targetComment,
    });
  } catch (error) {
    console.error("=== EDIT COMMENT ERROR ===");
    console.error("Error:", error);
    res.status(500).json({ message: "Error editing comment/reply", error });
  }
};
