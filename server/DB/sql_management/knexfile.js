// Configurations for the different Databases
// All env variables are pre-fixed with "SQL_"
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "CE",
      port: 5432,
      user: "postgres",
      password: "password",
    },
    pool: {
      min: 0,
      max: 10,
      createTimeoutMillis: 3000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: false,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      host: encodeURIComponent(process.env.SQL_HOSTNAME),
      database: encodeURIComponent(process.env.SQL_DB_NAME),
      port: encodeURIComponent(process.env.SQL_PORT),
      user: encodeURIComponent(process.env.SQL_USERNAME),
      password: encodeURIComponent(process.env.SQL_PASSWORD),
    },
    pool: {
      min: 0,
      max: 10,
      createTimeoutMillis: 3000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: false,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: encodeURIComponent(process.env.SQL_HOSTNAME),
      database: encodeURIComponent(process.env.SQL_DB_NAME),
      port: encodeURIComponent(process.env.SQL_PORT),
      user: encodeURIComponent(process.env.SQL_USERNAME),
      password: encodeURIComponent(process.env.SQL_PASSWORD),
    },
    pool: {
      min: 0,
      max: 100,
      createTimeoutMillis: 3000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: false,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },
};
