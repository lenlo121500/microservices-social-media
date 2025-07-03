import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";

import logger from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

import mediaRouter from "./routes/media.route.js";
import expressLimiter from "./middleware/expressRateLimit.js";

import connectDB from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;

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

app.listen(PORT, async () => {
  await connectDB();
  logger.info(`Media Service is running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (reason, message) => {
  logger.error(`Unhandled Rejection at: ${message}, reason: ${reason}`);
});
