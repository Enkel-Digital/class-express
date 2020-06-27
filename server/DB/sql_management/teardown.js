/**
 * Module to tear down everything created using setup.js
 * Or you can simply drop the CE database from pgAdmin
 * @author JJ
 */

require("dotenv").config();

(async function teardown() {
  let knex = {}; // Only assign in try/catch but needed outside of block

  try {
    const yesno = require("yesno");
    if (!(await yesno({ question: "Are you sure you want to continue?" })))
      return;

    const config = require("./knexfile")[process.env.NODE_ENV || "development"];
    const dbName = `${config.connection.database}`; // Use string interpolation to "clone" the value
    config.connection.database = null; // change to null to connect to default DB to modify the actual targetted DB
    knex = require("knex")(config);

    // Teardown all current DB connections before DB can be dropped
    // https://www.postgresqltutorial.com/postgresql-drop-database/
    const DB_pids = await knex.raw(`
      SELECT
          pid
      FROM
          pg_stat_activity
      WHERE
          "datname" = '${dbName}';
    `);

    for (const row of DB_pids.rows) {
      await knex.raw(`
        SELECT
          pg_terminate_backend (${row.pid})
        FROM
          pg_stat_activity
        WHERE
          "datname" = '${dbName}';
      `);
    }

    // Drop the database only if it exists
    // DB name is case sensitive thus in double quotes
    await knex.raw(`DROP DATABASE IF EXISTS "${dbName}";`);
  } catch (error) {
    console.error(error);
  }

  await knex.destroy();

  console.log("Teardown ended");
})();
