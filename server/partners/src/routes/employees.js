/**
 * Express Router for employees related routes.
 * Mounted on /employees
 * @author Jessica
 * @module Employees routes
 */

const express = require("express");
const router = express.Router();
const admin = require("../utils/firebaseAdmin");
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

    // Make lowercase, refer to notes & faq on why this is lowercase.
    // tl;dr Firebase auth like google ignores the email RFC and forces email case-insensitivity
    employee.email = employee.email.toLowerCase();

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

/**
 * Utility function to get partnerAccount from DB using email and token
 * @param {*} email
 * @param {*} token
 */
function partnerAccountWithEmailAndToken(email, token) {
  return SQLdb("partnerAccounts").where({ name: email + token });
}

/**
 * Validate the partnerAccount email and token combination to see if it is a valid account creation link
 * @name POST /employees/new/validate-link
 * @function
 * @param {object} name
 * @param {object} token
 * @returns {object} Success indicator
 */
router.post("/new/validate-link", express.json(), async (req, res) => {
  try {
    // @todo Validate the input, make sure not empty or some random weird shit that can fk up the DB query
    const { email, token } = req.body;

    const partnerAccount = await partnerAccountWithEmailAndToken(email, token)
      .select("createdAt")
      .first();

    // If account does not exist, it means the link is not valid
    if (!partnerAccount)
      return res
        .status(422) // Although it is user not found (usually 404), this is a validation failure, thus 422
        .json({ success: false, error: "Invalid link" });

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * API to be called after Employees complete their account creation step.
 * This API is used to update their name in the DB
 * @notice AUTH token NEEDS TO BE PRESENT, as email from the token will be used for verification
 * @name POST /employees/new/complete
 * @function
 * @param {object} details or smth????
 * @returns {object} Success indicator
 */
router.post("/new/complete", auth, express.json(), async (req, res) => {
  try {
    const { employee, token } = req.body;

    // Parse out email and uid from the firebase auth JWT for verification and account update
    const { email, uid } = req.authenticatedUser;

    // Verify the email and token combo by checking if the user exists in the DB
    if (!(await partnerAccountWithEmailAndToken(email, token).first()))
      return res
        .status(422) // Although it is user not found (usually 404), this is a validation failure, thus 422
        .json({ success: false, error: "Invalid email and token combination" });

    // @todo Verify that link is not yet expired

    // Update user with the updated details from frontend
    await partnerAccountWithEmailAndToken(email, token).update(employee);

    // Set email to be Verified using uid from JWT
    // Email is considered to be verified when the user is able to get the generated token sent only to their email
    // To see the UserRecord reference returned, save as userRecord, then run userRecord.toJSON()
    await admin.auth().updateUser(uid, { emailVerified: true });

    // Although this is an update internally, to the frontend UX, this is a partner account that is just created
    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
