# TPM
TPM - standing for **TemPorary Memory** is easiest to understand by just comparing it to cache, with the difference of it immediately clearing after reloading the page.

All your components and routes (`storeRoutesInTPM` in the config) are stored in TPM and loaded when needed, minimizing the amount of requests sent to the server and making the app faster by storing already used data client-side.