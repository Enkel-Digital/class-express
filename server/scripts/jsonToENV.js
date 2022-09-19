/**
 * Save json into env/.env file
 */

const fs = require("fs");
const path = require("path");

// Read Command Line Arguments
function cmdArgs() {
  let idx;

  idx = process.argv.indexOf("-f");
  const jsonFile = process.argv[idx + 1];
  const jsonFilePath = path.join(process.cwd(), jsonFile);

  idx = process.argv.indexOf("-o");
  const outputFile = process.argv[idx + 1];
  const outputFilePath = path.join(process.cwd(), outputFile);

  return {
    jsonFilePath,
    outputFilePath,
  };
}

function main() {
  try {
    const { jsonFilePath, outputFilePath } = cmdArgs();

    // Use require to read and parse the json file
    const json = require(jsonFilePath);
    const jsonString = JSON.stringify(json);

    console.log(outputFilePath);

    // fs.writeFile(outputFilePath, jsonFileNameWithoutExtension + "=" + json, function (err) {
    fs.writeFile(outputFilePath, "json" + "=" + jsonString, function (err) {
      if (err) throw err;
      console.log("ENV file saved");
    });
  } catch (error) {
    console.error(error);
  }
}

main();
