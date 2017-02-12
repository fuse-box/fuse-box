const build = require("../../dist/commonjs/index.js");

const FuseBox = build.FuseBox;
const app = FuseBox.init({
    homeDir: `${__dirname}/src`,
    outFile: `${__dirname}/build/out.js`,
    modulesFolder: `${__dirname}/src/shims`,
    cache: false
});

app.bundle(">index.ts");