/**
 * @module knexfile
 * Configurations for the different Databases.
 */

const client = "postgresql";

/**
 * Default connection value
 *
 * Uses encodeURIComponent
 *
 * All env variables are pre-fixed with "SQL_"
 */
const connection = {
  host: encodeURIComponent(process.env.SQL_HOSTNAME) || "localhost",
  database: encodeURIComponent(process.env.SQL_DB_NAME) || null, // Null makes knex connect to the default DB, which is usually "postgres"
  port: encodeURIComponent(process.env.SQL_PORT) || 5432,
  user: encodeURIComponent(process.env.SQL_USERNAME) || "postgres",
  password: encodeURIComponent(process.env.SQL_PASSWORD) || "password",
};

/**
 * Default pool value
 */
const pool = {
  min: 0,
  max: 10,
  createTimeoutMillis: 3000,
  acquireTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 100,
  propagateCreateError: false,
};

/**
 * Default migrations value
 */
const migrations = {
  tableName: "knex_migrations",
  directory: "./migrations",
};

module.exports = {
  development: {
    client,
    connection: {
      ...connection,

      // Overrides the default database name
      database: "CE",
    },
    pool,
    migrations,
  },

  staging: {
    client,
    connection,
    pool,
    migrations,
  },

  production: {
    client,
    connection,
    pool: {
      ...pool,

      // Override default pool values
      max: 100,
      acquireTimeoutMillis: 30000,
    },
    migrations,
  },
};
