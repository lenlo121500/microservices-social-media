import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import APIError from "../utils/APIError.js";
import { validateRegisterSchema } from "../utils/validation.js";
import { generateTokens } from "../utils/generateToken.js";

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

//  user logout

// refresh token
