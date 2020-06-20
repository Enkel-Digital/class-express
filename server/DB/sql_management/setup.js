/**
 * Module to create the database and tables following the base schema of in the generated SQL files from CoreDatabase.dbml
 * @author JJ
 */

require("dotenv").config();

const config = require("./knexfile")[process.env.NODE_ENV || "development"];

async function createDatabase() {
  const innerConfig = JSON.parse(JSON.stringify(config)); // Clone config to prevent modification from affecting other config users
  const dbName = `${innerConfig.connection.database}`; // Use string interpolation to "clone" the value
  innerConfig.connection.database = null; // change to null to connect to default DB to create the database
  const knex = require("knex")(innerConfig);

  try {
    // Create the CE database if it does not exist
    await knex.raw(`CREATE DATABASE "${dbName}";`);
  } catch (error) {
    if (
      error.message.indexOf(
        `CREATE DATABASE "${dbName}"; - database "${dbName}" already exists`
      ) > -1
    )
      console.log(`${dbName} DB already exists, skipping DB creation step.`);
    else console.error(error);
  }

  // Destroy connection so that the next function can create a new connection to the new DB
  await knex.destroy();

  console.log("Create DB ended");
}

async function createTables() {
  const knex = require("knex")(config);
  const fs = require("fs");
  const path = require("path");

  try {
    // Create BASE SCHEMA using the generated SQL file from DBML in the CE database
    await knex.raw(
      fs.readFileSync(path.join(__dirname, "./BASE_SCHEMA.sql"), "utf8")
    );
  } catch (error) {
    if (error.message.indexOf("already exists") > -1)
      console.log(
        "Tables in CE Database already exists, skipping table creation steps."
      );
    else console.error(error);
  }

  await knex.destroy();

  console.log("Create tables ended");
}

createDatabase().then(createTables);
