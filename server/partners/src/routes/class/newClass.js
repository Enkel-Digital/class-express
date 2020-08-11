/**
 * Express Router for creating a new class
 * Mounted on /class
 * @author JJ
 * @module create new class route
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const onlyOwnResource = require("../../middleware/onlyOwnResource");
const isSafeHtml = require("../../validations/isSafeHTML");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Create new class for partner
 * @name POST /class/new
 * @param {String} partnerID
 * @param {Object} clas
 * @returns {object} success indicator
 *
 * @todo Should support like a hook system.
 * So people request for a new webhook then store it in the DB? Then on something happen, find all hook URLs and publish the events
 *
 * All the things that should be ran when a new class is created should be posted here as a hook
 * then on user creation, either call all the hooks, or publish a event for all the listeners to use.
 */
router.post("/new", express.json(), async (req, res) => {
  try {
    const { clas } = req.body;

    if (!isSafeHtml(clas.description))
      throw new Error("Class description is not a sanitized HTML.");

    await SQLdb("classes").insert(clas);

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
