import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/profile", authenticate, getUserProfile);
userRouter.put("/profile", authenticate, updateUserProfile);
userRouter.delete("/profile", authenticate, updateUserProfile);

export default userRouter;
