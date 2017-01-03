const should = require("should");
const env = require("./fixtures/lib.js").getNodeEnv;

describe("Node modules and exports", (done) => {

    it("Fusebox should be exposed", (done) => {
        env({
            log: false,
            cache: false,
            files: {
                "index.js": `require("./foo/bar.js");`,
                "foo/bar.js": "module.exports = {bar : 1}",
            }
        }, "> index.js").then(data => {

            data.FuseBox.should.be.ok;
            done();
        }).catch(done);
    });

    it("Should expose a default library", (done) => {
        env({
            log: false,
            cache: false,
            globals: { default: "myLib" },
            files: {
                "index.js": `module.exports = {hello : "world"}`
            }
        }, "> index.js").then(data => {
            data.myLib.should.be.ok;
            data.myLib.hello.should.equal("world")
            done();
        }).catch(done);
    });

    it("Should expose an external lib", (done) => {
        env({
            log: false,
            cache: false,
            globals: { default: "myLib", "wires-reactive": "reactive" },
            files: {
                "index.js": `var wiresReactive = require("wires-reactive");
                     module.exports = {hello : "world"}; `
            }
        }, "> index.js").then(data => {
            data.myLib.should.be.ok;
            data.myLib.hello.should.equal("world")
            data.reactive.Watch.should.be.ok;
            done();
        }).catch(done);
    });


    it("Node library 'net' should be found", (done) => {
        env({
            log: false,
            cache: false,
            globals: { default: "myLib" },
            files: {
                "index.js": `module.exports = require("net")`
            }
        }, "> index.js").then(data => {
            data.myLib.connect.should.be.ok;
            done();
        }).catch(done);
    });

    it("Node library 'http' should be ok", (done) => {
        env({
            log: false,
            cache: false,
            globals: { default: "myLib" },
            files: {
                "index.js": `module.exports = require("http")`
            }
        }, "> index.js").then(data => {
            data.myLib.request.should.be.ok;
            done();
        }).catch(done);
    });

    it("Node library 'fs' should be ok", (done) => {
        env({
            log: false,
            cache: false,
            globals: { default: "myLib" },
            files: {
                "index.js": `module.exports = require("fs")`
            }
        }, "> index.js").then(data => {

            data.myLib.createWriteStream.should.be.ok;
            done();
        }).catch(done);
    });

    it("Node library 'module' should be ok", (done) => {
        env({
            log: false,
            cache: false,
            globals: { default: "myLib" },
            files: {
                "index.js": `module.exports = require("module")`
            }
        }, "> index.js").then(data => {

            data.myLib._load.should.be.ok;
            done();
        }).catch(done);
    });


    it("Node library 'events' should be ok", (done) => {
        env({
            log: false,
            cache: false,
            globals: { default: "myLib" },
            files: {
                "index.js": `module.exports = require("events")`
            }
        }, "> index.js").then(data => {
            data.myLib.EventEmitter.should.be.ok;
            done();
        }).catch(done);
    });

    it("Node library 'process' should be ok", (done) => {
        env({
            log: false,
            cache: false,
            globals: { default: "myLib" },
            files: {
                "index.js": `module.exports = require("process")`
            }
        }, "> index.js").then(data => {
            data.myLib.env.should.be.ok;
            done();
        }).catch(done);
    });

    it("Node library 'stream' should be ok", (done) => {
        env({
            log: false,
            cache: false,
            globals: { default: "myLib" },
            files: {
                "index.js": `module.exports = require("stream")`
            }
        }, "> index.js").then(data => {
            //console.log(data.myLib);
            data.myLib.Stream.should.be.ok;
            done();
        }).catch(done);
    });

    it("Node library 'url' should be ok", (done) => {
        env({
            log: false,
            cache: false,
            globals: { default: "myLib" },
            files: {
                "index.js": `module.exports = require("url")`
            }
        }, "> index.js").then(data => {
            data.myLib.Url.should.be.ok;
            done();
        }).catch(done);
    });

})