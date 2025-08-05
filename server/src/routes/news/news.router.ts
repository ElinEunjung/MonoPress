import express from "express";
import { getAllNews } from "./news.controller";

const newsRouter = express.Router();

newsRouter.get("/api/hello", getAllNews);

export { newsRouter };
