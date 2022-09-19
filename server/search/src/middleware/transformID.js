/**
 * Middleware to transform IDs into classID or partnerID and create objectID,
 * using a prependedString and the id value in the body
 */
module.exports = (prependedString) => (req, _, next) => {
  req.body.objectID = `${prependedString}${req.body.id}`;
  req.body[`${prependedString}ID`] = req.body.id;
  return next();
};
