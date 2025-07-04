import dotenv from "dotenv";
dotenv.config();

export const {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  MONGODB_URI,
  REDIS_URL,
  RABBITMQ_URL,
} = process.env;
