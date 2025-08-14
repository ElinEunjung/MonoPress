import express from "express";
import {
  handleCreateArticle,
  handleEditArticleById,
  handleDeleteArticleById,
  handleGetArticleByUser,
} from "./editor-article.controller";
import { multerStorage } from "./services/multer-storge.service";

const editorArticleRouter = express.Router();

const uploadNewsImage = multerStorage.uploadToLocalServer().single("image");

editorArticleRouter.post("/news", uploadNewsImage, handleCreateArticle);
editorArticleRouter.put("/news/:id", uploadNewsImage, handleEditArticleById);
editorArticleRouter.delete("/news/:id", handleDeleteArticleById);
editorArticleRouter.get("/news", handleGetArticleByUser);

export { editorArticleRouter };
