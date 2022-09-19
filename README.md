# Class Express
Class Express is a project created to compete with the `ClassPass` SaaS. This project was worked on between (2020 Feb - Dec) has since been abandoned due to the lack of business interest, but nonetheless served as a great project for learning.


## Subrepos
This project was created as seperate repos but has since been merged into a single monorepo, and here are the subrepos.

- [app](./app)
    - The Class Express PWA built using VueJS version 2 and the Vuetify component library.
- [partners](./partners)
    - The admin portal for partners to offer classes on our platform.
- [server](./server)
    - Monorepo for all the API services.
    - Hybrid (monolithic/microservices) backend design, where there is a single monolithic API backend for specific business domains / frontend.
        - E.g. One monolithic backend for the App and one for the Partners portal, but microservices in the sense that these are still seperate backends for different clients.
        - There are also some shared API services to handle things like billing.
    - Backend build with ExpressJS on top of both the PostgreSQL and Firestore databases.
    - Dockerized services built to run on Google Cloud Platform's Cloud Run (CaaS).
    - See [this README](./server/README.md) for a more detailed breakdown.
- [landing](./landing)
    - Landing page of [Class Express](https://classexpress.enkeldigital.com/).
- [faq](./faq)
    - Class Express FAQ site.
- [error](./error)
    - Utility Vue 2 plugin used by both `app` and `partners` frontend to handle errors globally.
- [loader](./loader)
    - Utility Vue 2 plugin used by both `app` and `partners` frontend to enable use of a loader component globally.


## License, Author and Contributing
This project is developed and made available under the "AGPL License"  
If you have any questions, contact us via [email](mailto:developer@enkeldigital.com)  

### Authors
- [JJ](https://github.com/Jaimeloeuf)
- [Jessica](https://github.com/jessicajacelyn)
- [Zi Kang](https://github.com/zzkzzzz)
- [Kong Wei](https://github.com/kongwei93)
- [Joshua](https://github.com/leeszeray)