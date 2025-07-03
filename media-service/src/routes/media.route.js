import express from "express";
import authenticateRequest from "../middleware/auth.middleware.js";
import logger from "../utils/logger.js";
import { uploadMedia } from "../controllers/media.controller.js";
import multer from "multer";

const mediaRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    console.log("File info:", file);
    cb(null, true);
  },
}).single("file");

mediaRouter.post(
  "/upload",
  authenticateRequest,
  (req, res, next) => {
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request headers:", req.headers);
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        logger.error("Multer error while uploading:", err);
        return res.status(400).json({
          message: "Multer error while uploading:",
          error: err.message,
          stack: err.stack,
        });
      } else if (err) {
        logger.error("Unknown error occured while uploading:", err);
        return res.status(500).json({
          message: "Unknown error occured while uploading:",
          error: err.message,
          stack: err.stack,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No file found!",
        });
      }

      next();
    });
  },
  uploadMedia
);

export default mediaRouter;
