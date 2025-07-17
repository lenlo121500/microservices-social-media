import User from "../models/user.model.js";
import logger from "../utils/logger.js";

export const getUserProfileService = async (userId) => {
  logger.info("getUserProfileService hit...");

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new APIError(404, "User not found");
  }
  return { user };
};

export const updateUserProfileService = async (userId, updateData) => {
  logger.info("updateUserProfileService hit...");

  const { username, firstName, lastName, email } = updateData;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      username,
      firstName,
      lastName,
      email,
    },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  ).select("-password");

  if (!updatedUser) {
    throw new APIError(404, "User not found");
  }
  return { user: updatedUser };
};

export const deleteUserProfileService = async (userId) => {
  logger.info("deleteUserProfileService hit...");

  //soft deletion
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError(404, "User not found");
  }
  user.isDeleted = true;
  await user.save();
  return { message: "User deleted successfully" };
};
