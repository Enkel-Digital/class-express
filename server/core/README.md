# Core API service
This service contains ONLY APIs that are accessible from the client.  

The frontend app uses this for:
- Data that needs authentication AND preprocessing
- Other open and public data
  - Although we are using firestore as our DB, we are avoiding direct access methods with firestore rules as much as possible
  - This is to enforce data contract between the data and client accessing it by providing fixed endpoints with garunteed structures
  - This also allows us to migrate to new DB platforms without worrying about changing frontend controllers for data access

## Installations, Builds and Running
This project requires a .env file which should be in repo root or, available in the directory you run the code from.  
You can find a sample .env file [here](./sample/.env) and below are the configs required in your .env file, in which some are optional:

- PORT (Optional, defaults to "3000")
  - number
  - Port number for the express app to listen to.
  - \*Although this is optional, it is not optional if you plan to run tests! Test files will require this variable to be present, else they will default to PORT 80
- SKIP_SETUP (Optional, runs Setup code and modules if not set)
  - Bool
  - Use this variable to set if you would like to skip the server startup checks and setup code to speed up development work.
  - NEVER EVER USE THIS FOR MAINNET. Use with caution with testnets like ropsten.

Installing dependencies for running/deployment
```shell
npm i --production
```

Installing all dependencies including those for development
```shell
npm i
```

For testing purposes mocha is used, either global or local versions of mocha can be used.  
Test command must be ran in root directory to ensure imports and env file usage are all correct.

```shell
# Install mocha globally and use it to run tests
npm i -g mocha
mocha --exit

# Use local mocha to run tests
npm run test
```

Running in production mode
- Will run with "node" without any resurrection software like forever
- Use this for places like Dockerfiles and others
```cli
npm run start
```

Run the project for development
- Requires devdependencies, e.g. nodemon
```cli
npm run serve
```

Building the documentation
- Note that you need to have devDependencies installed to build the docs
- Docs is built using JSDocs with Docdash template
- Open "./documentation/index.html" with a browser after building the documentation
```cli
npm run buildDocs
```

## Documentation
As mentioned in the section above, you have to build the latest documentation yourself locally.
Sample files are also available [here](./sample/)

## Contributing
For logger, make sure they are created with these naming standards:
```
"Type of module":"file name"
```

E.g. logger for transfer route module in /routes dir should be named
```js
const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("route:transfer");
```