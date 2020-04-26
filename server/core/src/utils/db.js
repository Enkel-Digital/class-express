/**
 * Module wrapper around firestore to export a DB singleton
 * @author JJ
 * @module DB singleton
 */

const admin = require("./firebaseAdmin");
module.exports = admin.firestore();
