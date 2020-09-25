const enforceSchema = require("./enforceSchema");
const transformID = require("./transformID");

/**
 * Execute a single search operation on a single search object
 * @param {Function} fn Search function to execute
 * @param {object} searchObject Search Object, either a class or partner objectID
 * @param {("class"|"partner")} prependedString String to attach to the id
 */
const _ = async (fn, searchObject, prependedString) =>
  fn(enforceSchema(transformID(prependedString, searchObject)));

/**
 * Wrapper around the inner function "_", with the same exact function signature,
 * Except that this accepts an array of searchObjects
 *
 * Not async, but since fn might be async, we want to set this to async since that is what we are returning,
 * to signal to the caller to await for the result if they need it.
 */
module.exports = async (fn, searchObjects, prependedString) =>
  Array.isArray(searchObjects)
    ? searchObjects.map((searchObject) => _(fn, searchObject, prependedString))
    : _(fn, searchObjects, prependedString);
