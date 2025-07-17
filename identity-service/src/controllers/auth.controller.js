import logger from "../utils/logger.js";
import APIError from "../utils/APIError.js";
import {
  validateLoginSchema,
  validateRegisterSchema,
} from "../utils/validation.js";
import {
  loginUserService,
  logoutUserService,
  refreshUserTokenService,
  registerUserService,
} from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
  logger.info("register user controller hit...");
  try {
    const { error } = validateRegisterSchema(req.body);
    if (error) {
      logger.warn("Validation error: ", error.details[0].message);
      return next(new APIError(400, error.details[0].message));
    }

    const data = await registerUserService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data,
    });
  } catch (error) {
    logger.error("error in register user controller", error);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  logger.info("login user controller hit...");
  try {
    const { error } = validateLoginSchema(req.body);
    if (error) {
      logger.warn("Validation error: ", error.details[0].message);
      return next(new APIError(400, error.details[0].message));
    }

    const { userId, accessToken, refreshToken } = await loginUserService(
      req.body
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      userId,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("error in login user controller", error);
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  logger.info("logout user controller hit...");
  try {
    await logoutUserService(req.body.refreshToken);

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    logger.error("Error in logout user controller", error);
    next(error);
  }
};

export const refreshUserToken = async (req, res, next) => {
  logger.info("refresh user token controller hit...");
  try {
    const data = await refreshUserTokenService(req.body.refreshToken);

    res.status(200).json({
      success: true,
      message: "User token refreshed successfully",
      data,
    });
  } catch (error) {
    logger.error("Error in refresh user token controller", error);
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {};
export const resetPassword = async (req, res, next) => {};
