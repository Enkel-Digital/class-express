require("dotenv").config();

const config = require("./knexConfigs");
const knex = require("knex")(config[process.env.NODE_ENV]);

module.exports = knex;
