/**
 * Modules to add new search object(s) to the algolia index.
 * @author JJ
 */

const index = require("./algoliaIndex");
const executeSearchOperation = require("./executeSearchOperation");

const _add = index.saveObject;
const add = async (searchObjects, prependedString) =>
  executeSearchOperation(_add, searchObjects, prependedString);

// @todo Might want to add a custom bulk addition method

module.exports = { _add, add };
