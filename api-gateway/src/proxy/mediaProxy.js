import proxy from "express-http-proxy";
import logger from "../utils/logger.js";
import proxyOptions from "./proxyOptions.js";
import { MEDIA_SERVICE_URL } from "../config/config.js";

const mediaProxy = proxy(MEDIA_SERVICE_URL, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
    if (!srcReq.headers["content-type"].startsWith("multipart/form-data")) {
      proxyReqOpts.headers["Content-Type"] = "application/json";
    }

    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(`Response received from media service: ${proxyRes.statusCode}`);

    return proxyResData;
  },
  parseReqBody: false,
});

export default mediaProxy;
