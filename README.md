# Class Express App
This is a PWA to help users find and attend classes.

## Project setup
### ENV needed
There are some env variables that need to be set for this app to work. Note that these variables are all prefixed with VUE_APP_ to ensure that the Vue CLI will pass them in during the build process.  
The values needed are
- VUE_APP_apiUrl
    - Base URL of the API server
- VUE_APP_Algoliasearch_ID
    - ID of the Algolia Search project
- VUE_APP_Algoliasearch_Key_SearchOnly
    - Search only API key for algolia
- VUE_APP_STRIPE_PUBLISHABLE_KEY
    - Used to create the stripe object with the "loadStripe" method

### Installation
```sh
# Install all dependencies, including devDependencies, for development use
npm install

# Install only the project dependencies
npm install --production
```

### Compiles and hot-reloads for development
```sh
npm run serve
```

### Compiles and minifies for production
```sh
npm run build
```

### Test production build locally
```sh
# Run local server over HTTP
npm run local:http


# Run local server over HTTPS, generating cert first
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout ./dist/key.pem -out ./dist/cert.pem
npm run local:https
```

### Run your tests
```sh
npm run test
```

### Lints and fixes files
```sh
npm run lint
```

## Notes
- Firebase hosting has been [configured to serve index.html for all routes](./firebase.json) ensuring it behaves like a proper S.P.A even though we are not using history mode for our SPA.

## License, Author and Contributing
This project is developed and made available under the "AGPL License"  
If you have any questions, contact us via [email](mailto:developer@enkeldigital.com)  
Authors:
- [JJ](https://github.com/Jaimeloeuf)
- [Jessica](https://github.com/jessicajacelyn)
- [Zi Kang](https://github.com/zzkzzzz)
- [Joshua](https://github.com/leeszeray)
