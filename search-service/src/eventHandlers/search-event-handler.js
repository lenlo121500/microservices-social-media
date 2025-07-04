import SearchPost from "../models/search.model.js";
import logger from "../utils/logger.js";

export const handlePostCreated = async (event) => {
  logger.info("Post created event received:", event);
  try {
    const newSearchPost = new SearchPost({
      postId: event.postId,
      userId: event.userId,
      content: event.content,
      createdAt: event.createdAt,
    });

    await newSearchPost.save();
    logger.info(
      `Search post created: ${event.postId}, ${newSearchPost._id.toString()}`
    );
  } catch (error) {
    logger.error("Error in handle post created event", error);
  }
};

export const handlePostDeleted = async (event) => {
  logger.info("Post deleted event received:", event);
  try {
    await SearchPost.findOneAndDelete({ postId: event.postId });
    logger.info(`Search post deleted: ${event.postId}`);
  } catch (error) {
    logger.error("Error in handle post deleted event", error);
  }
};
