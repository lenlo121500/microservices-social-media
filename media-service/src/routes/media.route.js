import express from "express";
import authenticateRequest from "../middleware/auth.middleware.js";
import upload from "../config/multer.js";
import logger from "../utils/logger.js";
import APIError from "../utils/APIError.js";
import { uploadMedia } from "../controllers/media.controller.js";

const mediaRouter = express.Router();

mediaRouter.post(
  "/upload",
  authenticateRequest,
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        logger.error(`Multer error while uploading: ${err.message}`);
        return next(new APIError(400, err.message));
      } else if (err) {
        logger.error(`Unknown error occured while uploading: ${err.message}`);
        return next(new APIError(500, err.message));
      }
      if (!req.file) {
        logger.error("No file uploaded.");
        return next(new APIError(400, "No file uploaded."));
      }
      next();
    });
  },
  uploadMedia
);

export default mediaRouter;
