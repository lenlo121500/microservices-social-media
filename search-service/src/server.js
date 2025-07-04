import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { PORT } from "./config/config.js";
import { connectRabbitMQ, consumeEvent } from "./utils/rabbitmq.js";
import searchRouter from "./routes/search.route.js";
import {
  handlePostCreated,
  handlePostDeleted,
} from "./eventHandlers/search-event-handler.js";

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pass Redis client as part of the request and then implement redis caching



// routes
app.use("/api/search", searchRouter);

app.use(errorHandler);

async function startServer() {
  try {
    await connectRabbitMQ();

    // CONSUME EVENT
    await consumeEvent("post.created", handlePostCreated);
    await consumeEvent("post.deleted", handlePostDeleted);

    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Search service is running on http://localhost:${PORT}`);
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
