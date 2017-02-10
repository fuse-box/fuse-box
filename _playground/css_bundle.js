const fsbx = require("../build/commonjs/index.js");

const FuseBox = fsbx.FuseBox;

const app = FuseBox.init({
    homeDir: '_playground/cssbundle',
    outFile: './_playground/_build/out.js',
    plugins: [
        [fsbx.SassPlugin(), fsbx.CSSPlugin({ bundle: "bundle.css" })],
        fsbx.CSSBundle()

    ],
    cache: false
});

app.bundle(">app.tsx", true);