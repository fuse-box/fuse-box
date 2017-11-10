const gulp = require("gulp");
const rename = require("gulp-rename");
const clean = require("gulp-clean");
const replace = require("gulp-replace");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const runSequence = require("run-sequence");
const bump = require("gulp-bump");
const wrap = require("gulp-wrap");
const uglify = require("gulp-uglify");
const { exec, spawn } = require("child_process");
const homedir = require("homedir");
const fs = require("fs");
const header = require("gulp-header");
const path = require("path");
const os = require('os');
const fsExtra = require("fs-extra");


let RELEASE_FOLDER = "./dist";
let FUSEBOX_BIN = "./dist/index"

const getDistFuseBoxConfig = (conf, quantum) => {
    process.env.PROJECT_ROOT = __dirname;
    process.env.FUSEBOX_MODULES = path.resolve(RELEASE_FOLDER, "modules");
    const { FuseBox, JSONPlugin, QuantumPlugin } = require(FUSEBOX_BIN);
    let quantumConf = Object.assign({
        bakeApiIntoBundle: "fusebox",
        uglify: false,
        ensureES5: false,
        replaceProcessEnv: false,
        treeshake: true,
        target: "server",
        containedAPI: true,
        warnings: false
    }, quantum || {});

    let selfConfig = {
        homeDir: RELEASE_FOLDER,
        output: "$name.js",
        target: "server@esnext",
        cache: false,
        globals: { "default": "*" },
        plugins: [
            JSONPlugin(),
            quantum !== false && QuantumPlugin(quantumConf)
        ],
    }
    selfConfig = Object.assign(selfConfig, conf)

    return FuseBox.init(selfConfig)
}


let watching = false;

function onError(error) {
    if (!watching) {
        process.exit(1);
    }
}

let projectTypings = ts.createProject("src/tsconfig.json", {
    removeComments: false,
    declaration: true
});
let projectCommonjs = ts.createProject("src/tsconfig.json", {
    target: "esnext"
});

let projectLoader = ts.createProject("src/loader/tsconfig.json");
let projectLoaderTypings = ts.createProject("src/loader/tsconfig.json", {
    removeComments: false,
});
let projectModule = ts.createProject("src/modules/tsconfig.json");
let filesMain = ["src/**/*.ts", "!./**/tests/**/**", "!./src/loader/LoaderAPI.ts", "!./src/modules/**/*.ts"];


gulp.task("prepare:js", function() {
    return result = gulp.src(filesMain)
        .pipe(projectCommonjs()).js
        .pipe(gulp.dest(RELEASE_FOLDER));
});

gulp.task("prepare:typings", function() {
    return result = gulp.src(filesMain)
        .pipe(projectTypings()).dts
        .pipe(gulp.dest(RELEASE_FOLDER));
});
gulp.task("prepare:clean", function() {
    return result = gulp.src(RELEASE_FOLDER, { read: false })
        .pipe(clean());
});
gulp.task("prepare:copy-package", function() {
    return result = gulp.src("./package.json")
        .pipe(gulp.dest(RELEASE_FOLDER))
});

gulp.task("prepare:dist-loader-typings", () => {
    return gulp.src("src/loader/LoaderAPI.ts")
        .pipe(projectLoaderTypings()).dts
        .pipe(rename("LoaderAPI.ts"))
        .pipe(gulp.dest("src/modules/fuse-loader"));
});
gulp.task("prepare:modules", ["prepare:dist-loader-typings"], () => {
    return gulp.src(`src/modules/**/*.ts`)
        .pipe(projectModule()).on("error", onError)
        .pipe(gulp.dest(path.join(RELEASE_FOLDER, "modules")));
});

gulp.task("prepare:copy-modules", function() {
    return result = gulp.src("modules/**/**.**")
        .pipe(gulp.dest(path.join(RELEASE_FOLDER, "modules")))
});

gulp.task("prepare:loader", () => {
    return gulp.src("src/loader/LoaderAPI.ts")
        .pipe(projectLoader()).on("error", onError).js
        .pipe(wrap(`(function(__root__){
if (__root__["FuseBox"]) return __root__["FuseBox"];
<%= contents %>
return __root__["FuseBox"] = FuseBox; } )(this)`))
        .pipe(rename("fusebox.js"))
        .pipe(gulp.dest(path.join(RELEASE_FOLDER, "modules/fuse-box-loader-api")))
        .pipe(rename("fusebox.min.js"))
        .pipe(uglify())
        .pipe(replace(/;$/, ""))
        .pipe(replace(/^\!/, ""))
        .pipe(gulp.dest(path.join(RELEASE_FOLDER, "modules/fuse-box-loader-api")));

});

gulp.task("dist", ["prepare:clean"], function(done) {
    return runSequence(
        "prepare:copy-package",
        "prepare:js",
        "prepare:copy-modules",
        "prepare:loader",
        "prepare:typings",
        "prepare:modules",
        "prepare:es5-bundle",
        done)
});

gulp.task("prepare:es5-bundle", (done) => {
    const fuse = getDistFuseBoxConfig({
        homeDir: "src",
        output: "dist/$name.js",
        target: "server@es5",
        tsConfig: [{
            target: "es5"
        }]
    }, {
        bakeApiIntoBundle: "es5",
        uglify: true
    });
    fuse.bundle("es5")
        .instructions(">[index.ts]");
    return fuse.run();
});


