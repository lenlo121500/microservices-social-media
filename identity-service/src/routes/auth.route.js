import express from "express";
import {
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh-token", refreshUserToken);
authRouter.post("/logout", logoutUser);

export default authRouter;
