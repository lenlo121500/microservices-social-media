import logger from "../utils/logger.js";

const proxyOptions = {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },
  proxyErrorHandler: (err, req, res) => {
    logger.error(`Proxy error: ${err.message}`);
    res.status(500).json({
      success: false,
      message: `Internal server error`,
      error: err.message,
    });
  },
};

export default proxyOptions;
