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
let filesMain = ["src/**/*.ts", "!./**/*test*.ts", "!./src/loader/LoaderAPI.ts", "!./src/modules/**/*.ts"];

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
    return gulp.src(filesMain)
        .pipe(sourcemaps.init())
        .pipe(projectCommonjs()).on("error", onError).js
        .pipe(gulp.dest("dist/commonjs"));
});
gulp.task("dist-main", ["dist-typings", "dist-commonjs"]);

/**
 *   NPM deploy management
 */
gulp.task("publish", ["dist-cdn-loader-js"], function(done) {
    runSequence("dist", "increment-version", "commit-release", "npm-publish", done);
});

gulp.task("changelog", function(done) {
    fs.writeFileSync(path.join(__dirname, "docs/changelog.md"), "");
    const storedToken = getGitHubToken();
    var config = {
        token: storedToken,
        repoOwner: "fuse-box",
        repoName: "fuse-box",
    };
    gulp.src("./docs/changelog.md", { buffer: false, base: "./" })
        .pipe(changelog.gulpChangeLogGeneratorPlugin(config))
        .pipe(header("# Changelog"))
        .pipe(gulp.dest("./"))
        .pipe(done);
});
gulp.task("increment-version", function() {
    return gulp.src("./package.json")
        .pipe(bump())
        .pipe(gulp.dest("./"));
});
gulp.task("commit-release", function(done) {
    let json = JSON.parse(fs.readFileSync(__dirname + "/package.json").toString());
    exec(`git add .; git commit -m "Release ${json.version}" -a; git tag v${json.version}; git push origin master --tags`, (error, stdout, stderr) => {
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

gulp.task("copy-to-random", () => {
    return gulp.src("dist/**/**.**")
        .pipe(gulp.dest("../angular2-example/node_modules/fuse-box/dist/"));
});
gulp.task("copy-api-to-random", () => {
    //return gulp.src("modules/fuse-box-loader-api/**/**.js").pipe(gulp.dest("../random/fusemob-ssr/node_modules/fuse-box/modules/fuse-box-loader-api"))
});

/**
 * Combined build task
 */
gulp.task("dist", ["dist-main", "dist-loader", "dist-modules"]);

/**
 * For development workflow
 */

gulp.task("watch", ["dist", "copy-to-random", "copy-api-to-random"], function() {

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
// npm install babel-core babel-generator babel-preset-latest babylon cheerio @angular/core stylus less postcss node-sass uglify-js source-map coffee-script @types/node rollup
gulp.task("installDevDeps", function(done) {
    var deps = [
        "babel-core",
        "babel-generator",
        "babel-preset-latest",
        "babylon",
        "cheerio",
        "@angular/core",
        "stylus",
        "less",
        "postcss",
        "marked",
        "node-sass",
        "uglify-js",
        "source-map",
        "coffee-script",
        "@types/node",
        "rollup",
    ];
    var installDeps = spawn("npm", ["install"].concat(deps), {
        stdio: "inherit",
    });
});
