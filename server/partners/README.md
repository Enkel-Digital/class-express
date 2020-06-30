# Partners API service
This service contains ONLY APIs that are accessible from the partners web app.  

## Used by frontend app for:
- Data that needs requires authentication
- Data that require preprocessing that should not be done on the partners web app
- Other open and public data
	- Although we are using firestore as our DB where we CAN actually access data directly from the frontend
	- We are avoiding direct access methods with firestore rules as much as possible.
	- This is to enforce data contract between the data and partners accessing it by providing fixed endpoints with garunteed structures
	- This also allows us to migrate to new DB platforms without worrying about changing frontend controllers for data access

## Installations, Builds and Running
- This project requires a .env file which should be in repo root or, available in the directory you run the code from.  
- You can find a sample .env file [here](./sample/.env) with detailed information on the configurations required in your .env file

Installing dependencies for running/deployment
```sh
npm i --production
```

Installing all dependencies including those for development
```sh
npm i
```

mocha is used for testing and both global or local versions of mocha can be used.  
```sh
# Test command must be ran in root directory to ensure imports and env file usage are all correct.
npm run test
```

Running in production mode
- Will run with "node" without any resurrection software like forever
- Use this for places like Dockerfiles and others
```sh
npm run start
```

Run the project for development using nodemon to watch for source file changes
```sh
npm run serve
```

## Documentation
- You need to build the latest documentation yourself locally.
- Sample files are also available [here](./sample/) for reference
Building the documentation
- Note that you need to have devDependencies installed to build the docs
- Docs is built using JSDocs with Docdash template
- Open "./documentation/index.html" with a browser after building the documentation
```sh
npm run buildDocs
```

## Contributing
- Follow the company's general coding guidelines [here]()
- Logging in the program
	- Make sure loggers are created with this naming standards:
		```
		"Type of module":"file name"
		```
	- E.g. logger for transfer route module in /routes dir should be named
		```js
		const logger = require("@lionellbriones/logging").default("route:transfer");
		```