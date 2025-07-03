import logger from "../utils/logger.js";
import APIError from "../utils/APIError.js";
import uploadToCloudinary from "../utils/cloudinary.js";

export const uploadMedia = async (req, res, next) => {
  logger.info("Upload media controller hit...");
  try {
    if (!req.file) {
      throw new APIError(400, "No file uploaded");
    }

    const { originalName, mimeType } = req.file;
    const userId = req.user.userId;

    logger.info(`File uploaded: ${originalName}, type: (${mimeType})`);
    logger.info(`Uploading to cloudinary...`);

    const cloudinaryResult = await uploadToCloudinary(req.file);
    logger.info(
      `Cloudinary upload successfully! Public id: ${cloudinaryResult.public_id}`
    );

    const newMedia = new Media({
      publicId: cloudinaryResult.public_id,
      originalName,
      mimeType,
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
