/**
 * Express Router for class related routes like reserving, cancelling a class and more
 * Mounted on /class
 * @author JJ
 * @module Class routes
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const getClassTags = require("../../db/getClassTags");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:class");

/**
 * Get class details
 * @name GET /class/details/:classID
 * @returns {object} Class object
 */
router.get("/details/:classID", async (req, res) => {
  try {
    const { classID } = req.params;

    const classObject = await SQLdb("classes")
      .where({ id: classID })
      .where("deleted", false)
      .first();

    if (!classObject)
      return res.status(404).json({ success: false, error: "No such Class" });

    // @todo Can we achieve this using a SQL JOIN?
    // Inject classTags in as an array
    classObject.tags = await getClassTags(classID);

    res.json({ success: true, class: classObject });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.use(require("./reserveAndCancel"));
router.use(require("./userClasses"));

module.exports = router;
