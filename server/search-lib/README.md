# Search library
ClassExpress Search library, is a customised wrapper around the algolia service for CE specific use.

## Installations, Builds and Running
This project requires a .env file which should be in repo root or, available in the directory you run the code from.  
Sample Environment variables needed for the Algolia client:
```.env
algolia_ApplicationID=MIG517HYXJ
algolia_WriteAPIKey=23ac71ff64e6a490ed0479535e058618
```

To install
```sh
npm i @enkeldigital/ce-search-lib
```

## Using it
- Import individual methods add, update, del from the module to use them.
- If you need more control, import the "algoliaIndex" module to access the index directly.
- Can use the _ prepended methods like _add alongside the utility module executeSearchOperation

### Editing the schema
To update the schema, update [enforceSchema module](./src/enforceSchema.js) in src.