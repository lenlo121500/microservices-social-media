import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.js";
import postRouter from "./routes/post.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiterMiddleware } from "./middleware/rateLimiterRedis.js";
import { redisClient } from "./middleware/rateLimiterRedis.js";

import logger from "./utils/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimiterMiddleware);

app.use(
  "/api/posts",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  postRouter
);

app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDB();
  logger.info(`Server running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (reason, message) => {
  logger.error(`Unhandled Rejection at: ${message} reason: ${reason}`);
});
