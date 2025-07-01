import mongoose from "mongoose";
import logger from "../utils/logger.js";

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    await shutdown("SIGINT");
  });

  process.on("SIGTERM", async () => {
    await shutdown("SIGTERM");
  });
};

const shutdown = async (signal) => {
  if (isConnected) {
    try {
      await mongoose.connection.close();
      logger.info(`MongoDB disconnected on ${signal}`);
      process.exit(0);
    } catch (err) {
      logger.error(`Error during MongoDB disconnect: ${err.message}`);
      process.exit(1);
    }
  } else {
    process.exit(0);
  }
};

export default connectDB;
