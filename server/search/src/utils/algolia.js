// for the default version
const algoliasearch = require("algoliasearch");

// or just use algoliasearch if you are using a <script> tag
// if you are using AMD module loader, algoliasearch will not be defined in window,
// but in the AMD modules of the page

const client = algoliasearch(
  process.env.algolia_ApplicationID,
  process.env.algolia_AdminAPIKey
);
const index = client.initIndex("searchObject");

module.exports = index;
