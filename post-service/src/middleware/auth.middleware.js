import logger from "../utils/logger.js";
import APIError from "../utils/APIError.js";

const authenticateRequest = (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      logger.warn("No user id found in request headers");
      return next(new APIError(401, "Unauthorized"));
    }

    req.user = { userId };
    next();
  } catch (error) {
    logger.error("Error in authenticate request middleware", error);
    next(error);
  }
};

export default authenticateRequest;
