"use strict";

/**
 * Helper module to initialize the sendgrid mail object and provide a wrapper
 * @author JJ
 */

const sgMail = require("@sendgrid/mail");
const { config } = require("firebase-functions");

// Initialize sendgrid mail with the API key
sgMail.setApiKey(config().sendgrid_api.key);

export default async function(emailContent) {
  // Send the admins a email to notify if DB update is a success
  await sgMail.send(emailContent);

  return true;
}
