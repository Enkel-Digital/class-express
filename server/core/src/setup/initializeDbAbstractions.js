"use strict"; // Enforce use of strict verion of JavaScript

/**
 * Setup module to initialize DB abstractions module
 * @author JJ
 */

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("setup:initializeDbAbstractions");

/**
 * setup function only ran when module is imported/required
 * @function Setup
 * @notice Throws and end process if certain conditions are not met
 */
async function setup() {
  try {
    // Initialize the db tags proxy object
    require("@enkeldigital/ce-sql-abstractions/tags").initialize(
      require("@enkeldigital/ce-sql")
    );
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

/**
 * @notice Caller does not need to use / assign variable for this module's export as it does not export anything.
 * @notice The point of running the function is to have Caller await this module's require/import to ensure code runs to completion.
 */
module.exports = setup();
