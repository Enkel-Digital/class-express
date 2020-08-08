/** @notice Parent router where all other routers are mounted onto. */
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

// Mount all the routes onto their respective base routes
router.use("/", require("./default"));

module.exports = router;
