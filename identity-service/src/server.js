import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRouter from "./routes/auth.route.js";
import logger from "./utils/logger.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiterMiddleware } from "./middleware/rateLimiterRedis.js";
import expressLimiter from "./middleware/expressRateLimit.js";
import userRouter from "./routes/user.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// redis rate limiter middleware
app.use(rateLimiterMiddleware);

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Healthy" });
});

// routes with express rate limiter
app.use("/api/auth", expressLimiter, authRouter);
app.use("/api/users", expressLimiter, userRouter);

// error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDB();
  logger.info(`Identity service running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});
