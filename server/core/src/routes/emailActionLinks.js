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
const sendMail = require("../utils/sendMail");

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

    // Create a email verification link with a continue URL back to the app
    const link = await admin.auth().generateEmailVerificationLink(email, {
      url: "https://classes-ekd.firebaseapp.com",
    });

    // Send user email verification link
    // await to ensure only respond with success once the mail has been sent
    // @todo To use sendgrid template instead of this in code mail template
    await sendMail({
      to: email,
      from: "Accounts@classexpress.com",
      subject: "Email Verification required",
      html:
        `A email verification link was requested for the Class Express account linked to this email address!<br />` +
        "<br />Click the link to verify now, or safely ignore this email if you did not request for this.<br />" +
        "<br />" +
        link,
    });

    res.json({ success: true });
  } catch (error) {
    logger.error(error);

    // @todo Choose a different status code
    // The firebase auth error code is also included
    res.status(500).json({
      success: false,
      error: { message: error.message, code: error.code },
    });
  }
});

module.exports = router;
