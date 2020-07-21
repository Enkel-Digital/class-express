"use strict";

/**
 * Helper module to initialize sendgrid object and export only the send method
 * @author JJ
 */

// Ensure envs are set
require("dotenv").config();
const sendgrid = require("@sendgrid/mail");

// Initialize sendgrid mail with the API key
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Simple wrapper NEEDED to simplify "send" method's API
 * @function
 * @param {Object} emailContent Content object to be sent out
 */
module.exports = (emailContent) => sendgrid.send(emailContent);
