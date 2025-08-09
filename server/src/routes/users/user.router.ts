import express from "express";
import { handleGetUserByAccessToken } from "./user.controller";

const userRouter = express.Router();

userRouter.get("/user", handleGetUserByAccessToken);

export { userRouter };
