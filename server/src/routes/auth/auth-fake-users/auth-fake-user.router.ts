import express from "express";
import {
  handleLoginFakeUser,
  handleLogoutFakeUser,
} from "./auth-fake-user.controller";

const authFakeUserRouter = express.Router();

authFakeUserRouter.post("/auth/login/fake-user", handleLoginFakeUser);
authFakeUserRouter.get("/auth/logout/fake-user", handleLogoutFakeUser);

export { authFakeUserRouter };
