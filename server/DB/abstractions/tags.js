/**
 * DB abstraction to interact with tags.
 * @author JJ
 *
 * Proxy object to use the key used as the name of the table and ID type.
 *
 * Cache the proxy locally after initializing, and caching on module.exports
 * This also means initialize can only be called once, as module.exports will be overwritten with the cached proxy
 */
module.exports.initialize = (SQLdb) =>
  (module.exports = new Proxy(
    {},
    {
      get(target, prop) {
        switch (prop) {
          case "class":
          case "partner":
            // Create object in this function's closure and return it to use "dbName" and allow caller to chain these methods
            return {
              async get(ID) {
                return (
                  (
                    await SQLdb(`${prop}Tags`)
                      .where({ [`${prop}ID`]: ID })
                      .select("tag")
                  )
                    // Map it out to only contain the tag itself.
                    .map((tagObject) => tagObject.tag)
                );
              },

              insert(ID, tags) {
                return Promise.all(
                  tags.map((tag) =>
                    SQLdb(`${prop}Tags`).insert({ [`${prop}ID`]: ID, tag })
                  )
                );
              },

              delete(ID, tags) {
                return Promise.all(
                  tags.map((tag) =>
                    SQLdb(`${prop}Tags`)
                      .where({ [`${prop}ID`]: ID, tag: tag })
                      .delete()
                  )
                );
              },
            };

          default:
            throw new Error("Invalid tag key: ", prop);
        }
      },

      set() {
        throw new Error("CANNOT SET PROPERTIES ON DB TAGS MODULE");
      },
    }
  ));
