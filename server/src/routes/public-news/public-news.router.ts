import express from "express";
import {
  handleGetPublicNews,
  handleUpdatePublicNews,
} from "./public-news.controller";

const publicNewsRouter = express.Router();

publicNewsRouter.get("/public-news", handleGetPublicNews);
publicNewsRouter.put("/public-news/:id", handleUpdatePublicNews);

export { publicNewsRouter };
