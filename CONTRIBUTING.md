# Setup
`npm install`

# Dev
`npm start`

# Testing
* Once: Run `npm install` with all the packages in `travis.yml`. As of this writing it means: 

```
npm install babel-core babel-generator babylon cheerio @angular/core stylus less postcss node-sass uglify-js source-map
```

* In one window run `npm start`
* In another window run `npm test -- --watch`

Now you can modify any file in `src`/`src-frontend`/`test` and build will happen automatically followed by tests running automatically.
