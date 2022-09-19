/**
 * DB abstraction to get partner details, including tags and other information all together
 * @author JJ
 */

//  Not sure if this will work since you know.... tags is only initialized later, so if we require like that, we must make sure that classDetails is later then dbtags
const tags = require("./tags");

// Proxy object to read the key used on this object as the name of the table and ID type.
module.exports = async function (SQLdb, classID, dbTags = tags) {
  const partner = await SQLdb("partners")
    .where({ id: partnerID })
    .where("deleted", false)
    .first();

  // Return nothing to indicate no class found.
  if (!partner) return;

  /**
   *
   */
  const [partnerClasses, partnerTags] = await Promise.all([
    SQLdb("classes").where({ partnerID }).where("deleted", false).select("id"),
    dbTags.partner.get(partnerID),
  ]);

  // Inject partnerTags in as an array
  partner.tags = partnerTags;
  // Get array of classIDs for this partner by mapping from the array of "class" objects
  partner.classes = partnerClasses.map((clas) => clas.id);

  return partner;
};
