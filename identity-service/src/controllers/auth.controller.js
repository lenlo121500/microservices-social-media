import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import APIError from "../utils/APIError.js";
import {
  validateLoginSchema,
  validateRegisterSchema,
} from "../utils/validation.js";
import { generateTokens } from "../utils/generateToken.js";
import RefreshToken from "../models/refreshToken.model.js";

// user registration
export const registerUser = async (req, res, next) => {
  logger.info("register user controller hit...");
  try {
    const { error } = validateRegisterSchema(req.body);
    if (error) {
      logger.warn("Validation error: ", error.details[0].message);
      return new APIError(400, error.details[0].message);
    }

    const { username, firstName, lastName, email, password } = req.body;

    let user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      throw new APIError(400, "User already exists");
    }

    user = new User({
      username,
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();
    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("error in register user controller", error);
    next(error);
  }
};

// user login
export const loginUser = async (req, res, next) => {
  logger.info("login user controller hit...");
  try {
    const { error } = validateLoginSchema(req.body);
    if (error) {
      logger.warn("Validation error: ", error.details[0].message);
      return new APIError(400, error.details[0].message);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new APIError(404, "User not found");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new APIError(400, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      userId: user._id,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("error in login user controller", error);
    next(error);
  }
};
//  user logout
export const logoutUser = async (req, res, next) => {
  logger.info("logout user controller hit...");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new APIError(400, "Refresh token is required");
    }

    await RefreshToken.deleteOne({ token: refreshToken });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    logger.error("Error in logout user controller", error);
    next(error);
  }
};

// refresh token
export const refreshUserToken = async (req, res, next) => {
  logger.info("refresh user token controller hit...");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new APIError(400, "Refresh token is required");
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new APIError(
        401,
        " Unauthorized - Invalid or expired refresh token"
      );
    }

    const user = await User.findById(storedToken.user);
    if (!user) {
      throw new APIError(404, "User not found");
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(user);

    // delete the old refresh token
    await RefreshToken.deleteOne({ _id: storedToken._id });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error("error in refresh user token controller", error);
    next(error);
  }
};
