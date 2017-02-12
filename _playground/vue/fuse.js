const fsbx = require("./../../dist/commonjs/index.js");
const FuseBox = fsbx.FuseBox;


let fuseBox = FuseBox.init({
    homeDir: `${__dirname}/src`,
    outFile: `${__dirname}/build/bundle.js`,
    cache: true,
    plugins: [
        fsbx.TypeScriptHelpers(),
        fsbx.VuePlugin()
    ]
});

fuseBox.devServer(">index.ts");