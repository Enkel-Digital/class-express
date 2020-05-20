/**
 * Module wrapper around firebase-admin to initialize it based on the platform we run it on.
 * @author JJ
 * @module Firebase Admin initialized app singleton
 */

const admin = require("firebase-admin");

/**
 * When running on non-gcp cloud provider infra, use this to read service account key either from ENV or file
 * @function getServiceAccountKey
 */
function getServiceAccountKey() {
  // If inside env var return it after parsing
  if (process.env.serviceAccountKey)
    return JSON.parse(process.env.serviceAccountKey);
  else {
    /**
     * Else read the file directly
     * Usually when running service locally
     * Service Key json to be placed in root dir/
     */
    const serviceAccountFile = require("path").join(
      __dirname,
      "../../serviceAccountKey.json"
    );

    // Inner import as only used conditionally
    const fs = require("fs");

    if (fs.existsSync(serviceAccountFile)) return require(serviceAccountFile);
    else
      throw new Error(
        `Service Account Key file not available locally at: "${serviceAccountFile}"`
      );
  }
}

try {
  /**
   * Set GCP=true when using Google's infra, to use Google Application Default Credentials
   * Which are available by default so we do not need to get service key.
   * By default GCP provides "GOOGLE_APPLICATION_CREDENTIALS" env var, but this strat 1 out of 2
   * Thus using custom "GCP" env var to ensure availability
   * Refer to https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application
   */
  if (process.env.GCP) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: "https://classes-ekd.firebaseio.com",
    });
  } else {
    const serviceAccount = getServiceAccountKey();

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://classes-ekd.firebaseio.com",
    });
  }
} catch (error) {
  console.error(error);

  // @todo Might potentially cut off un-finished stdout/stderr processes
  process.exit(1);
}

module.exports = admin;
