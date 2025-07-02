import express from "express";
import authenticateRequest from "../middleware/auth.middleware.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/post.controller.js";
import {
  globalLimiter,
  sensitiveLimiter,
} from "../middleware/expressRateLimit.js";

const postRouter = express.Router();

postRouter.use(authenticateRequest);
postRouter.post("/", sensitiveLimiter, createPost);
postRouter.get("/", globalLimiter, getAllPosts);
postRouter.get("/:id", globalLimiter, getPost);
postRouter.put("/:id", sensitiveLimiter, updatePost);
postRouter.delete("/:id", sensitiveLimiter, deletePost);

export default postRouter;
