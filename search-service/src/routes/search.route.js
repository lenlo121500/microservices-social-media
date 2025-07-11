import express from "express";
import { searchPost } from "../controllers/search.controller.js";
import authenticateRequest from "../middleware/auth.middleware.js";

const searchRouter = express.Router();

searchRouter.use(authenticateRequest);
searchRouter.get("/posts", searchPost);

export default searchRouter;
