import { Request, Response } from "express";
import { newsSchemaModel } from "../../../models/news-schema.mongoose";
import { JwtTokenHelper } from "../../auth/auth-googles/helpers/jwt-token.helper";
import { UserModel } from "../../auth/models/types/user-model.type";
import { userService } from "../../../services/user-services/user.service";
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

export const handleGetComments = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;

    const article = await newsSchemaModel
      .findById(new Types.ObjectId(articleId))
      .lean();

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const processRecursivelyReplies = (items: any[]) => {
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
          processed.replies = processRecursivelyReplies(item.replies);
        }
        return processed;
      });
    };

    const comments = processRecursivelyReplies(article.comments || []);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

export const handleAddComment = async (req: Request, res: Response) => {
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
      new Types.ObjectId(articleId)
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

export const handleAddReply = async (req: Request, res: Response) => {
  try {
    const { articleId, commentId } = req.params;
    const { content } = req.body;

    if (!articleId || !commentId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - no token" });
    }

    const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);
    const user = await userService.findUserByAccessToken(accessToken);
    if (!user || !user.googleId) {
      return res.status(401).json({ message: "Unauthorized - no user" });
    }

    const article = await newsSchemaModel.findById(
      new Types.ObjectId(articleId)
    );
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

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

    let replyAdded = false;

    const topLevelComment = article.comments.id(new Types.ObjectId(commentId));

    if (topLevelComment) {
      topLevelComment.replies.push(newReply as any);
      replyAdded = true;
    } else {
      // Not found as top-level, searching nested replies..."

      const addToNestedReplies = (replies: any[]): boolean => {
        for (const reply of replies) {
          if (reply._id.toString() === commentId) {
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
      return res.status(404).json({ message: "Target comment not found" });
    }

    article.markModified("comments");
    await article.save();

    res.status(201).json({
      message: "Reply added successfully",
      reply: newReply,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Stack:", error.stack);
    }
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const handleToggleCommentReaction = async (
  req: Request,
  res: Response
) => {
  try {
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

    const article = await newsSchemaModel.findById(
      new Types.ObjectId(articleId)
    );
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

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

    targetComment = article.comments.id(new Types.ObjectId(commentId));

    if (!targetComment) {
      targetComment = findCommentOrReply(article.comments, commentId);
    }

    if (!targetComment) {
      return res.status(404).json({ message: "Comment/reply not found" });
    }

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
      (reaction: ReactionDocument) => reaction.userId === googleId
    );

    if (oppositeIndex !== -1) {
      // Removed from opposite reaction array
      oppositeArray.splice(oppositeIndex, 1);
    }

    // Toggle current reaction
    const existingIndex = reactionArray.findIndex(
      (reaction: ReactionDocument) => reaction.userId === googleId
    );
    if (existingIndex !== -1) {
      // Removed existing reaction
      reactionArray.splice(existingIndex, 1);
    } else {
      // Added new reaction
      reactionArray.push({ userId: googleId } as any);
    }

    article.markModified("comments");
    await article.save();

    res.status(200).json({
      message: "Reaction toggled successfully",
      reactions: targetComment.reactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling reaction", error });
  }
};

export const handleDeleteComment = async (req: Request, res: Response) => {
  try {
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

    const article = await newsSchemaModel.findById(
      new Types.ObjectId(articleId)
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    let commentDeleted = false;

    // First try to delete as a top-level comment
    const topLevelCommentIndex = article.comments.findIndex(
      (comment: any) => comment._id.toString() === commentId
    );

    if (topLevelCommentIndex !== -1) {
      // "Found as top-level comment, deleting...";
      article.comments.splice(topLevelCommentIndex, 1);
      commentDeleted = true;
    } else {
      // Function to recursively search and delete from nested replies
      const deleteFromNestedReplies = (replies: any[]): boolean => {
        for (let i = 0; i < replies.length; i++) {
          const reply = replies[i];

          // Check if this is the reply to delete
          if (reply._id.toString() === commentId) {
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
      return res.status(404).json({ message: "Comment/reply not found" });
    }

    // Comment/reply deleted, saving article
    article.markModified("comments");
    await article.save();

    res.status(200).json({
      message: "Comment/reply deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment/reply", error });
  }
};

export const handleEditComment = async (req: Request, res: Response) => {
  try {
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

    const article = await newsSchemaModel.findById(
      new Types.ObjectId(articleId)
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Function to find and edit comment or reply recursively
    let targetComment: any = null;
    const findAndHandleEditComment = (items: any[], id: string): boolean => {
      for (const item of items) {
        if (item._id.toString() === id) {
          // Check if user is authorized to edit this comment
          if (item.user.googleId !== googleId) {
            return false; // Will be handled as unauthorized
          }

          item.content = content;
          item.updatedAt = new Date();
          targetComment = item;
          return true;
        }

        if (item.replies && item.replies.length > 0) {
          if (findAndHandleEditComment(item.replies, id)) {
            return true;
          }
        }
      }
      return false;
    };

    const commentFound = findAndHandleEditComment(article.comments, commentId);

    if (!commentFound) {
      return res.status(404).json({ message: "Comment/reply not found" });
    }

    if (!targetComment) {
      return res
        .status(403)
        .json({ message: "You can only edit your own comments" });
    }

    article.markModified("comments");
    await article.save();

    res.status(200).json({
      message: "Comment/reply updated successfully",
      comment: targetComment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error editing comment/reply", error });
  }
};
