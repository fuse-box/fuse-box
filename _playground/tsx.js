const build = require("../build/commonjs/index.js");

const FuseBox = build.FuseBox;

const app = FuseBox.init({
    homeDir: '_playground/tsx',
    outFile: './_playground/_build/tsx.js',
    plugins: [build.HTMLPlugin()],
    cache: true
});

app.bundle(">app.tsx", true);