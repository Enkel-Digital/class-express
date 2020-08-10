/**
 * Express Router for creating a new class
 * Mounted on /class
 * @author JJ
 * @module class tag routes
 *
 * This router is mounted on a auth protected route,
 * thus individual auth verifier middleware not needed
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const onlyOwnResource = require("../middleware/onlyOwnResource");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Save new tags for a class when user is creating a new class.
 * @name POST /tags/class/new
 * @param {String} userID
 * @param {Object} user
 * @returns {object} success indicator
 *
 * @todo Should support like a hook system.
 * So people request for a new webhook then store it in the DB? Then on something happen, find all hook URLs and publish the events
 *
 * All the things that should be ran when a new user is created should be posted here as a hook
 * then on user creation, either call all the hooks, or publish a event for all the listeners to use.
 */
router.post("/new", express.json(), async (req, res) => {
  try {
    const { clas } = req.body;

    await SQLdb("classes").insert(clas);

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update user details object
 * @name PUT /user/:userID
 * @returns {object} success indicator
 */
router.put("/", (req, res) => {
  res.json({ success: false, error: "not implemented yet" });
});

module.exports = router;
