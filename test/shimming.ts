import should = require('should');
const fsbx = require(`../dist/commonjs/index.js`);
const path = require("path");
const { getTestEnv, createEnv } = require("./fixtures/lib")
const fs = require("fs");
const mkdirp = require("mkdirp");

describe('Shimmin', () => {


    it("File shim should work", (done) => {
        createEnv({
            project: {
                shim: {
                    myTestShim: {
                        source: "test/fixtures/shims/helloFirstShim.js",
                        exports: "global.helloFirstShim"
                    }
                },
                files: {
                    "index.ts": `exports.hello = { bar : require("myTestShim") }`
                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            result.project.FuseBox.import("./index")
                .should.deepEqual({ hello: { bar: { result: 'I am helloFirstShim and i am shimmed!' } } })
            done();
        })
    });

    it("Reference shim should work", (done) => {
        (global as any).testReferenceShim = { result: "I am okay" };
        createEnv({
            project: {
                shim: {
                    myTestShim: {
                        exports: "global.testReferenceShim"
                    }
                },
                files: {
                    "index.ts": `exports.hello = { bar : require("myTestShim") }`
                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            result.project.FuseBox.import("./index")
                .should.deepEqual({ hello: { bar: { result: 'I am okay' } } })
            delete (global as any).testReferenceShim;
            done();
        })
    });

});