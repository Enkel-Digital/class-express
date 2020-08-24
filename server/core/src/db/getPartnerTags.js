const SQLdb = require("@enkeldigital/ce-sql");

/**
 * Get an array of tags for the partner
 * @param partnerID
 * @returns {Array<String>} tags
 */
module.exports = async function getPartnerTags(partnerID) {
  return (
    (await SQLdb("partnerTags").where({ partnerID }).select("tag"))
      // Map it out to only contain the tag itself.
      // @todo Is knex able to do this instead?
      .map((tagObject) => tagObject.tag)
  );
};
