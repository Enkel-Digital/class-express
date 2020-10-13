"use strict"; // Enforce use of strict verion of JavaScript

/**
 * Setup module to ensure algolia keys are available as env vars for the search-lib to use
 * @author JJ
 */

const assert = require("assert");
const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("setup:MinBalance");

/**
 * setup function only ran when module is imported/required
 * @function Setup
 * @notice Throws and end process if certain conditions are not met
 */
async function setup() {
  try {
    if (!process.env.algolia_ApplicationID)
      throw new Error("Missing 'algolia_ApplicationID' environment variable");
    if (!process.env.algolia_WriteAPIKey)
      throw new Error("Missing 'algolia_WriteAPIKey' environment variable");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

/**
 * @notice Caller does not need to use / assign variable for this module's export as it does not export anything.
 * @notice The point of running the function is to have Caller await this module's require/import to ensure code runs to completion.
 */
if (!process.env.SKIP_SETUP) module.exports = setup();
