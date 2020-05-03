# Class App backend services
Monorepo for all the backend services used to power the [Class App](https://github.com/Enkel-Digital/class-express-app).

## Running the services
- Start the services individually
    - Enter the folders and use "npm run serve" or their respective start scripts.
- Use docker compose to spin all of the services in docker containers
    - Run all the containers using "docker-compose up"
    - To build and run the images, use "docker-compose up --build"
    - To run only selected services, use "docker-compose up core" for example for the "core" service
- The commands in the services for docker are for pushing to gcr and running on gcp/cloud-run

## Services
- core
    - API service for the App
- partners
    - API service for partners website/portal
- firebase
    - All things firebase related.
    - This dir/ stores all our firebase configs.
    - We are using firestore as our primary database and firebase cloud storage for other static content.
    - There are also serverless functions for Firebase Cloud Functions.
- billing
- search

## License, Author and Contributing
This project is made available under the "AGPL License"  
If you have any questions, contact us via [email](mailto:tech@enkeldigital.com)  

Authors:
- [JJ](https://github.com/Jaimeloeuf)
