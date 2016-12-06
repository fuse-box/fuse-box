const build = require("../../build/commonjs/index.js");
const FuseBox = build.FuseBox;
const fs = require("fs");
const FuseBoxContents = fs.readFileSync(__dirname + "/../../assets/frontend/fusebox.min.js").toString();

exports.getTestEnv = (files, str, done) => {
    return new Promise((resolve, reject) => {
        let fsb = new FuseBox({
            log: false,
            cache: false,
            //  standalone: false,
            files: files
        });
        fsb.bundle(str).then(data => {

            let scope = {};
            let str = data.content.toString();
            str = str.replace(/\(this\)\)$/, "(__root__))")
            let fn = new Function("window", "__root__", str);
            fn(scope, scope);
            return resolve(scope);
        });
    });
}