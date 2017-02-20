import should = require('should');
const fsbx = require(`../dist/commonjs/index.js`);
const path = require("path");
import fixtures = require("./fixtures/lib")
const { getTestEnv, createEnv } = fixtures;
const fs = require("fs");
const mkdirp = require("mkdirp");

describe('Bundle in a bundle', () => {


    it("Should require a bundled package", (done) => {
        createEnv({
            modules: {
                foobar: {
                    files: {
                        "index.ts": `export const HelloFoo = "Yep, that's me1"`
                    },
                    instructions: ">index.ts"
                }
            },
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("foobar") }`
                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            if (result.projectSize > 5497) {
                return done(new Error(`Unexpected Bundle Size ${result.projectSize}!! Bundle is not removed from an uglified version`))
            }
            result.project.FuseBox.import("./index")
                .should.deepEqual({ hello: { bar: { HelloFoo: 'Yep, that\'s me1' } } })
            done();
        })
    });


    it("Should require a bundled package and work with uglify", (done) => {
        createEnv({
            modules: {
                foobar: {
                    files: {
                        "index.ts": `export const HelloFoo = "Yep, that's me2!"`
                    },
                    plugins: [fsbx.UglifyJSPlugin()],
                    instructions: ">index.ts"
                }
            },
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("foobar") }`
                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            if (result.projectSize > 5380) {
                return done(new Error(`Unexpected Bundle Size ${result.projectSize}!! Bundle is not removed from an uglified version`))
            }

            result.project.FuseBox.import("./index")
                .should.deepEqual({ hello: { bar: { HelloFoo: 'Yep, that\'s me2!' } } })

            done();
        });
    });

    it("Should require bundled file", (done) => {
        let bundleContents;
        createEnv({
            modules: {
                foobar: {
                    files: {
                        "index.ts": `export const HelloFoo = "Yep, that's me2!"`
                    },
                    instructions: ">index.ts",
                    onDone: (info) => {
                        bundleContents = fs.readFileSync(info.filePath).toString();
                    }
                }
            },
            project: {
                files: {
                    "hello.js": () => bundleContents,
                    "index.ts": `exports.hello = { bar : require("./hello.js") }`

                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            if (result.projectSize > 5548) {
                return done(new Error(`Unexpected Bundle Size ${result.projectSize}!! Bundle is not removed from an uglified version`))
            }

            result.project.FuseBox.import("./index")
                .should.deepEqual({ hello: { bar: { HelloFoo: 'Yep, that\'s me2!' } } })

            done();
        });
    });

    it("Should require bundled minified file", (done) => {
        let bundleContents;
        createEnv({
            name: "test-bundle",
            modules: {
                //cache: false,
                foobar: {
                    files: {
                        "index.ts": `export const HelloFoo = "Yep, that's me2!"`
                    },
                    instructions: ">index.ts",
                    plugins: [fsbx.UglifyJSPlugin()],
                    onDone: (info) => {
                        bundleContents = fs.readFileSync(info.filePath).toString();
                    }
                }
            },
            project: {
                //cache: false,
                files: {
                    "hello.js": () => bundleContents,
                    "index.ts": `exports.hello = { bar : require("./hello.js") }`

                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            if (result.projectSize > 5430) {
                return done(new Error(`Unexpected Bundle Size ${result.projectSize}!! Bundle is not removed from an uglified version`))
            }

            result.project.FuseBox.import("./index")
                .should.deepEqual({ hello: { bar: { HelloFoo: 'Yep, that\'s me2!' } } })

            done();
        });
    });
});
