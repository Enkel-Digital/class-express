/**
 * Module wrapper around firestore to export a DB singleton
 * @author JJ
 * @module DB singleton
 */

const admin = require("firebase-admin");

// Set GCP=true when using Google's infra, to use Google Application Default Credentials
// Which are available by default so we do not need to get service key.
if (process.env.GCP) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://classes-ekd.firebaseio.com"
  });
} else {
  // This is usually for the case when running locally and doing testing.
  // Service Key json to be placed in root dir/
  // Change this to be a module that reads from .env instead
  const serviceAccountFile = require("path").join(__dirname, "../../serviceAccountKey.json");
  const serviceAccount = require(serviceAccountFile);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://classes-ekd.firebaseio.com"
  });
}

const db = admin.firestore();

module.exports = db;
