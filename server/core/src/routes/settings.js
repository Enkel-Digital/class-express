/**
 * Express Router for settings routes
 * Mounted on /settings
 * @author JJ
 * @module Settings routes
 *
 * This router is mounted on a auth protected route,
 * thus individual auth verifier middleware not needed
 */

const express = require("express");
const router = express.Router();
const firebase = require("firebase-admin");
const db = require("../utils/db");
const onlyOwnResource = require("../middleware/onlyOwnResource");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:settings");

/**
 * Get user's settings
 * @name GET /settings/user/:userID
 * @function
 * @returns {object} settings object
 */
router.get("/user/:userID", onlyOwnResource, async (req, res) => {
  try {
    const { userID } = req.params;

    const settingsDoc = await db.collection("settings").doc(userID).get();

    const settings = settingsDoc.data();

    // If user's first time calling settings route
    if (!settings) {
      // default empty settings values
      const defaultSettingsObject = {};

      // Create new empty document
      db.collection("settings").doc(userID).set(defaultSettingsObject);

      return res.json({ success: true, settings: defaultSettingsObject });
    }

    return res.json({ success: true, settings });
  } catch (error) {
    logger.error(error);
    res
      .status(error.code ? error.code : 500)
      .json({ success: false, error: error.message });
  }
});

/**
 * Update settings
 * @name POST /settings/update
 * @function
 * @param {String} userID
 * @param {number} settings Settings to be merged into original settings object
 * or like whole object
 * @returns {object} success indicator
 */
router.post("/update", express.json(), async (req, res) => {
  try {
    // Ensure that the email used as userID is lowercase.
    // Refer to notes for why we are enforcing this lowercase usage.
    const userID = req.body.userID.toLowerCase();
    const { settings } = req.body;

    if (!userID) throw new Error("Missing userID");

    // @todo Extract this out into a middleware
    if (req.authenticatedUser.email !== userID)
      return res
        .status(403)
        .json({ success: false, error: "Forbidden, not your account!" });

    await db
      .collection("settings")
      .doc(userID)
      .update({
        // Spread settings out and save it
        // Due to the way update merges object data, settings object needs to be flat.
        // Refer to frontend on data type choosen to flatten the object
        ...settings,
        modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
