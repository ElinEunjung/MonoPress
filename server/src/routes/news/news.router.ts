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
newsRouter.get("/news", handleGetNewsByUser);
newsRouter.put("/news/:id", handleEditNewsById);
newsRouter.delete("/news/:id", handleDeleteNewsById);

export { newsRouter };