gulp.task("increment-next-version", function() {
    const pkgPath = path.resolve("package.json");
    let json = require(pkgPath);
    let main = json.version;
    let matched = main.match(/(.*)(next\.)(\d{1,})/i);
    if (matched) {
        json.version = `${matched[1]}${matched[2]}${(matched[3] * 1) + 1}`;
        fs.writeFileSync(pkgPath, JSON.stringify(json, 2, 2));
    } else {
        throw new Error("Invalid next template")
    }
});


gulp.task("next", [], function(done) {
    runSequence("increment-next-version", "dist", "publish-next", done);
});


gulp.task("publish-next", function(done) {
    var publish = spawn("npm", ["publish", "--tag", "next"], {
        stdio: "inherit",
        cwd: path.resolve(RELEASE_FOLDER)
    });
    publish.on("close", function(code) {
        if (code === 8) {
            gulp.log("Error detected, waiting for changes...");
        }
        done();
    });
});


gulp.task("dist-loader", ["dist-loader-js", "dist-loader-typings"]);

/**
 * Used to build the fusebox modules
 * When adding a new module here be sure to .gitignore `modules/${name}/`
 */
gulp.task("dist-modules", ["dist-loader-typings"], () => {
    return gulp.src(`src/modules/**/*.ts`)
        .pipe(projectModule()).on("error", onError)
        .pipe(gulp.dest(`modules`));
});

gulp.task("commit-release", function(done) {
    let json = JSON.parse(fs.readFileSync(__dirname + "/package.json").toString());
    exec(`git add .; git commit -m "chore(publish): Release ${json.version}" -a; git tag v${json.version}; git push origin master --tags`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        done();
    });
});

gulp.task("changelog", (done) => {
    exec("conventional-changelog -p angular", (e, m) => {
        console.log(m);
        done();
    })
})

gulp.task("make-test-runner", (done) => {
    const fuse = getDistFuseBoxConfig({
        homeDir: 'src',
        output: `bin/$name.js`
    });
    fuse.bundle("fusebox")
        .instructions(">[index.ts]");
    return fuse.run();
});


gulp.task("dev-index", () => {
    const contents = `
        const path = require("path");
        process.env.FUSEBOX_DIST_ROOT = __dirname;
        process.env.FUSEBOX_MODULES = path.join(__dirname, "./modules");
        process.env.FUSEBOX_VERSION = path.join(__dirname, "../package.json")
        module.exports = require('./fusebox.js');
    `
    fs.writeFileSync(path.resolve("./.dev/index.js"), contents);
});

gulp.task("dev-fuse", () => {
    const fuse = getDistFuseBoxConfig({
        homeDir: "src",
        output: ".dev/$name.js",
        target: "server@esnext",
        cache: true,
    }, false);
    fuse.bundle("fusebox")
        .instructions(">[index.ts]")
        .watch()
    return fuse.run();
});

gulp.task("dev:ensure-playground", () => {
    const playgroundFolder = path.resolve("./_playground/generic");
    if (!fs.existsSync(playgroundFolder)) {
        fsExtra.ensureDirSync(playgroundFolder);
        fsExtra.ensureDirSync(path.join(playgroundFolder, "src"));
        const fuseFile = `const { FuseBox, WebIndexPlugin } = require("../../.dev");
const fuse = FuseBox.init({
    homeDir : "src",
    output : "dist/$name.js",
    target : "browser",
    sourceMaps : true,
    plugins : [
        WebIndexPlugin()
    ]
});
fuse.dev();

fuse.bundle("app")
    .watch()
    .hmr()
    .instructions(" > index.ts");
fuse.run();`
        fs.writeFileSync(path.join(playgroundFolder, "fuse.js"), fuseFile)
        fs.writeFileSync(path.join(playgroundFolder, "src/index.ts"), `console.log("Hello World")`)
    }


})
gulp.task("dev", () => {
    RELEASE_FOLDER = path.resolve(".dev");
    FUSEBOX_BIN = path.resolve("./bin/fusebox.js");
    return runSequence(
        "prepare:copy-package",
        "prepare:copy-modules",
        "prepare:loader",
        "prepare:modules",
        "dev-fuse",
        "dev:ensure-playground",
        "dev-index", () => {
            console.log(">> FuseBox bundle is ready ");
            console.log(">> You can go playground folder 'cd _playground/generic'");
            console.log(">> Start developing `node fuse.js`");
        });
});
gulp.task("installDevDeps", function(done) {
    var deps = [
        "babel-core",
        "babel-generator",
        "babel-preset-latest",
        "babel-plugin-transform-es2015-modules-commonjs",
        "babylon",
        "cheerio",
        "@angular/core",
        "stylus",
        "less",
        "postcss",
        "postcss-selector-parser",
        "marked",
        "node-sass",
        "uglify-js",
        "uglify-es",
        "source-map@0.5.7",
        "coffee-script",
        "@types/node",
        "vue-template-compiler",
        "vue-template-es2015-compiler",
        "vue",
        "vue-server-renderer",
        "vue-hot-reload-api",
        "vue-class-component",
        "rollup",
        "buble",
        "consolidate",
        "pug"
    ];

    const ext = /^win/.test(os.platform()) ? ".cmd" : ""
    spawn("npm" + ext, ["install", "--no-save"].concat(deps), {
        stdio: "inherit",
    });
});