import express from "express";
import { handleGetPublicNews } from "./public-news.controller";

const publicNewsRouter = express.Router();

publicNewsRouter.get("/public-news", handleGetPublicNews);

export { publicNewsRouter };
