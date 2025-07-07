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
import { connectRabbitMQ } from "./utils/rabbitmq.js";

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

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Healthy" });
});

app.use(
  "/api/posts",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  postRouter
);

app.use(errorHandler);

async function startServer() {
  try {
    await connectRabbitMQ();
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

startServer();

process.on("unhandledRejection", (reason, message) => {
  logger.error(`Unhandled Rejection at: ${message} reason: ${reason}`);
});
