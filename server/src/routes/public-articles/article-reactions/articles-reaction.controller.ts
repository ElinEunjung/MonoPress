import { Request, Response } from "express";
import { newsSchemaModel } from "../../../models/news-schema.mongoose";
import { JwtTokenHelper } from "../../auth/auth-googles/helpers/jwt-token.helper";
import { UserModel } from "../../auth/models/types/user-model.type";
import { userService } from "../../../services/user-services/user.service";
import { Types, Document } from "mongoose";

interface ReactionDocument extends Document {
  userId: string;
}

export async function handleToggleArticleReaction(req: Request, res: Response) {
  try {
    const token = req.cookies.access_token;
    const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);
    const user = await userService.findUserByAccessToken(accessToken);
    const googleId = user!.googleId;
    const { articleId } = req.params;
    const { reactionType } = req.body as { reactionType: "like" | "dislike" };

    if (!googleId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!articleId) {
      return res.status(400).json({ message: "Article ID is required" });
    }

    if (!reactionType || !["like", "dislike"].includes(reactionType)) {
      return res
        .status(400)
        .json({ message: "Valid reaction type is required (like or dislike)" });
    }

    console.log("Looking for article:", articleId);
    const article = await newsSchemaModel.findById(
      new Types.ObjectId(articleId)
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log("Article found, toggling reaction");

    // Ensure reaction structure exists and is properly initialized
    if (!article.reaction) {
      article.reaction = {
        likes: [],
        dislikes: [],
      } as any;
    }

    // Ensure likes and dislikes arrays exist and are properly initialized
    if (!article.reaction.likes || !Array.isArray(article.reaction.likes)) {
      article.set("reaction.likes", []);
    }
    if (
      !article.reaction.dislikes ||
      !Array.isArray(article.reaction.dislikes)
    ) {
      article.set("reaction.dislikes", []);
    }

    const reactionArray =
      reactionType === "like"
        ? article.reaction.likes
        : article.reaction.dislikes;

    const oppositeArray =
      reactionType === "like"
        ? article.reaction.dislikes
        : article.reaction.likes;

    // Remove from opposite reaction if exists
    const oppositeIndex = oppositeArray.findIndex(
      (r: ReactionDocument) => r.userId === googleId
    );
    if (oppositeIndex !== -1) {
      oppositeArray.splice(oppositeIndex, 1);
      console.log("Removed from opposite reaction array");
    }

    // Toggle current reaction
    const existingIndex = reactionArray.findIndex(
      (r: ReactionDocument) => r.userId === googleId
    );
    if (existingIndex !== -1) {
      reactionArray.splice(existingIndex, 1);
      console.log("Removed existing reaction");
    } else {
      // Use Mongoose's push method to properly create subdocuments
      reactionArray.push({ userId: googleId });
      console.log("Added new reaction");
    }

    await article.save();

    res.status(200).json({
      message: "Article reaction toggled successfully",
      reactions: {
        likes: article.reaction.likes.length,
        dislikes: article.reaction.dislikes.length,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error toggling article reaction", error });
  }
}

export async function handleGetArticleReactions(req: Request, res: Response) {
  try {
    const { articleId } = req.params;

    if (!articleId) {
      return res.status(400).json({ message: "Article ID is required" });
    }

    const article = await newsSchemaModel.findById(
      new Types.ObjectId(articleId)
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Get reaction counts from arrays
    let likesCount = 0;
    let dislikesCount = 0;

    if (article.reaction) {
      likesCount = article.reaction.likes?.length || 0;
      dislikesCount = article.reaction.dislikes?.length || 0;
    }

    res.status(200).json({
      reactions: {
        likes: likesCount,
        dislikes: dislikesCount,
      },
    });
  } catch (error) {
    console.error("Error getting article reactions:", error);
    res.status(500).json({ message: "Error getting article reactions", error });
  }
}
