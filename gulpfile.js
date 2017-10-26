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
const changelog = require("gulp-changelog-generator");
const { exec, spawn } = require("child_process");
const homedir = require("homedir");
const fs = require("fs");
const header = require("gulp-header");
const path = require("path");
const os = require('os');

const getGitHubToken = () => {
    const f = path.join(homedir(), ".github-token");
    if (fs.existsSync(f)) {
        return fs.readFileSync(f).toString().trim();
    }
};

/**
 * Fail on error if not in watch mode
 */
let watching = false;

function onError(error) {
    if (!watching) {
        process.exit(1);
    }
}

/**
 * ts projects
 */
let projectTypings = ts.createProject("src/tsconfig.json", {
    removeComments: false,
});
let projectCommonjs = ts.createProject("src/tsconfig.json");
let projectLoader = ts.createProject("src/loader/tsconfig.json");
let projectLoaderTypings = ts.createProject("src/loader/tsconfig.json", {
    removeComments: false,
});
let projectModule = ts.createProject("src/modules/tsconfig.json");

/**
 * Our commonjs only files
 */
let filesMain = ["src/**/*.ts", "!./**/tests/**/**", "!./src/loader/LoaderAPI.ts", "!./src/modules/**/*.ts"];

/**
 * Loader API building
 */
gulp.task("dist-loader-js", () => {
    return gulp.src("src/loader/LoaderAPI.ts")
        .pipe(projectLoader()).on("error", onError).js
        .pipe(wrap(`(function(__root__){
if (__root__["FuseBox"]) return __root__["FuseBox"];
<%= contents %>
return __root__["FuseBox"] = FuseBox; } )(this)`))
        .pipe(rename("fusebox.js"))
        .pipe(gulp.dest("modules/fuse-box-loader-api"))
        .pipe(rename("fusebox.min.js"))
        .pipe(uglify())
        .pipe(replace(/;$/, ""))
        .pipe(replace(/^\!/, ""))
        .pipe(gulp.dest("modules/fuse-box-loader-api"));

});

gulp.task("dist-cdn-loader-js", () => {
    return gulp.src("src/loader/LoaderAPI.ts")
        .pipe(projectLoader()).on("error", onError).js
        .pipe(wrap(`(function(__root__){
if (__root__["FuseBox"]) return __root__["FuseBox"];
<%= contents %>
return __root__["FuseBox"] = FuseBox; } )(this)`))
        .pipe(rename("fusebox.js"))
        .pipe(gulp.dest("modules/fuse-box-loader-api"))
        .pipe(rename("fusebox.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist/"));

});

