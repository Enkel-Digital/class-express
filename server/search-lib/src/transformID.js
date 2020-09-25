/**
 * Middleware to transform IDs into classID or partnerID and create objectID,
 * using a prependedString and the id value in the body
 *
 * Not async, but since fn might be async, we want to set this to async since that is what we are returning,
 * to signal to the caller to await for the result if they need it.
 */
module.exports = (prependedString, searchObject) => {
  searchObject.objectID = `${prependedString}${searchObject.id}`;
  searchObject[`${prependedString}ID`] = searchObject.id;
  return searchObject;
};
