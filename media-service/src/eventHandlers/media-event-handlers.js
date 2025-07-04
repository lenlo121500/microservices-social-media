import Media from "../models/media.model.js";
import { deleteMediaFromCloudinary } from "../utils/cloudinary.js";
import logger from "../utils/logger.js";

export const handlePostDeleted = async (event) => {
  console.log("Post deleted event received:", event);
  const { postId, mediaIds } = event;
  try {
    const deleteMedia = await Media.find({ _id: { $in: mediaIds } });
    for (const media of deleteMedia) {
      await deleteMediaFromCloudinary(media.publicId);
      await Media.findByIdAndDelete(media._id);
      logger.info(
        `Media deleted successfully! Public id: ${media.publicId} associated with post id: ${postId}`
      );
    }
    logger.info(
      `Processed deletion of media associated with post id: ${postId}`
    );
  } catch (error) {
    logger.error("Error in handle post deleted event", error);
  }
};
