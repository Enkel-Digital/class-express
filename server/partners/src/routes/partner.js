/**
 * Express Router for partner related routes.
 * Mounted on /partner
 * @author JJ
 * @module Partner routes
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:partner");

/**
 * Get partner details
 * @name GET /partner/:partnerID
 * @returns {object} Partner object
 */
router.get("/:partnerID", async (req, res) => {
  try {
    const { partnerID } = req.params;

    const partner = await SQLdb("partners")
      .where({ id: partnerID })
      .where("deleted", false)
      .first();

    if (partner) res.json({ success: true, partner });
    else res.status(404).json({ success: false, error: "No such Partner" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update partner details
 * @name PATCH /partner/:partnerID
 * @function
 * @param {object} partner
 * @returns {object} Success indicator
 */
router.patch("/:partnerID", express.json(), async (req, res) => {
  try {
    const { partnerID } = req.params;
    const { partner } = req.body;

    await SQLdb("partners").where({ id: partnerID }).update(partner);

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * "Delete" partner / business organization profile, and with it, all partnerAccounts and classes belonging to this partner.
 * @name DELETE /partner/:partnerID
 * @function
 * @param {object} partner
 * @returns {object} Success indicator
 */
router.delete("/:partnerID", express.json(), async (req, res) => {
  try {
    const { partnerID } = req.params;

    await SQLdb("partners").where({ id: partnerID }).update({ deleted: true });

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create new partner / business organization
 * @name POST /partner/new/
 * @param {Object} partner
 * @returns {object} success indicator and partnerID
 *
 * @todo Should support like a hook system.
 * All the things that should be ran when a new user is created should be posted here as a hook
 * then on user creation, either call all the hooks, or publish a event for all the listeners to use.
 */
router.post("/new", express.json(), async (req, res) => {
  try {
    const { partner } = req.body;

    const validateURL = require("../validations/isHTTPS");

    if (!validateURL(partner.website))
      throw new Error("Website URL should be HTTPS only");

    // Insert the partner object and request for id of newly inserted row to be returned
    const partnerID = (
      await SQLdb("partners").insert(partner).returning("id")
    )[0];

    // Return partnerID for frontend to use and create partner accounts
    res.status(201).json({ success: true, partnerID });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
