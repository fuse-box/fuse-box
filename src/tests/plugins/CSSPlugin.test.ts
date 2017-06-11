import { createEnv } from "./../stubs/TestEnvironment";
import { should } from "fuse-test-runner";
import * as path from "path";
import * as appRoot from "app-root-path";
import * as fs from "fs";
import { CSSResourcePlugin } from "../../plugins/stylesheet/CSSResourcePlugin";
import { SassPlugin } from "../../plugins/stylesheet/SassPlugin";
import { CSSPlugin } from "../../plugins/stylesheet/CSSplugin";
import * as fsExtra from "fs-extra";

let tmp, shouldExist;

const makeTestFolder = () => {
    tmp = path.join(appRoot.path, ".fusebox", "css-test", new Date().getTime().toString());
    fsExtra.ensureDirSync(tmp);
    shouldExist = (name) => {
        const fname = path.join(tmp, name);;
        should(fs.existsSync(fname)).equal(true);
        return fs.readFileSync(fname).toString();
    };
};

export class CssPluginTest {
    "Should require and inline a simple CSS File"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./main.css") }`,
                    "main.css": "body {}",
                },
                plugins: [CSSPlugin()],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            should(js).findString(`require("fuse-box-css")("main.css", "body {}")`);
        });
    }

    "Should require and create a simple CSS File"() {
        makeTestFolder();
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./main.css") }`,
                    "main.css": "body {}",
                },
                plugins: [
                    CSSPlugin({
                        outFile: (file) => `${tmp}/${file}`,
                    }),
                ],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            shouldExist("main.css");
            should(js).findString(`require("fuse-box-css")("main.css");`);
        });
    }

    "Should create a CSS File but not inject it"() {
        makeTestFolder();
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./main.css") }`,
                    "main.css": "h1 {}",
                },
                plugins: [
                    CSSPlugin({
                        outFile: (file) => `${tmp}/${file}`,
                        inject: false,
                    }),
                ],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            shouldExist("main.css");
            should(js).notFindString(`require("fuse-box-css")("main.css");`);
        });
    }

    "Should create a CSS File and inject it with inject:true"() {
        makeTestFolder();
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./main.css") }`,
                    "main.css": "h1 {}",
                },
                plugins: [
                    CSSPlugin({
                        outFile: (file) => `${tmp}/${file}`,
                        inject: true,
                    }),
                ],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            shouldExist("main.css");
            should(js).findString(`require("fuse-box-css")("main.css");`);
        });
    }

    "Should create a CSS File with a custom injector"() {
        makeTestFolder();
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./main.css") }`,
                    "main.css": "h1 {}",
                },
                plugins: [
                    CSSPlugin({
                        outFile: (file) => `${tmp}/${file}`,
                        inject: (file) => `custom/${file}`,
                    }),
                ],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            shouldExist("main.css");
            should(js).findString(`require("fuse-box-css")("custom/main.css");`);
        });
    }

    "Should bundle and inline 2 CSS files into one"() {
        makeTestFolder();
        return createEnv({
            project: {
                files: {
                    "index.ts": `require("./a.css"); require("./b.css") }`,
                    "a.css": "body {};",
                    "b.css": "h1 {};",
                },
                plugins: [CSSPlugin({ group: "app.css" })],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            should(js).findString(`require("fuse-box-css")("app.css", "body {};\\nh1 {};");`);
        });
    }

    "Should bundle and write 2 CSS files into one"() {
        makeTestFolder();

        return createEnv({
            project: {
                files: {
                    "index.ts": `require("./a.css"); require("./b.css") }`,
                    "a.css": "body {};",
                    "b.css": "h1 {};",
                },
                plugins: [CSSPlugin({ group: "app.css", outFile: `${tmp}/app.css` })],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            const contents = shouldExist("app.css");
            should(contents)
                .findString("body {};")
                .findString("h1 {};")
                .findString("/*# sourceMappingURL=app.css.map */")

            shouldExist("app.css.map");
            should(js).findString(`require("fuse-box-css")("app.css");`);
        });
    }

    "Should bundle and write 2 CSS files into one but not inject it"() {
        makeTestFolder();

        return createEnv({
            project: {
                files: {
                    "index.ts": `require("./a.css"); require("./b.css") }`,
                    "a.css": "body {};",
                    "b.css": "h1 {};",
                },
                plugins: [CSSPlugin({ group: "app.css", outFile: `${tmp}/app.css`, inject: false })],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            shouldExist("app.css");
            should(js).notFindString(`require("fuse-box-css")("app.css");`);
        });
    }

    "Should bundle and write 2 CSS files into one and inject with a custom injector"() {
        makeTestFolder();

        return createEnv({
            project: {
                files: {
                    "index.ts": `require("./a.css"); require("./b.css") }`,
                    "a.css": "body {};",
                    "b.css": "h1 {};",
                },
                plugins: [
                    CSSPlugin({
                        group: "app.css",
                        outFile: `${tmp}/app.css`,
                        inject: (file) => `custom/${file}`,
                    }),
                ],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            shouldExist("app.css");
            should(js).findString(`require("fuse-box-css")("custom/app.css");`);
        });
    }

    "A simple case should with the the CSSResourcePlugin"() {
        makeTestFolder();
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./main.css") }`,
                    "main.css": "body {}",
                },
                plugins: [
                    [CSSResourcePlugin({ inline: true }), CSSPlugin()],
                ],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            should(js).findString(`require("fuse-box-css")("main.css", "body {}")`);
        });
    }
    // failing here....
    "Should with the SassPlugin"() {
        makeTestFolder();

        return createEnv({
            project: {
                files: {
                    "index.ts": `require("./a.scss"); require("./b.scss") }`,
                    "a.scss": "body {color:red};",
                    "b.scss": "h1 {color:red};",
                },
                plugins: [
                    [SassPlugin(), CSSPlugin({ group: `all.css` })],
                ],
                instructions: "> index.ts",
            },
        }).then((result) => {

            const js = result.projectContents.toString();
            should(js).findString(`require("fuse-box-css")("all.css", "`);
        });
    }

    "Should with the SassPlugin + CSSResourcePlugin"() {
        makeTestFolder();
        return createEnv({
            project: {
                files: {
                    "index.ts": `require("./a.scss"); require("./b.scss") }`,
                    "a.scss": "body {color:red};",
                    "b.scss": "h1 {color:red};",
                },
                plugins: [
                    [SassPlugin(), CSSResourcePlugin({ inline: true }), CSSPlugin({ group: `all.css` })],
                ],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            should(js).findString(`require("fuse-box-css")("all.css", "`);
        });
    }
}
