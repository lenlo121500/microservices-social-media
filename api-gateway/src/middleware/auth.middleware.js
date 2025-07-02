import logger from "../utils/logger.js";
import APIError from "../utils/APIError.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("No token found in request headers");
    return next(new APIError(401, "Unauthorized - No token found."));
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn("Invalid token");
      return next(new APIError(401, "Unauthorized - Invalid token."));
    }

    req.user = user;
    next();
  });
};

export default validateToken;
