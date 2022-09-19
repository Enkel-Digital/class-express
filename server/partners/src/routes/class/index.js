/**
 * Express Router for class related routes like reserving, cancelling a class and more
 * Mounted on /class
 * @author JJ
 * @module Class routes
 *
 * @todo
 * we need to have past classes for partners too.
 * partnerClasses --> this one just looking at classes / but deleted.
 *                --> then see the updatedAt timestamp for the time of setting deleted:true
 * @todo
 */

const express = require("express");
const router = express.Router();
const { RRule, RRuleSet, rrulestr } = require("rrule");
const auth = require("../../middleware/auth");
const onlyOwnResource = require("../../middleware/onlyOwnResource");
const SQLdb = require("@enkeldigital/ce-sql");
const dbTags = require("@enkeldigital/ce-sql-abstractions/tags");

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
    classObject.tags = await dbTags.class.get(classID);

    res.json({ success: true, class: classObject });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get all the IDs of a partner's classes
 * @todo Only allow partnerAccounts of this partner access
 * @name GET /class/details/of/:partnerID
 * @returns {object} Class object
 */
router.get("/of/:partnerID", async (req, res) => {
  try {
    const { partnerID } = req.params;

    // Only return array of IDs for frontend to get class 1 by 1 only when needed
    const arrayOfClassIDs = (
      await SQLdb("classes")
        .where({ partnerID })
        .where("deleted", false)
        .select("id")
    ).map((clas) => clas.id); // @todo Optimize this todo

    res.json({
      success: true,
      numberOfClasses: arrayOfClassIDs.length,
      classIDs: arrayOfClassIDs,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Compute schedule of a class with given classID on the given date
 * @name GET /class/schedule/:classID/:date
 * @returns {object} Schedule object
 */
router.get("/schedule/:classID/:date", async (req, res) => {
  try {
    const { classID, date } = req.params;

    const rruleSet = new RRuleSet();

    // Add a rrule to rruleSet
    rruleSet.rrule(
      new RRule({
        freq: RRule.WEEKLY,
        dtstart: new Date(Date.UTC(2020, 0, 1)),
        count: 10,
      })
    );

    /*
      This is an issue
      Should the date passed in be a UTC timezone or what?
      how do we deal with the different timezone in this case?
      Is redeploying the app to every new region we go to really a good idea? Or is having a central app better?
      for now develop everything with utc in mind
      also we can safely assume that backend should always be dealing with time in utc
    */
    // eslint-disable-next-line no-inner-declarations
    function getClass(classID, date) {
      // First check if the classID is available on that day
      const available_original = new RRULE(classSchedule.RRULE).test(date); // return bool to see if this date is in the recurring period
      // Check if there is a modification to the class that day
      const available_modified = new RRULE(modification.RRULE).test(date); // return bool to see if the day lies in a modificatin period
    }

    getClass(classID, date);

    res.json({ success: true, schedule: {} });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.use(require("./newClass"));
router.use(require("./updateClass"));
router.use(require("./deleteClass"));

module.exports = router;
