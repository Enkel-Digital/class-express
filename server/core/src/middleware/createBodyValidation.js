/**
 * Simple DIY middleware to enforce a schema on the request body.
 * Ensuring data is present and of the correct type.
 *
 * @author JJ
 * @example
 * router.post(
 *   "/test",
 *   express.json(),
 *   createBodyValidation({
 *     userID: "any",
 *     classID: "string",
 *   }),
 *   (req, res) => {
 *     // Can be sure that these values are present and have the correct type
 *     const { userID, classID } = req.body;
 *   }
 * );
 */
module.exports = function createBodyValidation(schema) {
  return function validate(req, res, next) {
    try {
      if (!req.body)
        throw new Error("Missing parsed req.body by express.json()");

      for (const property in schema) {
        // @todo For development only. To remove
        console.log(`${property}: ${schema[property]}`);

        const key = property;
        const value = schema[property];

        const valueInReqBody = req.body[key];

        // If missing field
        if (!valueInReqBody)
          throw new Error(`MISSING "${value}" type "${key}" in request body`);

        // Skip type checking if type set to any
        if (value === "any") continue;

        // If invalid type
        // eslint-disable-next-line valid-typeof
        if (typeof valueInReqBody !== value)
          throw new Error(
            `Invalid type "${typeof valueInReqBody}" for "${value}" in request body`
          );
      }

      return next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message || "Missing fields in request body",
      });
    }
  };
};
