import jwt from "jsonwebtoken";
import APIError from "../utils/APIError.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    throw new APIError(401, "Unauthorized - Missing or invalid token.");
  }
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new APIError(401, "Unauthorized - Invalid or expired token."));
  }
};

/**
 * Role-Based Access Control
 * @param {string[]} allowedRoles
 */

export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      throw new APIError(403, "Forbidden - User role not found.");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new APIError(403, "Forbidden - User role not allowed.");
    }

    next();
  };
};
