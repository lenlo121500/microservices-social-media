import logger from "../utils/logger.js";
import Post from "../models/post.model.js";
import APIError from "../utils/APIError.js";
import {
  validateCreatePostSchema,
  validateUpdatePostSchema,
} from "../utils/validation.js";
import { publishEvent } from "../utils/rabbitmq.js";

async function invalidatePostCache(req, input) {
  const cacheKey = `post:${input}`;
  await req.redisClient.del(cacheKey);
  const keys = await req.redisClient.keys(`posts:*`);
  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
}

export const createPost = async (req, res, next) => {
  logger.info("Create post controller hit...");
  try {
    const { error } = validateCreatePostSchema(req.body);
    if (error) {
      logger.warn("Validation error: ", error.details[0].message);
      return new APIError(400, error.details[0].message);
    }

    const { content, mediaIds } = req.body;
    const newPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });

    await newPost.save();
    await invalidatePostCache(req, newPost._id.toString());
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    logger.error("Error in create post controller", error);
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  logger.info("Get all posts controller hit...");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey);
    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const posts = await Post.find()
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPosts = await Post.countDocuments();

    const result = {
      posts,
      total: totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      limit,
    };

    // save the result to Redis
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    logger.error("Error in get all posts controller", error);
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  logger.info("Get post controller hit...");
  try {
    const postId = req.params.id;
    const cacheKey = `post:${postId}`;

    const cachedPost = await req.redisClient.get(cacheKey);
    if (cachedPost) {
      return res.json(JSON.parse(cachedPost));
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new APIError(404, "Post not found");
    }

    await req.redisClient.setex(cacheKey, 3600, JSON.stringify(post));
    res.json(post);
  } catch (error) {
    logger.error("Error in get post controller", error);
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  logger.info("Update post controller hit...");
  try {
    const { error } = validateUpdatePostSchema(req.body);
    if (error) {
      logger.warn("Validation error: ", error.details[0].message);
      return new APIError(400, error.details[0].message);
    }
    const postId = req.params.id;
    const { content, mediaIds } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      throw new APIError(404, "Post not found");
    }

    post.content = content;
    post.mediaIds = mediaIds;
    await post.save();
    await invalidatePostCache(req, postId);
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      updatedPost: post,
    });
  } catch (error) {
    logger.error("Error in update post controller", error);
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  logger.info("Delete post controller hit...");
  try {
    const post = await Post.findByIdAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!post) {
      throw new APIError(404, "Post not found");
    }

    // publish post delete method
    await publishEvent("post.deleted", {
      postId: post._id.toString(),
      userId: req.user.userId,
      mediaIds: post.mediaIds,
    });
    await invalidatePostCache(req, req.params.id);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    logger.error("Error in delete post controller", error);
    next(error);
  }
};
