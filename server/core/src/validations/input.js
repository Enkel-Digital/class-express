/**
 * Generic Validation module
 * @module
 * @author Chaitanya
 */
const validator = require("validator");
const isEmpty = require("./isEmpty");
const { isAddress, isHexStrict } = require("web3-utils");

/**
 * Validates Generic input. Returns error if key is not present in the data
 * @param {Object} data Data contains the fields which need to be validated
 * @param {Array} fieldNames Array of field names which need to be validated
 * @returns {Object} An object with potential errors and validity of data
 */
const validateInput = (data, fieldNames) => {
  const errors = {};
  for (let index = 0; index < fieldNames.length; index++) {
    const fieldName = fieldNames[index];
    data[fieldName] = !isEmpty(data[fieldName]) ? data[fieldName] : "";

    if (fieldName === "email" && !validator.isEmail(data.email)) {
      errors.email = "Email is invalid";
    } else if (fieldName === "to_email" && !validator.isEmail(data.to_email)) {
      errors.to_email = "Email is invalid";
    } else if (fieldName === "public_address" && !isAddress(data.public_address)) {
      errors.public_address = "Not a valid public address";
    } else if (fieldName === "signed_message" && !isHexStrict(data.signed_message)) {
      errors.signed_message = "Not a valid strict hex string";
    } else if (fieldName === "url" && !validator.isURL(data.url)) {
      errors.url = "Not a valid url";
    }

    if (validator.isEmpty(data[fieldName])) {
      errors[fieldName] = `${fieldName} field is required`;
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateInput;
