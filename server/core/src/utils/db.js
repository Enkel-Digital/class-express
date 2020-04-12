/**
 * Module wrapper around firestore to export a DB singleton
 * @author JJ
 * @module DB singleton
 */

const admin = require("firebase-admin");
// Service Key json to be placed in root dir/
const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://classes-ekd.firebaseio.com"
});

const db = admin.firestore();

module.exports = db;
