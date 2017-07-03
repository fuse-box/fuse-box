import { createEnv } from "./stubs/TestEnvironment";
import { should } from "fuse-test-runner";
import { JSONPlugin } from "../index";

export class HeavyNodeModules {
    "Should bundle cheerio"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
                         var cheerio = require("cheerio");
                        let $ = cheerio.load('<h2 class="title">Hello world</h2>')
                        $('h2.title').text('Hello there!')
                        $('h2').addClass('welcome')
                        exports.str = $.html();
                    
                    `
                },
                plugins: [JSONPlugin()],
                instructions: "index.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({ str: "<h2 class=\"title welcome\">Hello there!</h2>" });
        });
    }

    "Should bundle babel-generator"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
                        var generator = require('babel-generator');
                        exports.data = generator;
                    
                    `
                },
                plugins: [JSONPlugin()],
                instructions: "index.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out.data.CodeGenerator).beOkay();
        });
    }

    "Should partially require problematic module from core-js"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
                        exports.data = require("core-js/library/fn/symbol");
                    `
                },
                plugins: [JSONPlugin()],
                instructions: "index.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out.data.keyFor).beOkay();
        });
    }

    "Should bundle core-js"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
                       exports.data = require("core-js");
                    `
                },
                plugins: [JSONPlugin()],
                instructions: "index.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out.data.version).beOkay();
        });
    }

    // "Should bundle babylon"() {
    //     return createEnv({
    //         project: {
    //             files: {
    //                 "index.js": `
    //                    var generator = require('babel-generator')
    //                     var babylon = require('babylon')
    //                     const code = 'class Example {}';
    //                     const ast = babylon.parse(code);

    //                     exports.test = generator.default(ast, {}, code);
    //                 `
    //             },
    //             plugins: [JSONPlugin()],
    //             instructions: "index.js",
    //         },
    //     }).then((result) => {
    //         const out = result.project.FuseBox.import("./index");
    //         should(out.test.code).equal("class Example {}");
    //     });
    // }
}