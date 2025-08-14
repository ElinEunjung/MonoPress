import { articleViewsService } from "./services/article-views.service";
import { Request, Response } from "express";

export async function handleGetArticles(_request: Request, response: Response) {
  const allNews = await articleViewsService.getPublicNews();
  return response.status(200).json(allNews);
}
