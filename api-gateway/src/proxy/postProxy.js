import proxy from "express-http-proxy";
import logger from "../utils/logger.js";
import proxyOptions from "./proxyOptions.js";
import { POST_SERVICE_URL } from "../config/config.js";

const postProxy = proxy(POST_SERVICE_URL, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers["Content-Type"] = "application/json";
    proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(`Response received from Post Service: ${proxyRes.statusCode}`);
    return proxyResData;
  },
});

export default postProxy;
