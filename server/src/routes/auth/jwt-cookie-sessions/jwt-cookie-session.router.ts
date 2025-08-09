import express from "express";
import { handleJwtCookieSession } from "./jwt-cookie-session.controller";

const jwtCookieSessionRouter = express.Router();

jwtCookieSessionRouter.get("/auth/validate-session", handleJwtCookieSession);

export { jwtCookieSessionRouter };
