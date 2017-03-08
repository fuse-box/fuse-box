const build = require(`../../dist/commonjs/index.js`);
const fs = require("fs");

const FuseBox = build.FuseBox;

const fsExtra = require("fs-extra");
const appRoot = require("app-root-path");
const { each } = require("realm-utils");
const path = require("path");

const deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

exports.getTestEnv = (files, str, config, returnConcat) => {
    return new Promise((resolve, reject) => {
        let fsb = new FuseBox(Object.assign({
            log: false,
            cache: false,
            modulesFolder: `${__dirname}/modules/`,
            plugins: [build.JSONPlugin()],
            files,
        }, config || {}));

        fsb.bundle(str).then(data => {
            if (returnConcat) return resolve(data);

            let scope = {
                navigator: 1,
            };
            let str = data.content.toString();
            str = str.replace(/\(this\)\);?$/, "(__root__))");

            let fn = new Function("window", "__root__", str);
            fn(scope, scope);

            return resolve(scope);
        });
    });
};

exports.createEnv = (opts, str, done) => {
    const name = opts.name || `test-${new Date().getTime()}`;

    let tmpFolder = path.join(appRoot.path, ".fusebox", "tests");

    fsExtra.ensureDirSync(tmpFolder);
    let localPath = path.join(tmpFolder, name);

    const output = {
        modules: {},
    };

    const modulesFolder = path.join(localPath, "modules");
    // creating modules
    return each(opts.modules, (moduleParams, name) => {
        return new Promise((resolve, reject) => {
            moduleParams.outFile = path.join(modulesFolder, name, "index.js");
            moduleParams.package = name;
            moduleParams.cache = false;
            moduleParams.log = false;

            moduleParams.tsConfig = path.join(appRoot.path, "test", "fixtures", "tsconfig.json");

            FuseBox.init(moduleParams).bundle(moduleParams.instructions, () => {
                if (moduleParams.onDone) {
                    moduleParams.onDone({
                        localPath,
                        filePath: moduleParams.outFile,
                        projectDir: path.join(localPath, "project"),
                    });
                }
                output.modules[name] = require(moduleParams.outFile);
                return resolve();
            });
        });
    }).then(() => {

        const projectOptions = opts.project;
        projectOptions.outFile = path.join(localPath, "project", "index.js");
        projectOptions.cache = false;
        projectOptions.log = false;
        projectOptions.tsConfig = path.join(appRoot.path, "test", "fixtures", "tsconfig.json");
        projectOptions.modulesFolder = modulesFolder;
        return new Promise((resolve, reject) => {
            FuseBox.init(projectOptions).bundle(projectOptions.instructions, () => {
                const contents = fs.readFileSync(projectOptions.outFile);
                const length = contents.buffer.byteLength;
                output.project = require(projectOptions.outFile);
                output.projectSize = length;
                output.projectContents = contents;

                return resolve();
            });
        });
    }).then(() => {
        //deleteFolderRecursive(localPath);
        return output;
    });
};

exports.getNodeEnv = (opts, str, done) => {
    return new Promise((resolve, reject) => {
        let tmpFolder = path.join(appRoot.path, ".tmp");

        fsExtra.ensureDirSync(tmpFolder);
        let filePath = path.join(tmpFolder, `test-${new Date().getTime()}-${Math.random()}.js`);

        let fsb = new FuseBox(opts);
        fsb.bundle(str).then(data => {
            fs.writeFileSync(filePath, data.content);
            let res = require(filePath);
            fs.unlinkSync(filePath);
            return resolve(res);
        });
    });
};
