/**
 * Combine all routers for newPartner APIs and export it together
 * All routes mounted on /partner/new
 */

const express = require("express");
const router = express.Router();

router.use(require("./create"));
router.use(require("./approve"));
// @todo create 1 more API for admin to unapprove partner creation

module.exports = router;
