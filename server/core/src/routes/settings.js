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
const SQLdb = require("@enkel-digital/ce-sql");
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

    return res.json({
      success: true,
      settings: await SQLdb("userSettings").where({ userID }),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
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
    const { userID, settings } = req.body;

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
