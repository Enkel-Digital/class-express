/**
 * Modules to update search object(s) in the algolia index.
 * @author JJ
 */

const index = require("./algoliaIndex");
const executeSearchOperation = require("./executeSearchOperation");

const _update = (searchObject) =>
  index.partialUpdateObject(
    searchObject,
    { createIfNotExists: false } // Do not allow API caller to use this API to create new search objects.
  );
const update = async (searchObjects, prependedString) =>
  executeSearchOperation(_update, prependedString, searchObjects);

module.exports = { _update, update };
