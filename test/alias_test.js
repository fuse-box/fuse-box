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
})