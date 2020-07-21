# sql_management
Repo using knex for SQL Database management / setup / teardown / migrations

## Setup
```sh
# Need to specify a schema file to use, where main == use the "main.dbml" file to generate the schema
npm run setup --schema main
```

## Teardown
```sh
npm run teardown
```

## Migrate to latest version of schema
```sh
npx knex migrate:latest
```

## Seed Database with mock data
```sh
npm run seedDB
```

## To set up a completely new database for testing
Run all 3 commands, Teardown/Setup/SeedDB together
```sh
npm run new
```