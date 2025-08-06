import type { Response, Request } from "express";
import { addNews } from "./models/news.model";

export function getAllNews(request: Request, response: Response) {
  // addNews();
}

export async function httpAddNews(request: Request, response: Response) {
  const payload = request.body;
  await addNews(payload);

  return response.status(201).json({
    message: "News added successfully",
  });
}
