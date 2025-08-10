import type { Response, Request } from "express";
import { addNews } from "./models/news.model";
import { JwtToken } from "../auth/googles/helpers/jwt-token.helper";
import { userGoogleSchemaModel } from "../auth/googles/models/user-google-schema.model";
import type { UserModel } from "../auth/models/types/user-model.type";

export function handleGetAllNews(request: Request, response: Response) {
  return response.json({
    message: "I GOT NEWWWWS",
  });
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
