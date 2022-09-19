/**
 * Singleon module that initializes the algolia client
 */

const algoliasearch = require("algoliasearch");

module.exports = algoliasearch(
  process.env.algolia_ApplicationID,
  process.env.algolia_WriteAPIKey
);
