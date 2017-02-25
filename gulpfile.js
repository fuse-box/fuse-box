const gulp = require('gulp')
const rename = require('gulp-rename');

const replace = require('gulp-replace');
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const bump = require('gulp-bump');
const child_process = require('child_process');
const spawn = child_process.spawn;
const wrap = require('gulp-wrap');
const uglify = require('gulp-uglify');

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
let projectTypings = ts.createProject('src/tsconfig.json', {
    removeComments: false,
});
let projectCommonjs = ts.createProject('src/tsconfig.json');
let projectLoader = ts.createProject('src/loader/tsconfig.json');
let projectLoaderTypings = ts.createProject('src/loader/tsconfig.json', {
    removeComments: false,
});
let projectModule = ts.createProject('src/modules/tsconfig.json');

/**
 * Our commonjs only files
 */
let filesMain = ['src/**/*.ts', "!./src/loader/LoaderAPI.ts", "!./src/modules/**/*.ts"];

/**
 * Loader API building
 */
gulp.task('dist-loader-js', () => {
    return gulp.src('src/loader/LoaderAPI.ts')
        .pipe(projectLoader()).on('error', onError).js
        .pipe(wrap(`(function(__root__){
if (__root__["FuseBox"]) return __root__["FuseBox"];
<%= contents %>
return __root__["FuseBox"] = FuseBox; } )(this)`))
        .pipe(rename('fusebox.js'))
        .pipe(gulp.dest('modules/fuse-box-loader-api'))
        .pipe(rename('fusebox.min.js'))
        .pipe(uglify())
        .pipe(replace(/;$/, ''))
        .pipe(replace(/^\!/, ''))
        .pipe(gulp.dest('modules/fuse-box-loader-api'))

});
gulp.task('dist-loader-typings', () => {
    return gulp.src('src/loader/LoaderAPI.ts')
        .pipe(projectLoaderTypings()).dts
        .pipe(rename('LoaderAPI.ts'))
        .pipe(gulp.dest('src/modules/fuse-loader'));
});
gulp.task('dist-loader', ['dist-loader-js', 'dist-loader-typings'])

/**
 * Used to build the fusebox modules
 * When adding a new module here be sure to .gitignore `modules/${name}/`
 */
gulp.task('dist-modules', ['dist-loader-typings'], () => {
    return gulp.src(`src/modules/**/*.ts`)
        .pipe(projectModule()).on('error', onError)
        .pipe(gulp.dest(`modules`))
});

/**
 * Main building
 */
gulp.task('dist-typings', () => {
    return result = gulp.src(filesMain)
        .pipe(projectTypings()).dts
        .pipe(gulp.dest('dist/typings'));
});
gulp.task('dist-commonjs', () => {
    return gulp.src(filesMain)
        .pipe(sourcemaps.init())
        .pipe(projectCommonjs()).on('error', onError).js
        .pipe(gulp.dest('dist/commonjs'));
});
gulp.task('dist-main', ['dist-typings', 'dist-commonjs']);

/**
 *   NPM deploy management
 */
gulp.task('publish', function(done) {
    runSequence('dist', 'increment-version', 'commit-release', 'npm-publish', done);
});
gulp.task('increment-version', function() {
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});
gulp.task('commit-release', function(done) {
    let json = JSON.parse(fs.readFileSync(__dirname + '/package.json').toString());
    child_process.exec(`git add .; git commit -m "Release ${json.version}" -a; git tag v${json.version}; git push origin master --tags`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        done();
    });
});
gulp.task('npm-publish', function(done) {
    var publish = spawn('npm', ['publish'], {
        stdio: 'inherit'
    })
    publish.on('close', function(code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
        done()
    });
});

/**
 * Combined build task
 */
gulp.task('dist', ['dist-main', 'dist-loader', 'dist-modules']);

/**
 * For development workflow
 */
gulp.task('watch', ['dist'], function() {
    watching = true;

    gulp.watch(['src/loader/**/*.ts'], () => {
        runSequence('dist-loader');
    });

    gulp.watch(['src/modules/**/*.ts'], () => {
        runSequence('dist-modules');
    });

    gulp.watch(filesMain, () => {
        runSequence('dist-main');
    });
});