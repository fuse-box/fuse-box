const should = require('should');
const fsbx = require(`../dist/commonjs/index.js`);
const projectPath = require("app-root-path").path
const path = require("path");
const tempFolder = path.join(projectPath, ".fusebox");
const mkdir = require("mkdirp");
const testPath = path.join(tempFolder, "tests", "bundle_in_a_bundle")
mkdir.sync(testPath)
const customModules = `${__dirname}/fixtures/modules`;
const projectTestCase = `${__dirname}/fixtures/cases/bundle_in_a_bundle/foobar`;
const { getTestEnv, createEnv } = require("./fixtures/lib.js")
const foobarBundle = `${customModules}/foobar/index.js`;

describe('Bundle in a bundle', () => {


    it("Should require a bundled package", (done) => {
        createEnv({
            modules: {
                //cache: false,
                foobar: {
                    files: {
                        "index.ts": `export const HelloFoo = "Yep, that's me1"`
                    },
                    instructions: ">index.ts"
                }
            },
            project: {
                //cache: false,
                files: {
                    "index.ts": `exports.hello = { bar : require("foobar") }`
                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            if (result.projectSize > 5400) {
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
                //cache: false,
                foobar: {
                    files: {
                        "index.ts": `export const HelloFoo = "Yep, that's me2!"`
                    },
                    plugins: [fsbx.UglifyJSPlugin()],
                    instructions: ">index.ts"
                }
            },
            project: {
                //cache: false,
                files: {
                    "index.ts": `exports.hello = { bar : require("foobar") }`
                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            if (result.projectSize > 5300) {
                return done(new Error(`Unexpected Bundle Size ${result.projectSize}!! Bundle is not removed from an uglified version`))
            }

            result.project.FuseBox.import("./index")
                .should.deepEqual({ hello: { bar: { HelloFoo: 'Yep, that\'s me2!' } } })

            done();
        });
    });
});