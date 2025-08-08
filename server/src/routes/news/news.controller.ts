import type { Response, Request } from "express";
import { addNews } from "./models/news.model";

export function handleGetAllNews(request: Request, response: Response) {
  return response.json({
    message: "I GOT NEWWWWS",
  });
}

export async function handleAddNews(request: Request, response: Response) {
  const payload = request.body;
  await addNews(payload);

  return response.status(201).json({
    message: "News added successfully",
  });
}
