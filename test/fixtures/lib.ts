const build = require(`../../dist/commonjs/index.js`);
import fs = require("fs");

const FuseBox = build.FuseBox;

const mkdirp = require("mkdirp");
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

export const getTestEnv = (files, str, config, returnConcat) => {
    return new Promise((resolve, reject) => {
        let fsb = new FuseBox(Object.assign({
            log: false,
            cache: false,
            modulesFolder: `${__dirname}/modules/`,
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


export const createEnv = (opts, str?, done?) => {
    const name = opts.name || `test-${new Date().getTime()}`;

    let tmpFolder = path.join(appRoot.path, ".fusebox", "test-tmp");
    mkdirp(tmpFolder)
    let localPath = path.join(tmpFolder, name);

    const output: any = {
        modules: {}
    }

    const modulesFolder = path.join(localPath, "modules");
    // creating modules
    return each(opts.modules, (moduleParams, name) => {
        return new Promise((resolve, reject) => {
            moduleParams.outFile = path.join(modulesFolder, name, "index.js");
            moduleParams.package = name;
            moduleParams.cache = false;
            moduleParams.log = false;
            FuseBox.init(moduleParams).bundle(moduleParams.instructions, () => {
                if (moduleParams.onDone) {
                    moduleParams.onDone({
                        localPath: localPath,
                        filePath: moduleParams.outFile,
                        projectDir: path.join(localPath, "project")
                    });
                }
                output.modules[name] = require(moduleParams.outFile);
                return resolve();
            })
        });
    }).then(() => {

        const projectOptions = opts.project;
        projectOptions.outFile = path.join(localPath, "project", "index.js");
        projectOptions.cache = false;
        projectOptions.log = false;
        projectOptions.modulesFolder = modulesFolder;
        return new Promise((resolve, reject) => {
            FuseBox.init(projectOptions).bundle(projectOptions.instructions, () => {
                const contents = fs.readFileSync(projectOptions.outFile);
                const length = contents.buffer.byteLength;
                output.project = require(projectOptions.outFile);
                output.projectSize = length;
                output.projectContents = contents;

                return resolve();
            })
        });
    }).then(() => {
        //deleteFolderRecursive(localPath);
        return output;
    })
}

export const getNodeEnv = (opts, str, done) => {
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