const SQLdb = require("@enkeldigital/ce-sql");
const { getObject } = require("../../utils/base64");

/**
 * Utility function to check if there is a valid pending partnerAccount in DB
 * @param {String} accountCreationRequest Base64 encoded string of a account creation request object
 */
module.exports = async function isValidPendingAccount(accountCreationRequest) {
  const { email, token, partnerID, admin } = getObject(accountCreationRequest);
  // console.log("verify link", email, token, partnerID, admin); // @todo For development

  return (
    SQLdb("new_partnerAccounts")
      .where({ email, token, partnerID, admin })
      // Do not select "id" and "createdAt", because when using to insert into partnerAccounts, it will cause conflicts
      // "token" is also not selected, as it should not be accessed again or accidentally sent back to the user.
      .select("partnerID", "email", "admin")
      .first()
  );
};
