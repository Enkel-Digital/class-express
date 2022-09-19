/**
 * Explicitly use the data values to prevent extra values from being accidentally inserted
 * @todo Might split this up once we split up class and partner to use different indexes
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
    maxParticipants: originalObject.maxParticipants,
    walkIn: originalObject.walkIn,
    _tags: originalObject.tags,
  };
};
