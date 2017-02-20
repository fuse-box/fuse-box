const should = require('should');
const { CSSPlugin } = require(`../dist/commonjs/index.js`);
const path = require("path");
const { getTestEnv, createEnv } = require("./fixtures/lib.js")
const fs = require("fs");
const mkdirp = require("mkdirp");

const appRoot = require("app-root-path");


let tmp, shouldExistж

const makeTestFolder = () => {
    tmp = path.join(appRoot.path, ".fusebox", "css-test", new Date().getTime().toString());
    mkdirp(tmp);
    shouldExist = (name) => {
        const fname = path.join(tmp, name);;
        should.equal(fs.existsSync(fname), true);
        return fs.readFileSync(fname).toString();
    }
}


describe('CSSPlugins ', () => {


    it("Should require and inline a simple CSS File", (done) => {
        makeTestFolder();

        createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./main.css") }`,
                    "main.css": "body {}"
                },
                plugins: [CSSPlugin()],
                instructions: "> index.ts"
            }
        }).then((result) => {
            const js = result.projectContents.toString();
            should.equal(
                js.indexOf(`__fsbx_css("main.css", "body {}")`) > -1, true);
            done();
        }).catch(done)
    });

    it("Should require and create a simple CSS File", (done) => {
        makeTestFolder();

        createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./main.css") }`,
                    "main.css": "body {}"
                },
                plugins: [
                    CSSPlugin({
                        outFile: (file) => `${tmp}/${file}`
                    })
                ],
                instructions: "> index.ts"
            }
        }).then((result) => {
            const js = result.projectContents.toString();
            shouldExist("main.css");
            should.equal(
                js.indexOf(`__fsbx_css("main.css");`) > -1, true);
            done();
        }).catch(done)
    });


    it("Should create a CSS File but not inject it", (done) => {
        makeTestFolder();
        createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./main.css") }`,
                    "main.css": "h1 {}"
                },
                plugins: [
                    CSSPlugin({
                        outFile: (file) => `${tmp}/${file}`,
                        inject: false
                    })
                ],
                instructions: "> index.ts"
            }
        }).then((result) => {
            const js = result.projectContents.toString();
            shouldExist("main.css");
            should.equal(
                js.indexOf(`__fsbx_css("main.css");`) === -1, true);
            done();
        }).catch(done)
    });

    it("Should create a CSS File and inject it with inject:true", (done) => {
        makeTestFolder();
        createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./main.css") }`,
                    "main.css": "h1 {}"
                },
                plugins: [
                    CSSPlugin({
                        outFile: (file) => `${tmp}/${file}`,
                        inject: true
                    })
                ],
                instructions: "> index.ts"
            }
        }).then((result) => {
            const js = result.projectContents.toString();
            shouldExist("main.css");
            should.equal(
                js.indexOf(`__fsbx_css("main.css");`) > -1, true);
            done();
        }).catch(done)
    });

    it("Should create a CSS File with a custom injector", (done) => {
        makeTestFolder();
        createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./main.css") }`,
                    "main.css": "h1 {}"
                },
                plugins: [
                    CSSPlugin({
                        outFile: (file) => `${tmp}/${file}`,
                        inject: (file) => `custom/${file}`
                    })
                ],
                instructions: "> index.ts"
            }
        }).then((result) => {
            const js = result.projectContents.toString();
            shouldExist("main.css");
            should.equal(
                js.indexOf(`__fsbx_css("custom/main.css");`) > -1, true);
            done();
        }).catch(done)
    });

    it("Should bundle and inline 2 CSS files into one", (done) => {
        makeTestFolder();

        createEnv({
            project: {
                files: {
                    "index.ts": `require("./a.css"); require("./b.css") }`,
                    "a.css": "body {};",
                    "b.css": "h1 {};"
                },
                plugins: [CSSPlugin({ bundle: "app.css" })],
                instructions: "> index.ts"
            }
        }).then((result) => {
            const js = result.projectContents.toString();
            should.equal(
                js.indexOf(`__fsbx_css("app.css", "body {};\\nh1 {};");`) > -1, true);
            done();

        }).catch(done)
    });


    it("Should bundle and write 2 CSS files into one", (done) => {
        makeTestFolder();

        createEnv({
            project: {
                files: {
                    "index.ts": `require("./a.css"); require("./b.css") }`,
                    "a.css": "body {};",
                    "b.css": "h1 {};"
                },
                plugins: [CSSPlugin({ bundle: "app.css", outFile: `${tmp}/app.css` })],
                instructions: "> index.ts"
            }
        }).then((result) => {
            const js = result.projectContents.toString();
            const contents = shouldExist("app.css");
            contents.should.equal(`body {};
h1 {};
/*# sourceMappingURL=app.css.map */`)

            shouldExist("app.css.map")
            should.equal(
                js.indexOf(`__fsbx_css("app.css");`) > -1, true);
            done();

        }).catch(done)
    });

    it("Should bundle and write 2 CSS files into one but not inject it", (done) => {
        makeTestFolder();

        createEnv({
            project: {
                files: {
                    "index.ts": `require("./a.css"); require("./b.css") }`,
                    "a.css": "body {};",
                    "b.css": "h1 {};"
                },
                plugins: [CSSPlugin({ bundle: "app.css", outFile: `${tmp}/app.css`, inject: false })],
                instructions: "> index.ts"
            }
        }).then((result) => {
            const js = result.projectContents.toString();
            const contents = shouldExist("app.css");
            should.equal(
                js.indexOf(`__fsbx_css("app.css");`) == -1, true);
            done();

        }).catch(done)
    });

    it("Should bundle and write 2 CSS files into one and inject with a custom injector", (done) => {
        makeTestFolder();

        createEnv({
            project: {
                files: {
                    "index.ts": `require("./a.css"); require("./b.css") }`,
                    "a.css": "body {};",
                    "b.css": "h1 {};"
                },
                plugins: [
                    CSSPlugin({
                        bundle: "app.css",
                        outFile: `${tmp}/app.css`,
                        inject: (file) => `custom/${file}`
                    })
                ],
                instructions: "> index.ts"
            }
        }).then((result) => {
            const js = result.projectContents.toString();
            const contents = shouldExist("app.css");
            should.equal(
                js.indexOf(`__fsbx_css("custom/app.css");`) > -1, true);
            done();

        }).catch(done)
    });


});