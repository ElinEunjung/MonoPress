import express from "express";
import { handleAddNews, handleGetAllNews } from "./news.controller";

const newsRouter = express.Router();

newsRouter.get("/news", handleGetAllNews);
newsRouter.post("/news", handleAddNews);

export { newsRouter };
