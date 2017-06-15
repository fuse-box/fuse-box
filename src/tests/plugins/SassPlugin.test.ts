import { createEnv } from "./../stubs/TestEnvironment";
import { CSSPlugin } from "../../plugins/stylesheet/CSSplugin";
import { should } from "fuse-test-runner";
import { SassPlugin } from "../../plugins/stylesheet/SassPlugin";
import { Config } from "../../Config";
import * as fs from "fs";
import * as path from "path";
export class CssPluginTest {

    "Should import reset.css"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./a.scss") }`,
                    "a.scss": `
                        @import 'reset';
                        body { font-size:12px }
                        
                    `,
                    "reset.scss": "h1 { color:red}",
                },
                plugins: [
                    [SassPlugin(), CSSPlugin()],
                ],
                instructions: "index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();

            should(js).findString(`color: red`).findString("font-size: 12px");
        });
    }

    "Should compile with $homeDir macro"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./a.scss") }`,
                    "a.scss": `
                        @import '$homeDir/b.scss';

                        body { font-size:12px }

                    `,
                    "b.scss": "h1 { color:red}",
                },
                plugins: [
                    [SassPlugin({ importer: true }), CSSPlugin()],
                ],
                instructions: "index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            should(js).findString(`color: red`).findString("font-size: 12px");
        });
    }

    "Should compile with $appRoot macro"() {

        fs.writeFileSync(path.join(Config.TEMP_FOLDER, "test.scss"), "h1 {color: pink}");
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./a.scss") }`,
                    "a.scss": `
                        @import '$appRoot/.fusebox/test.scss';


                        body { font-size:12px }
                    `,

                },
                plugins: [
                    [SassPlugin({ importer: true }), CSSPlugin()],
                ],
                instructions: "index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            should(js).findString(`color: pink`).findString("font-size: 12px");
        });
    }

    "Should compile with custom $hello"() {

        fs.writeFileSync(path.join(Config.TEMP_FOLDER, "test2.scss"), "h1 {color: purple}");
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./a.scss") }`,
                    "a.scss": `
                        @import '$hello/test2.scss';


                        body { font-size:12px }
                    `,

                },
                plugins: [
                    [SassPlugin({
                        importer: true,
                        macros: {
                            "$hello": Config.TEMP_FOLDER + "/",
                        },
                    }), CSSPlugin()],
                ],
                instructions: "index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            should(js).findString(`color: purple`).findString("font-size: 12px");
        });
    }

    "Should be able to override $homeDir"() {

        fs.writeFileSync(path.join(Config.TEMP_FOLDER, "test3.scss"), "h1 {color: purple}");
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./a.scss") }`,
                    "a.scss": `
                        @import '$homeDir/test3.scss';


                        body { font-size:12px }
                    `,

                },
                plugins: [
                    [SassPlugin({
                        importer: true,
                        macros: {
                            "$homeDir": Config.TEMP_FOLDER + "/",
                        },
                    }), CSSPlugin()],
                ],
                instructions: "index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();
            should(js).findString(`color: purple`).findString("font-size: 12px");
        });
    }

    "Should compile with custom functions"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./a.scss") }`,
                    "a.scss": `
                        .foo { font-size: foo(1); } 
                        .bar { font-size: bar(2, 2); }
                    `,
                },
                plugins: [
                    [SassPlugin({
                        functions: {
                            "foo($a)": (a) => {
                                a.setUnit("rem");
                                return a;
                            },
                            "bar($a,$b)": (a, b) => {
                                a.setValue(a.getValue() * b.getValue());
                                a.setUnit("rem");
                                return a;
                            }
                        }
                    }), CSSPlugin()],
                ],
                instructions: "index.ts",
            },
        }).then((result) => {
            const js = result.projectContents.toString();

            should(js).findString(`font-size: 1rem;`).findString(`font-size: 4rem;`);
        });
    }

}
