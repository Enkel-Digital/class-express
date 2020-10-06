/**
 * Express Router for employees related routes.
 * Mounted on /employees/new
 * @author Jessica
 * @module Employees routes
 */

const express = require("express");
const router = express.Router();
const isValidPendingAccount = require("./isValidPendingAccount");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:newPartnerAccount:verify");

/**
 * Verify the partnerAccount email and token combination to see if it is a valid account creation link
 * @todo Need to  support the admin RE-creating the user, if the employee fails to click link and requests for a new one!
 * @todo Only need to do if we are to support a expiration time. Do in beta maybe??
 * @name POST /employees/new/verify
 * @function
 * @param {object} name
 * @param {object} token
 * @returns {object} Success indicator
 */
router.post("/verify", express.json(), async (req, res) => {
  try {
    // @todo Validate the input, make sure not empty or some random weird shit that can fk up the DB query
    const { accountCreationRequest } = req.body;

    const partnerAccount = await isValidPendingAccount(accountCreationRequest);

    // If account does not exist, it means the accountCreationRequest string is invalid
    if (!partnerAccount) throw new Error("Account Creation Request is invalid");

    // @todo Implement , timeLeft: partnerAccount.createdAt , but might be hard since the func no longer returns createdAt
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res
      .status(422) // Although it is user not found (usually 404), this is a validation failure, thus 422
      .json({ success: false, error: ["Invalid link", error.message] });
  }
});

module.exports = router;
