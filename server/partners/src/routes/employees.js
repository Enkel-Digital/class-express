/**
 * Express Router for employees related routes.
 * Mounted on /employees
 * @author Jessica
 * @module Employees routes
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const SQLdb = require("@enkeldigital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:reviews");

/**
 * Get employee details
 * @name GET /employees/:employeeID
 * @function
 * @returns {object} Employee object
 *
 * @todo Employee can only get his/her own data
 */
router.get("/:employeeID", async (req, res) => {
  try {
    const { employeeID } = req.params;

    const employee = await SQLdb("partnerAccounts")
      .where({
        id: employeeID,
        deleted: false,
      })
      .first();

    res.json({
      success: true,
      employee,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get all employees of partner
 * @name GET /employees/all/:partnerID
 * @function
 * @returns {object} Number of employees and array of employee objects
 *
 * @todo Add a check to ensure only admins can read all employee details
 */
router.get("/all/:partnerID", async (req, res) => {
  try {
    const { partnerID } = req.params;

    const employees = await SQLdb("partnerAccounts").where({
      partnerID,
      deleted: false,
    });

    res.json({
      success: true,
      numberOfEmployees: employees.length,
      employees,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create new employee
 * @name POST /employees/new
 * @function
 * @param {object} employee
 * @returns {object} Success indicator
 */
router.post("/new", express.json(), async (req, res) => {
  try {
    const { employee } = req.body;

    await SQLdb("partnerAccounts").insert(employee);

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update employee details
 * @name PATCH /employees/:employeeID
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
 * @name DELETE /employees/:employeeID
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
