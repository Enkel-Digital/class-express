const SQLdb = require("@enkeldigital/ce-sql");

/**
 * Get an array of tags for the class
 * @param classID
 * @returns {Array<String>} tags
 */
module.exports = async function getClassTags(classID) {
  return (
    (await SQLdb("classTags").where({ classID }).select("tag"))
      // Map it out to only contain the tag itself.
      // @todo Is knex able to do this instead?
      .map((tagObject) => tagObject.tag)
  );
};
