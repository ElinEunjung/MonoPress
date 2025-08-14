import express from "express";
import { handleLoginMongoDb } from "./mongo-login.controller";

const mongoLoginRouter = express.Router();

mongoLoginRouter.post("/login/mongo", handleLoginMongoDb);

export { mongoLoginRouter };
