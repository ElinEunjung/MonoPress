import express from "express";
import {
  handleCreateNews,
  handleEditNewsById,
  handleDeleteNewsById,
  handleGetNewsByUser,
} from "./news.controller";
import { multerStorage } from "./services/multer-storge.service";

const newsRouter = express.Router();

const uploadNewsImage = multerStorage.uploadToLocalServer().single("image");

newsRouter.post("/news", uploadNewsImage, handleCreateNews);
newsRouter.put("/news/:id", uploadNewsImage, handleEditNewsById);
newsRouter.delete("/news/:id", handleDeleteNewsById);
newsRouter.get("/news", handleGetNewsByUser);

export { newsRouter };
