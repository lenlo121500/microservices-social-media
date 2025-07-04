import dotenv from "dotenv";
dotenv.config();

export const { PORT, NODE_ENV, MONGODB_URI, REDIS_URL, RABBITMQ_URL } =
  process.env;
