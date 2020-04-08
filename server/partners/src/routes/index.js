/** @notice Parent router where all other routers are mounted onto. */
const express = require("express");
const router = express.Router();

const defaultRoutes = require("./default");

// Mount all the routes onto their respective base routes
router.use("/", defaultRoutes);

module.exports = router;