gulp.task("dist-loader-typings", () => {
    return gulp.src("src/loader/LoaderAPI.ts")
        .pipe(projectLoaderTypings()).dts
        .pipe(rename("LoaderAPI.ts"))
        .pipe(gulp.dest("src/modules/fuse-loader"));
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

/**
 * Main building
 */
gulp.task("dist-typings", () => {
    return result = gulp.src(filesMain)
        .pipe(projectTypings()).dts
        .pipe(gulp.dest("dist/typings"));
});
gulp.task("dist-commonjs", () => {
    const distDir = "dist/commonjs";
    return gulp.src(filesMain)
        .pipe(sourcemaps.init())
        .pipe(projectCommonjs()).on("error", onError).js
        .pipe(sourcemaps.mapSources((sourcePath, file) => {
            let filePath = path.relative("..", sourcePath);
            let outDir = path.join(distDir, path.dirname(filePath));
            let srcPath = path.join("src", filePath);
            let outPath = path.relative(outDir, srcPath);
            return outPath;
        }))
        .pipe(sourcemaps.write(".", { includeContent: false }))
        .pipe(gulp.dest(distDir));
});
gulp.task("dist-main", ["dist-typings", "dist-commonjs"]);

/**
 *   NPM deploy management
 */
gulp.task("publish", ["dist-cdn-loader-js"], function(done) {
    runSequence("dist", "increment-version", "commit-release", "npm-publish", done);
});

gulp.task("format-package", function(done) {
    let json = require("./package.json");
    fs.writeFileSync(__dirname + "/package.json", JSON.stringify(json, 2, 2));
});

gulp.task("beta", [], function(done) {
    runSequence("dist", "increment-beta", "commit-beta", "npm-publish-beta", done);
});

gulp.task("increment-version", function() {
    return gulp.src("./package.json")
        .pipe(bump())
        .pipe(gulp.dest("./"));
});

gulp.task("increment-beta", function() {
    let json = require("./package.json");
    let main = json.version;
    let matched = main.match(/(.*)(beta\.)(\d{1,})/i);
    if (matched) {
        json.version = `${matched[1]}${matched[2]}${(matched[3] * 1) + 1}`;
        fs.writeFileSync(__dirname + "/package.json", JSON.stringify(json, 2, 2));
    } else {
        throw new Error("Invalid beta template")
    }
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
gulp.task("commit-beta", function(done) {
    let json = JSON.parse(fs.readFileSync(__dirname + "/package.json").toString());
    exec(`git add .; git commit -m "chore(beta): Release ${json.version}" -a; git push origin master`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        done();
    });
});

gulp.task("npm-publish", function(done) {
    var publish = spawn("npm", ["publish"], {
        stdio: "inherit",
    });
    publish.on("close", function(code) {
        if (code === 8) {
            gulp.log("Error detected, waiting for changes...");
        }
        done();
    });
});

gulp.task("npm-publish-beta", function(done) {
    var publish = spawn("npm", ["publish", "--tag", "beta"], {
        stdio: "inherit",
    });
    publish.on("close", function(code) {
        if (code === 8) {
            gulp.log("Error detected, waiting for changes...");
        }
        done();
    });
});


gulp.task("make-test-runner", (done) => {
    const { FuseBox, JSONPlugin } = require("./dist/commonjs/index");
    const version = require("./package.json").version;
    FuseBox.init({
        package: {
            name: "fuse-box4-test",
            main: "index.js",
        },
        plugins: [JSONPlugin()],
        homeDir: "src",
        outFile: "./bin.js",
        cache: false,
    }).bundle(`[index.ts] +fuse-test-runner +fuse-test-reporter`, done);
});


gulp.task("copy-to-dev", () => {
    const devFolder = "vue-seed";

    gulp.src("modules/fuse-box-css/**/**.**")
        .pipe(gulp.dest(`../${devFolder}/node_modules/fuse-box/modules/fuse-box-css`));

    gulp.src("modules/fuse-box-responsive-api/**/**.**")
        .pipe(gulp.dest(`../${devFolder}/node_modules/fuse-box/modules/fuse-box-responsive-api`));

    return gulp.src("dist/**/**.**")
        .pipe(gulp.dest(`../${devFolder}/node_modules/fuse-box/dist/`));
});

gulp.task("copy-to-random", () => {
    gulp.src("modules/fuse-box-responsive-api/**/**.**")
        .pipe(gulp.dest("../angular2-example/node_modules/fuse-box/modules/fuse-box-responsive-api"));
});
gulp.task("copy-api-to-random", () => {
    // return gulp.src("modules/fuse-box-loader-api/**/**.js")
    //     .pipe(gulp.dest("../react-example/node_modules/fuse-box/modules/fuse-box-loader-api"))
});

/**
 * Combined build task
 */
gulp.task("dist", ["dist-main", "dist-loader", "dist-modules"]);

/**
 * For development workflow
 */

gulp.task("watch-and-copy", ["dist", "copy-to-random", "copy-api-to-random"], function() {

    watching = true;

    gulp.watch(["src/loader/**/*.ts"], () => {
        runSequence("dist-loader", "copy-api-to-random");
    });

    gulp.watch(["src/modules/**/*.ts"], () => {
        runSequence("dist-modules");
    });

    gulp.watch(filesMain, () => {
        runSequence("dist-main", "copy-to-random");
    });
});
gulp.task("watch", ["dist", "copy-to-dev"], function() {
    watching = true;
    gulp.watch(filesMain, () => {
        runSequence("dist-main", "copy-to-dev");
    });
});
// npm install babel-core babel-generator babel-preset-latest babylon cheerio @angular/core stylus less postcss node-sass uglify-js source-map coffee-script @types/node rollup
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
