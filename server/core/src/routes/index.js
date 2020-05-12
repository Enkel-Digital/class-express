/** @notice Parent router where all other routers are mounted onto. */
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const defaultRoutes = require("./default");
const errorRoutes = require("./error");
const userRoutes = require("./users");
const subscriptionRoutes = require("./subscription");
const topupRoutes = require("./topup");
const pointsRoutes = require("./points");
const emailActionLinksRoutes = require("./emailActionLinks");

// Mount all the routes onto their respective base routes
router.use("/", defaultRoutes);
router.use("/error", errorRoutes);
router.use("/user", auth, userRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/topup", auth, topupRoutes);
router.use("/points", auth, pointsRoutes);
router.use("/emailActionLinks", emailActionLinksRoutes);

module.exports = router;
