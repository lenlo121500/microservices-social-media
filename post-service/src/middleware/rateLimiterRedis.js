import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import logger from "../utils/logger.js";

export const redisClient = new Redis(process.env.REDIS_URL);

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10, // 5 requests
  duration: 1, // per 1 second by IP
});

export const rateLimiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (err) {
    if (err instanceof Error && err.message.includes("ECONNREFUSED")) {
      logger.error(
        "Redis unreachable. Allowing request without rate limiting."
      );
      return next();
    }

    logger.warn(`Rate limit exceeded for IP ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many requests" });
  }
};

export default rateLimiter;
