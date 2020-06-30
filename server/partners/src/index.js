/**
 * @fileOverview Run an express server on 3000
 * @requires NPM:express,helmet,compression,cors,morgan
 */

// Setup environment variables
require("dotenv").config();

// setup app
const express = require("express");
const app = express();

const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("index.js:Server Setup");

/**
 * Promise executor function
 * @function Setup
 * @notice Promise executor function to export a Promise from this module to prevent caching
 * @notice Async function to start server, ensuring setup code completes before server is ran
 * @notice Done to follow the waterfall code setup method
 */
async function setup(resolve) {
  /**
   * @notice Run all setup and verification modules first
   * @notice All setup code modules needs to be awaited to ensure Sequential Async execution.
   * @notice Certain Setup/Checks can be skipped for development purposes only.
   * @notice Skpping is done in the module itself, as some modules should never be skipped.
   */
  // await require("./utils/rabbitmq").setup(); // Setup the singleton
  // await require("./setup/MinBalance");
  // await require("./setup/RabbitmqQueues");
  logger.info("Completed calls to all Setup/Check/Verification modules.");

  // setup cors middleware
  const corsOptions = {
    // @todo To change the origin policy. Probs move this into a config module to read from env.
    // origin: ["https://localhost:3000", /\.enkeldigital\.com$/],
    origin: "*",
    credentials: false,
  };

  // Only import and attach morgan if development env is used.
  if (process.env.NODE_ENV === "development")
    app.use(require("morgan")("tiny")); // HTTP logging
  app.use(cors(corsOptions)); // middleware to enables cors
  app.use(helmet()); // middleware which adds http headers
  app.use(compression()); // middleware which uses gzip compression on responses

  /**
   * @notice Mount all the routes on root /
   * @notice Only require/import it here to prevent routes from running before setup code is completed
   */
  app.use("/", require("./routes"));

  // Mount the 404 route and error handling middleware last
  app.use(require("./middleware/404"));
  app.use(require("./middleware/500"));

  /**
   * @notice Setup PORT and timeout last to ensure all setup is done before server starts listening to traffic
   * @notice Server is exported from app.listen which can be exported from this module for testing.
   */
  const port = process.env.PORT || 3000; // Defaults to PORT 3000
  const server = app.listen(port, () =>
    logger.info(`Server running on port: ${port}`)
  );

  // Setup server timeout
  // const timeout = (process.env.TIMEOUT ? process.env.TIMEOUT : 5) * 60 * 1000; // Defaults to 5 minutes
  // server.timeout = timeout;
  // logger.info(`Server's timeout set to: ${server.timeout} milliseconds`);

  // Set timeout event handler to Destroy socket and log error
  // server.on("timeout", function(socket) {
  //   socket.destroy();
  //   logger.error(`Server's timeout value ${timeout} hit.`);
  //   logger.error(`Is the socket destroyed? : ${socket.destroyed}`);
  // });

  // Resolve promise with server object, which is returned to caller who awaits this module
  // Return resolve to ensure that there will be no more code execution after this
  return resolve(server);
}

/**
 * @notice Export server as default exported object, which can be used for testing
 * @notice Caller can get the server object by awaiting the promise
 * @notice Always create a new promise to prevent Node from caching the evaluated result
 * @notice Due to this server's setup, everytime this module is imported, a new server instance is started
 */
module.exports = new Promise(setup);
