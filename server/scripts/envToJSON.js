/**
 * Function to read a stringified JSON from a environment variable
 * @param {string} envVar Key of environment variable to use
 */
function envToJson(envVar) {
  try {
    // If inside env var return it after parsing
    if (process.env[envVar]) return JSON.parse(process.env[envVar]);
  } catch (error) {
    console.error(error);
  }
}
