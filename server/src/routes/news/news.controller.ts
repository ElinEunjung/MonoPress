import type { Response, Request } from "express";
import path from "path";
import { JwtTokenHelper } from "../auth/googles/helpers/jwt-token.helper";
import type { UserModel } from "../auth/models/types/user-model.type";
import { newsService } from "./services/news.service";
import { userSchemaModel } from "../../models/users/user.mongoose";
import { userService } from "../../services/user.service";

export async function handleGetNewsByUser(
  request: Request,
  response: Response
) {
  try {
    const token = request.cookies.access_token;

    const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);
    const user = await userService.findUserByAccessToken(accessToken);
    const userNews = await newsService.getUserNewsByGoogleId(user!.googleId);

    return response.status(200).json(userNews);
  } catch (error) {
    console.error("Error in handleGetNewsByUser:", error);
    return response.status(500).json({
      message: "Failed to retrieve news",
      error: (error as Error).message,
    });
  }
}

export async function handleEditNewsById(request: Request, response: Response) {
  try {
    const token = request.cookies.access_token;
    const newsId = request.params.id as string;
    const { title, category, content, imageUrl } = request.body;

    const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);
    const user = await userService.findUserByAccessToken(accessToken);
    const userNews = await newsService.findNewsById(newsId, user!.googleId);

    let finalImageUrl = userNews!.imageUrl; // Default to existing image

    // If there's a new file uploaded, process it
    if (request.file) {
      finalImageUrl = `https://mono-press-5a039da642a5.herokuapp.com/uploads/${request.file.filename}`;
    } else if (imageUrl) {
      // If no new file but imageUrl provided in body, use that
      finalImageUrl = imageUrl;
    }

    const payload = {
      newsId: userNews!._id,
      googleId: user!.googleId,
      data: {
        title,
        category,
        content,
        imageUrl: finalImageUrl,
        updatedAt: new Date(),
      },
    };

    await newsService.updateNews(payload);
    response.status(201).end();
  } catch (error) {
    console.error("Error in handleEditNewsById:", error);
    return response.status(500).json({
      message: "Failed to update news",
      error: (error as Error).message,
    });
  }
}

export async function handleCreateNews(request: Request, response: Response) {
  try {
    if (!request.file) {
      return response.status(400).json({ message: "No file uploaded." });
    }

    const { title, category, content } = request.body;

    const hasSameTitle = await newsService.hasSameNewsTitle(title);
    if (hasSameTitle) {
      return response.status(400).json({
        message: "Nyhets artikkelen av samme navn eksisterer allerede",
      });
    }

    const token = request.cookies.access_token;

    const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);
    const user = await userSchemaModel.findOne({ accessToken });

    const fileUrl = `https://mono-press-5a039da642a5.herokuapp.com/uploads/${request.file.filename}`;

    await newsService.createNews({
      user: {
        googleId: user!.googleId,
      },
      title,
      category,
      content,
      imageUrl: fileUrl,
    });

    return response.status(201).end();
  } catch (error) {
    console.error("Error in handleCreateNews:", error);
    return response.status(500).json({
      message: "Failed to add news",
      error: (error as Error).message,
    });
  }
}

export async function handleDeleteNewsById(
  request: Request,
  response: Response
) {
  try {
    const token = request.cookies.access_token;
    const newsId = request.params.id as string;

    const { accessToken } = JwtTokenHelper.verifyAndDecrypt<UserModel>(token);
    const user = await userService.findUserByAccessToken(accessToken);

    // Get the news article before deleting it to get the image URL
    const newsToDelete = await newsService.findNewsById(newsId, user!.googleId);

    if (!newsToDelete) {
      return response.status(404).json({
        message: "Article not found",
      });
    }

    // Delete the news article from the database
    await newsService.deleteNewsById(newsId, user!.googleId);

    // Delete the associated image file if it exists
    if (newsToDelete.imageUrl) {
      const { fileUtils } = await import("../../utils/file.utils");
      const fileName = fileUtils.getFileNameFromUrl(newsToDelete.imageUrl);

      if (fileName) {
        const filePath = path.join(
          __dirname,
          "../../../public/uploads",
          fileName
        );
        try {
          await fileUtils.deleteFile(filePath);
        } catch (error) {
          console.error("Error deleting image file:", error);
        }
      }
    }

    return response.status(204).end();
  } catch (error) {
    console.error("Error in handleDeleteNewsById:", error);
    return response.status(500).json({
      message: "Failed to delete news",
      error: (error as Error).message,
    });
  }
}
