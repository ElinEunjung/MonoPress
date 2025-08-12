import type { Response, Request } from "express";
import { JwtToken } from "../auth/googles/helpers/jwt-token.helper";
import type { UserModel } from "../auth/models/types/user-model.type";
import { newsService } from "./services/news.service";
import { userGoogleSchemaModel } from "../auth/googles/models/user-google-schema.model";

export async function handleGetNewsByUser(
  request: Request,
  response: Response,
) {
  try {
    const token = request.cookies.access_token;

    const { accessToken } = JwtToken.verifyAndDecrypt<UserModel>(token);
    const user = await newsService.findUserByAccessToken(accessToken);
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

    const { accessToken } = JwtToken.verifyAndDecrypt<UserModel>(token);
    const user = await newsService.findUserByAccessToken(accessToken);
    const userNews = await newsService.findNewsById(newsId, user!.googleId);

    let finalImageUrl = userNews!.imageUrl; // Default to existing image

    // If there's a new file uploaded, process it
    if (request.file) {
      let rootUri = "http://localhost:3000";
      const isProductionEnvironment = process.env.NODE_ENV === "production";
      if (isProductionEnvironment) {
        rootUri = "https://mono-press-5a039da642a5.herokuapp.com/";
      }
      finalImageUrl = `${rootUri}/uploads/${request.file.filename}`;
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

    const { accessToken } = JwtToken.verifyAndDecrypt<UserModel>(token);
    const user = await userGoogleSchemaModel.findOne({ accessToken });

    let rootUri = "http://localhost:3000";

    const isProductionEnvironment = process.env.NODE_ENV === "production";
    if (isProductionEnvironment) {
      rootUri = "https://mono-press-5a039da642a5.herokuapp.com/";
    }

    const fileUrl = `${rootUri}/uploads/${request.file.filename}`;

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
  response: Response,
) {
  const token = request.cookies.access_token;
  const newsId = request.params.id as string;

  const { accessToken } = JwtToken.verifyAndDecrypt<UserModel>(token);
  const user = await newsService.findUserByAccessToken(accessToken);

  await newsService.deleteNewsById(newsId, user!.googleId);

  return response.status(204).end();
}
