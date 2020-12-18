/**
 * DB abstraction to get class details, including tags, location and other information all together
 * @author JJ
 */

//  Not sure if this will work since you know.... tags is only initialized later, so if we require like that, we must make sure that classDetails is later then dbtags
const tags = require("./tags");

// Proxy object to read the key used on this object as the name of the table and ID type.
module.exports = async function (SQLdb, classID, dbTags = tags) {
  const classObject = await SQLdb("classes")
    .where({ id: classID })
    .where("deleted", false)
    .first();

  // Return nothing to indicate no class found.
  if (!classObject) return;

  // if (!classObject.location_address)
  //   classObject.location_address = await SQLdb("partners")
  //     .where({ id: classObject.partnerID })
  //     .first();

  // @todo Can we achieve this using a SQL JOIN?
  // Inject classTags in as an array
  // classObject.tags = await dbTags.class.get(classID);

  /**
   *
   */
  if (!classObject.location_address) {
    //
    const [partner, classTags] = await Promise.all([
      SQLdb("partners")
        .where({ id: classObject.partnerID })
        .select("location_address")
        .first(),
      dbTags.class.get(classID),
    ]);

    classObject.location_address = partner.location_address;
    classObject.tags = classTags;
  } else classObject.tags = await dbTags.class.get(classID);

  return classObject;
};
