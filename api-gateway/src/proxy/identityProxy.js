import proxy from "express-http-proxy";
import logger from "../utils/logger.js";
import proxyOptions from "./proxyOptions.js";
import { IDENTITY_SERVICE_URL } from "../config/config.js";

const identityProxy = proxy(IDENTITY_SERVICE_URL, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    const bodyData = JSON.stringify(srcReq.body || {});
    proxyReqOpts.headers["Content-Type"] = "application/json";
    proxyReqOpts.headers["Content-Length"] = Buffer.byteLength(bodyData);
    return proxyReqOpts;
  },
  proxyReqBodyDecorator: (bodyContent) => JSON.stringify(bodyContent),

  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(
      `Response received from Identity Service: ${proxyRes.statusCode}`
    );
    return proxyResData;
  },
});

export default identityProxy;
