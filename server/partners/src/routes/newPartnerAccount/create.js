/**
 * Express Router for creating a new employee / partner account
 * Mounted on /employees/new
 * @author Jessica
 * @module New partner account API
 */

const express = require("express");
const router = express.Router();
const newPartnerAccount = require("../../controllers/newPartnerAccount");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:newPartnerAccount:create");

/**
 * Create new employee
 * Admin generate the code to send to the frontend
 * @todo Only admin can call this
 * @todo Add expiration date to the generated link. Or since there is a created time right, we should just use that, so like 1 week from that createdDate time
 * @name POST /employees/new
 * @function
 * @param {object} accountCreationRequest
 * @returns {object} Success indicator
 */
router.post("/", express.json(), async (req, res) => {
  try {
    // Create a new pending partnerAccount and send the user a email to complete signup
    await newPartnerAccount(
      req.body.accountCreationRequest,
      req.body.redirectUrl
    );

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
