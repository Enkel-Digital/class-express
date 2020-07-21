/**
 * Express Router for new error
 * Mounted on /
 * @author JJ
 * @module Error routes
 */

const express = require("express");
const router = express.Router();

/**
 * Report a new error
 * @name POST /new
 * @function
 * @returns {object} success indicator and message
 */
router.post("/new", express.json(), (req, res) => {
  // @todo Store error somewhere and notify team of error.
  console.log("NEW:", req.body);

  res.status(200).json({ success: true, message: "error recorded" });
});

module.exports = router;
