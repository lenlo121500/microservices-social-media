import express from "express";
import identityProxy from "./identityProxy.js";

const identityProxyRouter = express.Router();

identityProxyRouter.use(identityProxy);

export default identityProxyRouter;
