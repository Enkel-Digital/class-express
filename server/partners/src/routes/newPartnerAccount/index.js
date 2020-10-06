/**
 * Combine all routers for newPartnerAccount APIs and export it together
 * All routes mounted on /employees/new
 */

const express = require("express");
const router = express.Router();

router.use(require("./create"));
router.use(require("./verify"));
router.use(require("./complete"));

module.exports = router;
