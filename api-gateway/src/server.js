import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import expressLimiter from "./middleware/expressRateLimit.js";
import logger from "./utils/logger.js";
import indentityProxyRouter from "./proxy/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

app.use(expressLimiter);

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body: ${req.body}`);
  next();
});

app.use("/v1/auth", indentityProxyRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway is running on http://localhost:${PORT}`);
  logger.info(`Identity Service URL: ${process.env.IDENTITY_SERVICE_URL}`);
  logger.info(`Redis URL: ${process.env.REDIS_URL}`);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled rejection: ${err.message}`);
  process.exit(1);
});
