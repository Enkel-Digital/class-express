"use strict";

/**
 * Module wrapping over firebase admin to export a singleton for reducing boiler plate code.
 */

const admin = require("firebase-admin");
const { config } = require("firebase-functions");

// Initialize admin use of FB
admin.initializeApp(config().firebase);

export default admin;
