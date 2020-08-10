/**
 * Express Router for creating a new class
 * Mounted on /class
 * @author JJ
 * @module Update class route
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const onlyOwnResource = require("../../middleware/onlyOwnResource");
const validateAndSetClass = require("./validateAndSetClass");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Create new class for partner
 * @name PATCH /class/:classID
 * @param {String} classID
 * @param {Object} clas
 * @returns {object} success indicator
 *
 * @todo Should support like a hook system.
 * So people request for a new webhook then store it in the DB? Then on something happen, find all hook URLs and publish the events
 *
 * All the things that should be ran when a new class is created should be posted here as a hook
 * then on user creation, either call all the hooks, or publish a event for all the listeners to use.
 */
router.patch("/:classID", express.json(), async (req, res) => {
  try {
    const { classID } = req.params;
    const { clas } = req.body;

    console.log(SQLdb("classes").where({ id: classID }).update);

    await validateAndSetClass(
      clas,
      SQLdb("classes").where({ id: classID }).update
    );

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update class details object
 * @name PUT /user/:userID
 * @returns {object} success indicator
 */
router.put("/", (req, res) => {
  res.json({ success: false, error: "not implemented yet" });
});

module.exports = router;
