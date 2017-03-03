import { createEnv } from './stubs/TestEnvironment';
import { should } from "fuse-test-runner";


export class WildCardTest {
    "Should import 2 javascript files without ext"() {
        return createEnv({
            project: {
                files: {
                    "foo/a.ts": "module.exports = {a : 1}",
                    "foo/b.ts": "module.exports = {b : 1}",
                },
                instructions: "**/**.ts"
            }
        }).then((result) => {
            should(result.project.FuseBox.import("./foo/*"))
                .deepEqual({ 'foo/a.js': { a: 1 }, 'foo/b.js': { b: 1 } })
        });
    }


    "Should import 2 javascript files with ext"() {
        return createEnv({
            project: {
                files: {
                    "foo/a.ts": "module.exports = {a : 1}",
                    "foo/b.ts": "module.exports = {b : 1}",
                },
                instructions: "**/**.ts"
            }
        }).then((result) => {
            should(result.project.FuseBox.import("./foo/*.js"))
                .deepEqual({ 'foo/a.js': { a: 1 }, 'foo/b.js': { b: 1 } })
        });
    }


    "Should import 2 javascript files without ext and a mask"() {
        return createEnv({
            project: {
                files: {
                    "foo/a-comp.ts": "module.exports = {a : 1}",
                    "foo/b-comp.ts": "module.exports = {b : 1}",
                    "foo/c.ts": "module.exports = {c : 1}",
                },
                instructions: "**/**.ts"
            }
        }).then((result) => {
            should(result.project.FuseBox.import("./foo/*-comp"))
                .deepEqual({ 'foo/a-comp.js': { a: 1 }, 'foo/b-comp.js': { b: 1 } })
        });
    }

    "Should import 2 javascript files with ext and a mask"() {
        return createEnv({
            project: {
                files: {
                    "foo/a-comp.ts": "module.exports = {a : 1}",
                    "foo/b-comp.ts": "module.exports = {b : 1}",
                    "foo/c.ts": "module.exports = {c : 1}",
                },
                instructions: "**/**.ts"
            }
        }).then((result) => {
            should(result.project.FuseBox.import("./foo/*-comp.js"))
                .deepEqual({ 'foo/a-comp.js': { a: 1 }, 'foo/b-comp.js': { b: 1 } })
        });
    }

    // "Should import 2 json files with wild card"() {
    //     return createEnv({
    //         project: {
    //             files: {
    //                 "foo/a.json": "module.exports = {a : 1}",
    //                 "foo/b.json": "module.exports = {b : 1}"
    //             },
    //             instructions: "**/**.json"
    //         }
    //     }).then((result) => {
    //         console.log(result.project.FuseBox.import("./foo/*"));
    //         should(result.project.FuseBox.import("./foo/*"))
    //             .deepEqual({ 'foo/a.json': { a: 1 }, 'foo/b.json': { b: 1 } })
    //     });
    // }
}