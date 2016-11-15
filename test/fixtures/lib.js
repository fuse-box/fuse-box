const build = require("../../build/commonjs/index.js");
const FuseBox = build.FuseBox;

exports.getTestEnv = (files, str, done) => {
    return new Promise((resolve, reject) => {
        let fsb = new FuseBox({
            log: false,
            cache: false,
            files: files
        });
        fsb.bundle(str, true).then(str => {

            let scope = {};
            str = str.replace(/var __root__=this,/, "")
            let fn = new Function("__root__", str);
            fn(scope);
            return resolve(scope);
        });
    });
}