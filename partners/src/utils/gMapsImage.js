const apiKey = "AIzaSyBcL1pj_PfdU6DlVbAS1l7z3QrptvWs0EE";

const GmapsUrlConcat = (
  coordinates,
  key = apiKey,
  baseGMapsURL = "https://maps.googleapis.com/maps/api/staticmap?"
) =>
  baseGMapsURL.concat(
    coordinates,
    "&zoom=17&size=600x300&maptype=roadmap&markers=color:red%7Clabel:C%7C",
    coordinates,
    "&key=",
    key
  );

module.exports = GmapsUrlConcat;
