/**
 * Express Router for user related routes
 * Mounted on /user
 * @author JJ
 * @module User routes
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

// @todo FIX THIS API MODULE and the duplicate routes shit

/**
 * Get user (partner account / employee) details object
 * @todo Can be get by both the employee themselves and admin accounts
 * @name GET /user/:userEmail
 * @returns {object} User object
 */
router.get("/:userEmail", onlyOwnResource, async (req, res) => {
  try {
    const { userEmail } = req.params;

    const user = await SQLdb("partnerAccounts")
      .where({ email: userEmail })
      .first();
    // .select("partnerID", "name", "admin"); // @todo Add filter for properties

    if (user) res.json({ success: true, user });
    else res.status(404).json({ success: false, error: "No such user" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update partner account details
 * @todo Allow both the user themselves and the admin accounts to do this
 * @name PATCH /user/:employeeID
 * @function
 * @param {object} employee
 * @returns {object} Success indicator
 */
router.patch("/:employeeID", express.json(), async (req, res) => {
  try {
    const { employeeID } = req.params;
    const { employee } = req.body;

    await SQLdb("partnerAccounts").where({ id: employeeID }).update(employee);

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Delete employee account
 * @todo Allow themselves and the admin accounts
 * @todo change to use email instead? or ID, but use as query instead of URL params
 * @name DELETE /user/:employeeID
 * @function
 * @param {object} employee
 * @returns {object} Success indicator
 */
router.delete("/:employeeID", express.json(), async (req, res) => {
  try {
    const { employeeID } = req.params;

    await SQLdb("partnerAccounts")
      .where({ id: employeeID })
      .update({ deleted: true });

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
