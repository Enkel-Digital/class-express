/**
 * Express Router API for employees to complete their partnerAccount signup
 * Mounted on /employees/new
 * @author Jessica
 * @module Complete new PartnerAccount signup API
 */

const express = require("express");
const router = express.Router();
const admin = require("../../utils/firebaseAdmin");
const auth = require("../../middleware/auth");
const SQLdb = require("@enkeldigital/ce-sql");
const isValidPendingAccount = require("./isValidPendingAccount");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:newPartnerAccount:complete");

/**
 * API to be called after Employees complete their account creation step.
 * This API is used to update their name in the DB
 * @notice AUTH token NEEDS TO BE PRESENT, as email from the token will be used for verification
 * @name POST /employees/new/complete
 * @function
 * @param {object} details or smth????
 * @returns {object} Success indicator
 */
router.post("/complete", auth, express.json(), async (req, res) => {
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
      
      Also email is considered verified as accountCreationRequest is only sent to the user's email
    */
    const finalEmployee = {
      ...employee,
      ...pendingPartnerAccount,
    };

    // Create new partnerAccount using the data from partner account creation request and new data from the frontend form
    // Get the new partnerAccount's id back, as it might be used later for setting creator of partner if employee is first admin.
    const partnerAccountID = (
      await SQLdb("partnerAccounts").insert(finalEmployee).returning("id")
    )[0];

    console.log("partnerAccountID", partnerAccountID);

    // Remove the entry in new_partnerAccounts ONLY AFTER insert to partnerAccounts table is successful
    await SQLdb("new_partnerAccounts")
      .where({
        email,
        partnerID: pendingPartnerAccount.partnerID,
        admin: pendingPartnerAccount.admin,
      })
      .del();

    // Set email to be Verified using uid from JWT, so that they can now login on the portal
    // Email is considered to be verified when the user is able to get the generated token sent only to their email
    // To see the UserRecord reference returned, save as userRecord, then run userRecord.toJSON()
    await admin.auth().updateUser(uid, { emailVerified: true });

    // If user is the first admin/owner of biz, save their ID into the partner table
    if (pendingPartnerAccount.firstAdmin)
      await SQLdb("partners")
        .where({ id: pendingPartnerAccount.partnerID })
        .update({ createdBy: partnerAccountID });

    // Although this is an update internally, to the frontend UX, this is a partner account that is just created
    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
