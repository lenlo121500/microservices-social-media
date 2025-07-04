import logger from "../utils/logger.js";
import SearchPost from "../models/search.model.js";
import APIError from "../utils/APIError.js";

// implement redis caching here maximum of 2-5 mins
export const searchPost = async (req, res, next) => {
  logger.info("Search post controller hit...");
  try {
    const { query } = req.query;
    const results = await SearchPost.find(
      {
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" },
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    if (!results) {
      throw new APIError(404, "No results found");
    }
    res.status(200).json(results);
  } catch (error) {
    logger.error("Error in search post controller", error);
    next(error);
  }
};
