/** @notice Parent router where all other routers are mounted onto. */
const express = require("express");
const router = express.Router();

const defaultRoutes = require("./default");
const userRoutes = require("./users");

// Mount all the routes onto their respective base routes
router.use("/", defaultRoutes);
router.use("/user", userRoutes);

module.exports = router;
