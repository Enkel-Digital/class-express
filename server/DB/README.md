# DB
Everything Database related will be in here.


## Schemas
This repo contains some schema files created using the [Database Markup Language](https://www.dbml.org/docs/). Although DBML is built for SQL, it is used for both our SQL DB schemas and NoSQL DB schema definitions for consistency and readability.
- main.dbml
    - This schema is the main SQL database used by both the core and partners API service.
    - The created database is directly accessible by both services.
- billing.dbml
    - This schema is for the Billing Service.
    - Billing Service owns this database.


## Directories
- [ce-sql](./ce-sql)
    - Scoped npm library, "@enkeldigital/ce-sql" that is essentially just a wrapper around the knex library with preset configurations to keep the use of knex consistent across services.
- [sql_management](./sql_management)
    - Package used to manage our SQL databases.
    - Contains 4 npm scripts that can be runned
        - **setup**
            - Creates a new Database (database name from knex config file) and tables using those specified in the [main.dbml](./main.dbml) file.
            - Note that this cannot run unless the database does not exists. Used for a new database, else teardown the old database first.
        - **teardown**
            - Tearsdown any existing connection to the database (database name from knex config file) before DROPping the database.
            - USE WITH CAUTION, will delete the whole database and is irreversible
        - **seedDB**
            - Assuming a new database has been created, and you need want to insert some mock data for testing, run this to seed the new Database with some mock data.
            - USE WITH CAUTION, will insert mock data is almost irreversible
        - **new**
            - This is a combination script that will run the above scripts in sequence,
                1. npm run teardown
                2. npm run setup
                3. npm run seedDB
            - USE WITH CAUTION, will delete existing database if exists and is irreversible
    - To run any of the scripts you would need a .env file in the package root, to specify:
        - NODE_ENV
        - And SQL configuration values like
            - *SQL_HOSTNAME*
            - *SQL_DB_NAME*
            - *SQL_PORT*
            - *SQL_USERNAME*
            - *SQL_PASSWORD*