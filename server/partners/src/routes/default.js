/**
 * Express Router for default routes like Homepage and health-check.
 * Mounted on /
 * @author JJ
 * @module Default routes
 */

/**
 * express module and express router to mount user related functions on
 * @const
 * @ignore
 */
const express = require("express");
const router = express.Router();

/**
 * Returns a welcome string
 * @name GET /
 * @returns {String} welcome string
 */
router.get("/", (req, res) => res.send("CE-Partner service"));

/**
 * Server health check
 * @name GET /health
 * @returns {Status} 200
 *
 * @notice Use this for both Kubernetes Liveness and Readiness probe.
 * @notice Since all setup function are awaited async funcs, readiness probe can use this
 */
router.get("/health", (req, res) => {
  res.status(200).send("Ok!");
});

module.exports = router;
