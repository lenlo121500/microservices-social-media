import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import APIError from "../utils/APIError.js";
import { generateTokens } from "../utils/generateToken.js";
import RefreshToken from "../models/refreshToken.model.js";

export const registerUserService = async (userData) => {
  logger.info("register user service hit...");

  const { username, firstName, lastName, email, password } = userData;

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

  return {
    userId: user._id,
    accessToken,
    refreshToken,
  };
};

export const loginUserService = async (loginData) => {
  logger.info("login user service hit...");

  const { email, password } = loginData;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new APIError(404, "User not found");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new APIError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    userId: user._id,
    accessToken,
    refreshToken,
  };
};

export const logoutUserService = async (refreshToken) => {
  logger.info("logout user service hit...");
  if (!refreshToken) {
    throw new APIError(400, "Refresh token is required");
  }

  await RefreshToken.deleteOne({ token: refreshToken });

  return {
    success: true,
    message: "User logged out successfully",
  };
};

export const refreshUserTokenService = async (refreshToken) => {
  logger.info("refresh user token service hit...");
  if (!refreshToken) {
    throw new APIError(400, "Refresh token is required");
  }

  const storedToken = await RefreshToken.findOne({ token: refreshToken });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new APIError(401, "Invalid refresh request");
  }

  const user = await User.findById(storedToken.user);
  if (!user) {
    throw new APIError(404, "User not found");
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateTokens(user);

  // delete the old refresh token
  await RefreshToken.deleteOne({ _id: storedToken._id });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const forgotPasswordService = async () => {};
export const resetPasswordService = async () => {};
