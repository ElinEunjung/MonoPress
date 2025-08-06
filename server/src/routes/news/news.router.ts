import express from "express";
import { httpAddNews } from "./news.controller";

const newsRouter = express.Router();

newsRouter.post("/api/news", httpAddNews);

export { newsRouter };
