# Class Express backend services
Monorepo for all the backend services used to power [Class Express](https://github.com/Enkel-Digital/class-express-app)

## Running the services
- Start the services individually
    - Enter the folders and use "npm run serve" or their respective start scripts.
- Use script to spin all of the services locally as a cluster, execute these in root
    - npm install
    - npm run serve:cluster
- Use docker compose to spin all of the services in docker containers
    - Run all the containers using "docker-compose up"
    - To build and run the images, use "docker-compose up --build"
    - To run only selected services, use "docker-compose up core" for example for the "core" service
- The commands in the services for docker are for pushing to gcr and running on gcp/cloud-run

## Repos and contents
- config.json
    - Bunch of configuration values that is used throughout the mono repo
    - Used more for documentation purposes then as a IaC module
- DB
    - main.dbml
        - dbml file for SQL schema definition of the main database
    - BillingService.dbml
        - dbml file for SQL schema definition of Billing Service's database
    - sql_management
        - Used to manage SQL databases used by any service
    - ce-sql
        - Wrapper library around knex to use within this monorepo to skip setting up knex everytime with defaults pre-injected already.
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
    - Billing Service wraps around the strip service for core and partners services.
- search
    - Search service wraps around the algolia service
- recommendation
    - Recommendation service to generate personalised recommendations for users.
- notification
    - Notification service wraps around other external services like sendgrid to deliver notifications that are set by the other services or through the admin portal
- error
    - Service used for error reporting and application monitoring.
- others
    - Other resources used throughout the monorepo
- scripts
    - random scripts that can be used anywhere in the monorepo
