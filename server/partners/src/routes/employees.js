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
const sendMail = require("../utils/sendMail");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:employees");

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
 * Admin generate the code to send to the frontend
 * @todo Only admin can call this
 * @todo Add expiration date to the generated link. Or since there is a created time right, we should just use that, so like 1 week from that createdDate time
 * @name POST /employees/new
 * @function
 * @param {object} employee
 * @returns {object} Success indicator
 */
router.post("/new", express.json(), async (req, res) => {
  try {
    const {
      employee,
      // Defaults to the production url if undefined
      // @todo To update URL link once domain is finalized
      redirectUrl = "https://partners.enkeldigital.com/#/signup",
    } = req.body;

    // Generate a secret token user can use to identify/prove themselves, where this token will ONLY be sent to their email address
    const token = Math.random().toString(36).substring(2);

    // Set the name (a non null compulsory field in the DB) to their email + token first, used later for verification without using an additional token column
    employee.name = employee.email + token;

    await SQLdb("partnerAccounts").insert(employee);

    const type = employee.admin ? "admin" : "employee";

    // Send user email verification link only after successful DB insert
    // await to ensure only respond with success only after the mail has been sent
    // @todo To use sendgrid template instead of this in code mail template
    await sendMail({
      to: employee.email,
      from: "Accounts@classexpress.com",
      subject: `New ClassExpress partner "${type}" account created`,
      html:
        `A ClassExpress partner account has been created for this email.<br />` +
        "Click the link to complete account creation now or safely ignore this email if you did not request for this.<br />" +
        "<br />" +
        `${redirectUrl}?email=${employee.email}&token=${token}`, // Generate link for user to click
    });

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
