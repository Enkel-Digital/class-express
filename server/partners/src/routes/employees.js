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
const { getBase64, getObject } = require("../utils/base64");
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
 * @param {object} accountCreationRequest
 * @returns {object} Success indicator
 */
router.post("/new", express.json(), async (req, res) => {
  try {
    const {
      accountCreationRequest,
      // Defaults to the production url if undefined
      // @todo To update URL link once domain is finalized
      redirectUrl = "https://partners.enkeldigital.com/#/signup",
    } = req.body;

    // @todo Add validation for accountCreationRequest

    // Generate a random secret token user can use to identify/prove themselves, where this token will ONLY be sent to their email address
    accountCreationRequest.token = Math.random().toString(36).substring(2);

    // Make lowercase, refer to notes & faq on why this is lowercase.
    // tl;dr Firebase auth like google ignores the email RFC and forces email case-insensitivity
    accountCreationRequest.email = accountCreationRequest.email.toLowerCase();

    // @todo Check if the account is already created

    await SQLdb("new_partnerAccounts").insert(accountCreationRequest);

    // Generate link for user to click
    // Encode the data object to base64 to pass it along safely via the URL
    // Insert keys onto object 1 by 1 to prevent malicious users from adding extra data onto the accountCreationRequest object, and us using it blindly
    // Parse and get back the data object on the frontend using -> JSON.parse(atob(accountCreationRequest))
    // @todo We might want to sign this to prevent tampering
    const link = `${redirectUrl}?accountCreationRequest=${getBase64({
      partnerID: accountCreationRequest.partnerID,
      email: accountCreationRequest.email,
      admin: accountCreationRequest.admin,
      token: accountCreationRequest.token,
    })}`;

    // Send user email verification link only after successful DB insert
    // await to ensure only respond with success only after the mail has been sent
    // @todo To use sendgrid template instead of this in code mail template
    await sendMail({
      to: accountCreationRequest.email,
      from: "Accounts@classexpress.com",
      subject: `New ClassExpress partner "${
        accountCreationRequest.admin ? "admin" : "employee"
      }" account created`,
      html:
        `A ClassExpress partner account has been created for this email.<br />` +
        "Click the link to complete account creation now or safely ignore this email if you did not request for this.<br />" +
        "<br />" +
        link,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Utility function to check if there is a valid pending partnerAccount in DB
 * @param {String} accountCreationRequest Base64 encoded string of a account creation request object
 */
async function isValidPendingAccount(accountCreationRequest) {
  const { email, token, partnerID, admin } = getObject(accountCreationRequest);
  // @todo Used for debugging only
  // console.log("valid new link", email, token, partnerID, admin);

  return (
    SQLdb("new_partnerAccounts")
      .where({ email, token, partnerID, admin })
      // Do not select "id" and "createdAt", because when using to insert into partnerAccounts, it will cause conflicts
      // "token" is also not selected, as it should not be accessed again or accidentally sent back to the user.
      .select("partnerID", "email", "admin")
      .first()
  );
}

/**
 * Validate the partnerAccount email and token combination to see if it is a valid account creation link
 * @todo Need to  support the admin RE-creating the user, if the employee fails to click link and requests for a new one!
 * @todo Only need to do if we are to support a expiration time. Do in beta maybe??
 * @name POST /employees/new/validate-link
 * @function
 * @param {object} name
 * @param {object} token
 * @returns {object} Success indicator
 */
router.post("/new/validate-link", express.json(), async (req, res) => {
  try {
    // @todo Validate the input, make sure not empty or some random weird shit that can fk up the DB query
    const { accountCreationRequest } = req.body;

    const partnerAccount = await isValidPendingAccount(accountCreationRequest);

    // If account does not exist, it means the accountCreationRequest string is invalid
    if (!partnerAccount) throw new Error("Account Creation Request is invalid");

    // @todo Implement , timeLeft: partnerAccount.createdAt , but might be hard since the func no longer returns createdAt
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res
      .status(422) // Although it is user not found (usually 404), this is a validation failure, thus 422
      .json({ success: false, error: ["Invalid link", error.message] });
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
    // @todo Validate inputs
    const { employee, accountCreationRequest } = req.body;

    // Parse out email and uid from the firebase auth JWT for verification and account update
    const { email, uid } = req.authenticatedUser;

    // Get pending partner account from DB if valid using the accountCreationRequest string
    const pendingPartnerAccount = await isValidPendingAccount(
      accountCreationRequest
    );

    // End request if there isnt a valid pending partner account request in the DB
    if (!pendingPartnerAccount)
      return res
        .status(422) // Although it is user not found (usually 404), this is a validation failure, thus 422
        .json({ success: false, error: "Invalid token and data combination" });

    /*
      MAKE SURE the email from JWT is the SAME as the one in the accountCreationRequest.
      The email CANNOT be different from the firebase auth account created and cannot be modified after confirmation.

      Without this, malicious users' can change the email address on the frontend and create a firebase auth
      account with an email different from the one specified in accountCreationRequest and thus be able to take
      over the account from the legitimate user.
    */
    if (email !== pendingPartnerAccount.email)
      throw new Error(
        "Account Email is different from the email specified in the Account Creation Request"
      );

    // @todo Verify that link is not yet expired

    /*
      Spread values from the input employee object and the now verified accountCreationRequest onto the final employee object,
      to ensure data is the same in partnerAccounts as what was inserted into new_partnerAccounts during account creation request.
      Preventing malicious users from tampering with the employee object, and e.g. promote themselves to be admins.
    */
    const finalEmployee = { ...employee, ...pendingPartnerAccount };

    // Create new partnerAccount using the data from partner account creation request and new data from the frontend form
    await SQLdb("partnerAccounts").insert(finalEmployee);

    // Remove the entry in new_partnerAccounts ONLY AFTER insert to partnerAccounts table is successful
    await SQLdb("new_partnerAccounts")
      .where({
        email,
        partnerID: pendingPartnerAccount.partnerID,
        admin: pendingPartnerAccount.admin,
      })
      .del();

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
