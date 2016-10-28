const gulp = require('gulp');
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
let projectTypings = ts.createProject('src/tsconfig.json');
let projectCommonjs = ts.createProject('src/tsconfig.json', {
    target: "es6",
});

gulp.task("dist-typings", () => {
    let result = gulp.src('src/**/*.ts')
        .pipe(projectTypings());
    return result.dts.pipe(gulp.dest('dist/typings'));
});

gulp.task("dist-commonjs", () => {
    let result = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(projectCommonjs());
    return result.js.pipe(gulp.dest('dist/commonjs'));
});



gulp.task("test-build", ["build"], () => {
    return runSequence("webpack")
});



gulp.task('build', function() {
    let result = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(projectCommonjs());
    return result.js.pipe(gulp.dest('build/commonjs'));
});

const spawn = require('child_process').spawn;
let node;

gulp.task('hello', function() {
    if (node) node.kill()
    node = spawn('node', ['hello.js'], {
        stdio: 'inherit'
    })
    node.on('close', function(code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});


gulp.task('watch', ['build'], function() {
    gulp.watch(['assets/**/*.js'], () => {
        runSequence('hello');
    });

    gulp.watch(['src/**/*.ts'], () => {
        runSequence('build');
    });
});

gulp.task('dist', ['dist-typings', 'dist-commonjs'], function() {

});