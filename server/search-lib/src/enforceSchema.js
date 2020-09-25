/**
 * Explicitly use the data values to prevent extra values from being accidentally inserted
 * @param originalObject
 */
module.exports = function enforceSchema(originalObject) {
  return {
    objectID: originalObject.objectID,
    classID: originalObject.classID,
    partnerID: originalObject.partnerID,
    name: originalObject.name,
    description: originalObject.description,
    location_address: originalObject.location_address,
    pictureSources: originalObject.pictureSources,
    points: originalObject.points,
    _tags: originalObject._tags,
  };
};
