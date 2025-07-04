import logger from "../utils/logger.js";
import APIError from "../utils/APIError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import Media from "../models/media.model.js";

export const uploadMedia = async (req, res, next) => {
  logger.info("Upload media controller hit...");
  try {
    console.log(req.file);
    if (!req.file) {
      throw new APIError(400, "No file uploaded");
    }

    const { originalname, mimetype } = req.file;
    const userId = req.user.userId;

    logger.info(`File uploaded: ${originalname}, type: (${mimetype})`);
    logger.info(`Uploading to cloudinary...`);

    const cloudinaryResult = await uploadToCloudinary(req.file);
    logger.info(
      `Cloudinary upload successfully! Public id: ${cloudinaryResult.public_id}`
    );

    const newMedia = new Media({
      publicId: cloudinaryResult.public_id,
      originalName: originalname,
      mimeType: mimetype,
      url: cloudinaryResult.secure_url,
      userId,
    });

    await newMedia.save();

    res.status(201).json({
      success: true,
      message: "Media uploaded successfully",
      mediaId: newMedia._id,
      url: newMedia.url,
    });
  } catch (error) {
    logger.error(`Error in upload media controller`, error);
    next(error);
  }
};

export const getAllMedias = async (req, res, next) => {
  logger.info("Get all medias controller hit...");
  try {
    const medias = await Media.find({ userId: req.user.userId });
    res.status(200).json({ success: true, medias });
  } catch (error) {
    logger.error(`Error in get all medias controller`, error);
    next(error);
  }
};
