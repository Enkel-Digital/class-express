/**
 * Simple utility functions for converting objects to and from base64 strings.
 * Useful for when you need to pass around object/binary data in URLs or similar.
 * Note that this functions are breakable if the inputs are bad, with no catches for JSON conversions and stuff
 * Note that using JSON.stringify, special JS types like functions will be auto removed
 * @author JJ
 * @module DB singleton
 */

module.exports = {
  getBase64: (obj) => Buffer.from(JSON.stringify(obj)).toString("base64"),
  getObject: (base64) =>
    JSON.parse(Buffer.from(base64, "base64").toString("ascii")),
};
