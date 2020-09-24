/**
 * Module that initializes algolia and exports the classes index.
 */

const algoliasearch = require("algoliasearch");

const client = algoliasearch(
  process.env.algolia_ApplicationID,
  process.env.algolia_WriteAPIKey
);

// Defaults to the "classes" index
const index = client.initIndex(process.env.algolia_indexName || "classes");

module.exports = index;
