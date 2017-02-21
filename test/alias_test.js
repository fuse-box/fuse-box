const should = require("should");

const { getTestEnv, createEnv } = require("./fixtures/lib.js")
describe("Alias test", (done) => {

    it("Should replace an alias - case 1", (done) => {

        createEnv({
            project: {
                alias: {
                    "utils": "~/utils/far/away/a/b/c"
                },
                files: {
                    "index.ts": `exports.something = require("utils/hello")`,
                    "utils/far/away/a/b/c/hello.js": "module.exports = { result : 'I was so far away, but i am here now'}"
                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            out.should.deepEqual({ something: { result: 'I was so far away, but i am here now' } })
            done();
        })
    })

    it("Should replace an alias - case 2", (done) => {

        createEnv({
            project: {
                alias: {
                    "utils": "~/utils/far/away/a/b/c/"
                },
                files: {
                    "index.ts": `exports.something = require("utils/hello")`,
                    "utils/far/away/a/b/c/hello.js": "module.exports = { result : 'I was so far away, but i am here now'}"
                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            out.should.deepEqual({ something: { result: 'I was so far away, but i am here now' } })
            done();
        })
    });

    it("Should handle aliases with packages", (done) => {

        createEnv({
            modules: {
                "preact-compat": {
                    files: {
                        "index.ts": "module.exports = { name : 'i am preact-compat'}"
                    },
                    instructions: "> index.ts"
                }
            },
            project: {
                alias: {
                    "react": "preact-compat",
                    "react-dom": "preact-compat"
                },
                files: {
                    "index.ts": `module.exports = [
                        require("react"),  
                        require("react-dom")
                    ]`,
                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            out.should.deepEqual([
                { name: 'i am preact-compat' },
                { name: 'i am preact-compat' }
            ])
            done();
        }).catch(done)
    });


    it("Should handle aliases that start with the same chars", (done) => {

        createEnv({
            project: {
                alias: {
                    "utils": "~/utils/far/away/a/b/c/",
                    "utils-foo": "~/utils/far/z"
                },
                files: {
                    "index.ts": `exports.something = [require("utils/hello"), require("utils-foo/stay")]`,
                    "utils/far/away/a/b/c/hello.js": "module.exports = { result : 'I was so far away, but i am here now'}",
                    "utils/far/z/stay.js": "module.exports = { result : 'I should stay here'}"
                },
                instructions: "> index.ts"
            }
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");

            out.should.deepEqual({
                something: [{ result: 'I was so far away, but i am here now' },
                    { result: 'I should stay here' }
                ]
            })
            done();
        })
    });
})