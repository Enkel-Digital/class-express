/**
 * Business logic for creating a new pending partner account. Use this to request a new pending partner account.
 * @author JJ
 * @module newPartnerAccount
 */

const SQLdb = require("@enkeldigital/ce-sql");
const { getBase64 } = require("../utils/base64");
const sendMail = require("../utils/sendMail");

/**
 * Create a new pending partnerAccount and send the user a email to complete signup
 * It is assumed that the caller of this function will verify the inputs first to prevent invalid inputs
 * @param {object} accountCreationRequest
 * @param {String} redirectUrl Defaults to the production url if undefined
 *
 * @todo To update URL link once domain is finalized
 * @todo Enforce a limit on the number of employees allowed per business/organization
 */
module.exports = async function newPartnerAccount(
  accountCreationRequest,
  redirectUrl = "https://partners.enkeldigital.com/#/signup"
) {
  // @todo Add validation for accountCreationRequest object

  // Generate a random secret token user can use to identify/prove themselves, where this token will ONLY be sent to their email address
  // Don't need to ensure that token is unique, because token is like hash salt, where salt not necessarily unique,
  // but combination of this and the email is unique since email is required to be unique by the DB's unique constraint.
  accountCreationRequest.token = Math.random().toString(36).substring(2);

  // Make lowercase, refer to notes & faq on why this is lowercase.
  // tl;dr Firebase auth like google ignores the email RFC and forces email case-insensitivity
  accountCreationRequest.email = accountCreationRequest.email.toLowerCase();

  // @todo Add email validation

  // @todo Check if the account is already created

  // Only insert the allowed values
  await SQLdb("new_partnerAccounts").insert({
    partnerID: accountCreationRequest.partnerID,
    email: accountCreationRequest.email,
    token: accountCreationRequest.token,
    admin: accountCreationRequest.admin,

    // Should only be set to true once!
    firstAdmin: accountCreationRequest.firstAdmin,
  });

  // Generate link for user to click
  // Encode the data object to base64 to pass it along safely via the URL
  // Insert keys onto object 1 by 1 to prevent malicious users from adding extra data onto the accountCreationRequest object, and us using it blindly
  // Parse and get back the data object on the frontend using -> JSON.parse(atob(accountCreationRequest))
  // @todo We might want to sign this like a jwt to prevent tampering
  const link = `${redirectUrl}?accountCreationRequest=${getBase64({
    name: accountCreationRequest.name,
    partnerID: accountCreationRequest.partnerID,
    email: accountCreationRequest.email,
    admin: accountCreationRequest.admin,
    token: accountCreationRequest.token,
  })}`;

  // Send user email verification link only after successful DB insert
  // await to ensure only respond with success only after the mail has been sent
  // @todo To use sendgrid template instead of this in code mail template
  // @todo Change the email domain once confirmed
  await sendMail({
    to: accountCreationRequest.email,
    from: "Accounts@classexpress.com",
    subject: `New ClassExpress partner "${
      accountCreationRequest.admin ? "admin" : "employee"
    }" account created for ${accountCreationRequest.name}`,
    html:
      `A ClassExpress partner account has been created for this email.<br />` +
      "Click the link to complete account creation now or safely ignore this email if you did not request for this.<br />" +
      "<br />" +
      link,
  });
};
