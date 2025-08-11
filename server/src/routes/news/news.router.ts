import express from "express";
import {
  handleAddNews,
  handleEditNewsById,
  handleDeleteNewsById,
  handleGetNewsByUser,
} from "./news.controller";

const newsRouter = express.Router();

newsRouter.get("/news", handleGetNewsByUser);
newsRouter.post("/news", handleAddNews);
newsRouter.put("/news/:id", handleEditNewsById);
newsRouter.delete("/news/:id", handleDeleteNewsById);

export { newsRouter };
