import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.dev" });
} else if (process.env.NODE_ENV === "staging") {
  dotenv.config({ path: ".env.staging" });
} else {
  dotenv.config(); // Default: production
}

export const {
  IDENTITY_SERVICE_URL,
  POST_SERVICE_URL,
  MEDIA_SERVICE_URL,
  SEARCH_SERVICE_URL,
  REDIS_URL,
  PORT,
  NODE_ENV,
  JWT_SECRET,
} = process.env;
