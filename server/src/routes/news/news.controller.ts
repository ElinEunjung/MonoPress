import type { Response, Request } from "express";
import { addNews } from "./models/news.model";
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
  const token = request.cookies.access_token;
  const newsId = request.params.id as string;
  const { title, category, content } = request.body;

  const { accessToken } = JwtToken.verifyAndDecrypt<UserModel>(token);
  const user = await newsService.findUserByAccessToken(accessToken);
  const userNews = await newsService.findNewsById(newsId, user!.googleId);

  const payload = {
    newsId: userNews!._id,
    googleId: user!.googleId,
    data: {
      title,
      category,
      content,
      updatedAt: new Date(),
    },
  };

  await newsService.updateNews(payload);

  response.status(201).end();
}

export async function handleAddNews(request: Request, response: Response) {
  try {
    const payload = request.body;
    const token = request.cookies.access_token;

    const { accessToken } = JwtToken.verifyAndDecrypt<UserModel>(token);
    const user = await userGoogleSchemaModel.findOne({ accessToken });

    const newNews = await addNews({
      user: {
        googleId: user!.googleId,
      },
      title: payload.title,
      category: payload.category,
      content: payload.content,
    });

    return response.status(201).json({
      message: "News added successfully",
      news: newNews,
    });
  } catch (error) {
    console.error("Error in handleAddNews:", error);
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
