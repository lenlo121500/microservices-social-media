import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import expressLimiter from "./middleware/expressRateLimit.js";
import logger from "./utils/logger.js";
import identityProxy from "./proxy/identityProxy.js";
import { errorHandler } from "./middleware/errorHandler.js";
import validateToken from "./middleware/auth.middleware.js";
import postProxyRouter from "./proxy/postProxy.js";
import {
  IDENTITY_SERVICE_URL,
  MEDIA_SERVICE_URL,
  SEARCH_SERVICE_URL,
  PORT,
  POST_SERVICE_URL,
  REDIS_URL,
} from "./config/config.js";
import mediaProxy from "./proxy/mediaProxy.js";
import searchProxy from "./proxy/searchProxy.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLimiter);

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body: ${req.body}`);
  next();
});

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Healthy" });
});

app.use("/v1/auth", identityProxy);
app.use("/v1/users", validateToken, identityProxy);
app.use("/v1/posts", validateToken, postProxyRouter);
app.use("/v1/media", validateToken, mediaProxy);
app.use("/v1/search", validateToken, searchProxy);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway is running on http://localhost:${PORT}`);
  logger.info(`Identity Service URL: ${IDENTITY_SERVICE_URL}`);
  logger.info(`Post Service URL: ${POST_SERVICE_URL}`);
  logger.info(`Media Service URL: ${MEDIA_SERVICE_URL}`);
  logger.info(`Search Service URL: ${SEARCH_SERVICE_URL}`);
  logger.info(`Redis URL: ${REDIS_URL}`);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled rejection: ${err.message}`);
  process.exit(1);
});
