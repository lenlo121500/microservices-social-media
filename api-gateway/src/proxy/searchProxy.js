import proxy from "express-http-proxy";
import logger from "../utils/logger.js";
import proxyOptions from "./proxyOptions.js";
import { SEARCH_SERVICE_URL } from "../config/config.js";

const searchProxy = proxy(SEARCH_SERVICE_URL, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers["Content-Type"] = "application/json";
    proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;

    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(
      `Response received from search service: ${proxyRes.statusCode}`
    );

    return proxyResData;
  },
});

export default searchProxy;
