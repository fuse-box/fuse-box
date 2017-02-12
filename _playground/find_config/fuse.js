const build = require("../../dist/commonjs/index.js");

const FuseBox = build.FuseBox;
const root = "_playground/find_config/";
const app = FuseBox.init({
    homeDir: `${root}/src`,
    outFile: `${root}/build/out.js`,
    plugins: [build.HTMLPlugin()],
    cache: false
});

app.bundle(">index.ts");