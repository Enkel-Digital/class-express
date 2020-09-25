// Setup environment variables
require("dotenv").config();

module.exports = {
  algoliaIndex: require("./algoliaIndex"),
  executeSearchOperation: require("./executeSearchOperation"),
  transformID: require("./transformID"),
  ...require("./add"),
  ...require("./update"),
  ...require("./delete"),
};
