/**
 * This module expects any env vars to be injected before this is ever required / used
 * @author JJ
 */

const env = process.env.NODE_ENV || "development";
console.log("ce-sql using env: ", env);

const config = require("./knexfile")[env];
const knex = require("knex")(config);

module.exports = knex;
