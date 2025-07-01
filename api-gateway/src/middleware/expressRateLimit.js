import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import logger from "../utils/logger.js";
import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL);

const expressLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
    });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

export default expressLimiter;
