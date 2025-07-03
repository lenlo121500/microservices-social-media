// src/config.js
import dotenv from "dotenv";
dotenv.config();

export const {
  IDENTITY_SERVICE_URL,
  POST_SERVICE_URL,
  MEDIA_SERVICE_URL,
  REDIS_URL,
  PORT,
  NODE_ENV,
  JWT_SECRET,
} = process.env;
