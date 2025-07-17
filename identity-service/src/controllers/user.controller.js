import {
  deleteUserProfileService,
  getUserProfileService,
  updateUserProfileService,
} from "../services/user.service.js";
import APIError from "../utils/APIError.js";
import logger from "../utils/logger.js";
import { validateUpdateUserSchema } from "../utils/validation.js";

export const getUserProfile = async (req, res, next) => {
  logger.info("getUserProfile controller hit...");
  try {
    const data = await getUserProfileService(req.user.userId);

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data,
    });
  } catch (error) {
    logger.error("Error in get user profile controller", error);
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  logger.info("updateUserProfile controller hit...");
  try {
    const { error } = validateUpdateUserSchema(req.body);
    if (error) {
      logger.warn("Validation error: ", error.details[0].message);
      return next(new APIError(400, error.details[0].message));
    }

    const data = await updateUserProfileService(req.user.userId, req.body);

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data,
    });
  } catch (error) {
    logger.error("Error in update user profile controller", error);
    next(error);
  }
};

export const deleteUserProfile = async (req, res, next) => {
  logger.info("deleteUserProfile controller hit...");

  try {
    await deleteUserProfileService(req.user.userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error("Error in delete user profile controller", error);
    next(error);
  }
};
