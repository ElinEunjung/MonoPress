import { publicNewsService } from "./services/public-news.service";
import { Request, Response } from "express";

export async function handleGetPublicNews(
  _request: Request,
  response: Response,
) {
  const allNews = await publicNewsService.getPublicNews();
  return response.status(200).json(allNews);
}
