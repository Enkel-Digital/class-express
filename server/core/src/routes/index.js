/** @notice Parent router where all other routers are mounted onto. */
const express = require("express");
const router = express.Router();

const defaultRoutes = require("./default");
const errorRoutes = require("./error");
const userRoutes = require("./users");
const subscriptionRoutes = require("./subscription");
const emailActionLinksRoutes = require("./emailActionLinks");

// Mount all the routes onto their respective base routes
router.use("/", defaultRoutes);
router.use("/error", errorRoutes);
router.use("/user", userRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/emailActionLinks", emailActionLinksRoutes);

module.exports = router;
