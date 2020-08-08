/**
 * Validator function for checking if string is valid URL and if it is also HTTPS only.
 */

const validator = require("validator");

module.exports = (value) =>
  validator.isURL(value) && value.indexOf("https://") !== -1;
