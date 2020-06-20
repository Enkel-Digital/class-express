/**
 * Module to tear down everything created using setup.js
 * @author JJ
 */

require("dotenv").config();

const config = require("./knexfile")[process.env.NODE_ENV || "development"];
const dbName = `${config.connection.database}`; // Use string interpolation to "clone" the value
config.connection.database = null; // change to null to connect to default DB to modify the actual targetted DB
const knex = require("knex")(config);

(async function teardown() {
  try {
    // Drop the database only if it exists
    // DB name is case sensitive thus in double quotes
    await knex.raw(`DROP DATABASE IF EXISTS "${dbName}";`);
  } catch (error) {
    console.error(error);
  }

  await knex.destroy();

  console.log("Teardown ended");
})();
