/** @notice Parent router where all other routers are mounted onto. */
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

// Mount all the routes onto their respective base routes
router.use("/", require("./default"));
router.use("/class", require("./class"));
router.use("/schedule", require("./schedule"));
router.use("/partner", require("./partner"));
router.use("/user", auth, require("./users"));
router.use("/favourites", auth, require("./favourites"));
router.use("/subscription", require("./subscription"));
router.use("/topup", require("./topup"));
router.use("/points", auth, require("./points"));
router.use("/reviews", require("./reviews"));
router.use("/settings", auth, require("./settings"));
router.use("/emailActionLinks", require("./emailActionLinks"));

module.exports = router;
