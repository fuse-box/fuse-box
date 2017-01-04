const build = require(`../../${process.env.TRAVIS ? "dist" : "build"}/commonjs/index.js`);
const fs = require("fs");

const FuseBox = build.FuseBox;

const mkdirp = require("mkdirp");
const appRoot = require("app-root-path");
const path = require("path");
exports.getTestEnv = (files, str, config, returnConcat) => {
    return new Promise((resolve, reject) => {
        let fsb = new FuseBox(Object.assign({
            log: false,
            cache: false,
            plugins: [build.JSONPlugin()],
            files: files
        }, config || {}));

        fsb.bundle(str).then(data => {
            if (returnConcat) return resolve(data);

            let scope = {
                navigator: 1
            };
            let str = data.content.toString();
            str = str.replace(/\(this\)\);?$/, "(__root__))");

            let fn = new Function("window", "__root__", str);
            fn(scope, scope);
            
            return resolve(scope);
        });
    });
}

exports.getNodeEnv = (opts, str, done) => {
    return new Promise((resolve, reject) => {
        let tmpFolder = path.join(appRoot.path, ".tmp");
        mkdirp(tmpFolder)
        let filePath = path.join(tmpFolder, `test-${new Date().getTime()}-${Math.random()}.js`);

        let fsb = new FuseBox(opts);
        fsb.bundle(str).then(data => {
            fs.writeFileSync(filePath, data.content);
            let res = require(filePath);
            fs.unlinkSync(filePath);
            return resolve(res);
        });
    });
}