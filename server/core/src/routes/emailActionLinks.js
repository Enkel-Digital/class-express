/**
 * Express Router for user related routes
 * Mounted on /emailActionLinks
 * @author JJ
 * @module User routes
 */

const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const auth = require("../middleware/auth");
const admin = require("../utils/firebaseAdmin");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Request for a new verification email to verify email address
 * @name POST /emailActionLinks/resendVerificationEmail
 * @function
 * @params {string} email Email address
 * @returns {object} User object
 *
 * @notice This API is rate limited by firebase API
 */
router.post("/resendVerificationEmail/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // const link = await admin.auth().generateEmailVerificationLink(email);
    const link = await admin.auth().generateEmailVerificationLink(email, { url: "https://classes-ekd.firebaseapp.com" });

    // @todo Email this link to the user instead of sending it back directly
    // console.log("link", link);

    res.json({ success: true });
  } catch (error) {
    logger.error(error);

    // Choose a different status code
    res.status(500).json({ success: false, error: { message: error.message, code: error.code } });
  }
});

module.exports = router;
