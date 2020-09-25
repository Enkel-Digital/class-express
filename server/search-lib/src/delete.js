/**
 * Modules to delete search object(s) to the algolia index.
 * @author JJ
 */

const index = require("./algoliaIndex");

module.exports = {
  del: async (id, prependedString) =>
    index.deleteObject(`${prependedString}${id}`),
};
