const should = require("should");
const getTestEnv = require("./fixtures/lib.js").getTestEnv;

describe("Process variable must be handled with care", (done) => {

    it("Process should be NOT be bundled as it was defined as a variable", (done) => {
        getTestEnv({
            "index.js": `
                var process = {};
                exports.process = process;
            `,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("./index");
            result.should.deepEqual({ process: {} });
            done();
        }).catch(done);
    });


    it("Process should be bundled and required", (done) => {
        getTestEnv({
            "index.js": `
                exports.process = process.env;
            `,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("./index");
            result.should.deepEqual({ process: { NODE_ENV: 'development' } });
            done();
        }).catch(done);
    });

    // @NOTE: not sure where to run this through but would be an integration test
    // var eh = process
    // console.log(Object.keys(process))
    it("Process should be bundled and required when it is assigned to a variable", (done) => {
        getTestEnv({
            "index.js": `
                var eh = process;
                exports.eh = eh;
            `,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("./index");
            var supportedProcessProps = [
                'title', 'env', 'argv',
                'binding', 'cwd', 'chdir',
            ]
            supportedProcessProps.forEach(supported => {
                console.assert(result.eh.hasOwnProperty(supported) === true, `property exists: ${supported}`)
            })
            done();
        }).catch(done);
    });
})
