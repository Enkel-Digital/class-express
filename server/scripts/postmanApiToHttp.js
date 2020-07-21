/**
 * Script to parse out Postman collection API in JSON to .http file formats.
 */

const requestItems = [];

requestItems
  .map(
    (req) =>
      `
### ${req.name}
${req.request.method} ${req.request.url.raw}

` + (req.request.body && req.request.body.raw)
  )
  .forEach((req) => console.log(req));
