/**
 * Express Router for error reporting related routes
 * Mounted on /error
 * @author JJ
 * @module Error routes
 */

const express = require("express");
const router = express.Router();

/**
 * Report a new error
 * @name POST /error
 * @function
 * @returns {object} success indicator and message
 */
router.post("/", express.json(), (req, res) => {
  // @todo Store error somewhere and notify team of error.
  console.log("/error handler", req.body);

  res.status(200).json({ success: true, message: "error recorded" });
});

module.exports = router;
