/**
 * Module to work with algolia search indices in a more generalized and ergonomic API
 * @author JJ
 */

// Setup environment variables
require("dotenv").config();
const executeSearchOperation = require("./executeSearchOperation");

// The actual search object, holding all the methods for the lib user
const search = {
  algoliaClient: require("./algoliaClient"),
  transformID: require("./transformID"),
  executeSearchOperation,

  useIndex(index) {
    return new Proxy(
      {},
      {
        // @todo See how to not use target and not get an error here
        get(target, prop) {
          //   toLowerCase the prop

          const operation = {
            add: async (searchObjects, prependedString) =>
              executeSearchOperation(
                index.saveObject,
                searchObjects,
                prependedString
              ),

            update: async (searchObjects, prependedString) =>
              executeSearchOperation(
                (searchObject) =>
                  index.partialUpdateObject(
                    searchObject,
                    { createIfNotExists: false } // Do not allow API caller to use this API to create new search objects.
                  ),
                searchObjects,
                prependedString
              ),

            del: async (id, prependedString) =>
              index.deleteObject(`${prependedString}${id}`),
          }[prop];

          if (!operation)
            throw new Error(
              "Only search index modification methods can be chained on useIndex"
            );

          return operation;
        },
      }
    );
  },
};

// Export a proxy around the search object
module.exports = new Proxy(search, {
  get(target, prop) {
    switch (prop) {
      case "algoliaClient":
      case "executeSearchOperation":
      case "transformID":
        // @todo See whats the diff
        // return Reflect.get(...arguments);
        return target[prop];

      // The prop will be treated as the index name
      default:
        return search.useIndex(target.algoliaClient.initIndex(prop));
    }
  },

  set() {
    throw new Error("CANNOT SET VALUES ON SEARCH OBJECT");
  },
});
