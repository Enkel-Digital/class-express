/** @notice Parent router where all other routers are mounted onto. */
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const defaultRoutes = require("./default");
const errorRoutes = require("./error");
const classRoutes = require("./class");
const partnerRoutes = require("./partner");
const userRoutes = require("./users");
const favouritesRoutes = require("./favourites");
const subscriptionRoutes = require("./subscription");
const topupRoutes = require("./topup");
const pointsRoutes = require("./points");
const reviewsRoutes = require("./reviews");
const emailActionLinksRoutes = require("./emailActionLinks");

// @todo Might require the routes inside the mounting directly
// Mount all the routes onto their respective base routes
router.use("/", defaultRoutes);
router.use("/error", errorRoutes);
router.use("/class", classRoutes);
router.use("/partner", partnerRoutes);
router.use("/user", auth, userRoutes);
router.use("/favourites", auth, favouritesRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/topup", auth, topupRoutes);
router.use("/points", auth, pointsRoutes);
router.use("/reviews", reviewsRoutes);
router.use("/emailActionLinks", emailActionLinksRoutes);

module.exports = router;
