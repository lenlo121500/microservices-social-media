import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import logger from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

import mediaRouter from "./routes/media.route.js";
import expressLimiter from "./middleware/expressRateLimit.js";

import connectDB from "./config/db.js";
import { PORT } from "./config/config.js";
import { connectRabbitMQ, consumeEvent } from "./utils/rabbitmq.js";
import { handlePostDeleted } from "./eventHandlers/media-event-handlers.js";

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLimiter);

// routes with express rate limiter
app.use("/api/media", mediaRouter);

app.use(errorHandler);

async function startServer() {
  try {
    await connectRabbitMQ();

    // consume all the events
    await consumeEvent("post.deleted", handlePostDeleted);

    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Media service is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

startServer();

process.on("unhandledRejection", (reason, message) => {
  logger.error(`Unhandled Rejection at: ${message}, reason: ${reason}`);
});
