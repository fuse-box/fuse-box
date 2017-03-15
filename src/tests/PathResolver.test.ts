import {createEnv} from "./stubs/TestEnvironment";
import {should} from "fuse-test-runner";

export class PathResolverTest {
    "Should Add .js (file)"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `module.exports = require("./foo/hello");`,
                    "foo/hello.js": "module.exports = {ok : 1 }",
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.FuseBox.import("./index");
            should(out).deepEqual({ok: 1});
        });
    }
}

// describe("Path resolver", (done) => {
//
//     it("Add .js (file)", (done) => {
//         getTestEnv({
//             "index.js": `module.exports = require("./foo/hello");`,
//             "foo/hello.js": "module.exports = {ok : 1 }",
//         }, "**/*.js").then(root => {
//             const res = root.FuseBox.import("./index");
//             res.should.deepEqual({ ok: 1 });
//             done();
//         }).catch(done);
//     });
//
//     it("Add .ts (file)", (done) => {
//         getTestEnv({
//             "index.ts": `module.exports = require("./foo/hello");`,
//             "foo/hello.ts": "module.exports = {ok : 1 }",
//         }, "index.ts").then(root => {
//             const res = root.FuseBox.import("./index");
//             res.should.deepEqual({ ok: 1 });
//             done();
//         }).catch(done);
//     });
//
//     it("Find .tsx (file)", (done) => {
//         getTestEnv({
//             "index.ts": `module.exports = require("./foo/hello");`,
//             "foo/hello.tsx": "module.exports = {ok : 1 }",
//         }, "index.ts").then(root => {
//             const res = root.FuseBox.import("./index");
//             res.should.deepEqual({ ok: 1 });
//             done();
//         }).catch(done);
//     });
//     // FOLDERS
//
//     it("Add .js (folder)", (done) => {
//         getTestEnv({
//             "index.js": `module.exports = require("./foo/hello");`,
//             "foo/hello/index.js": "module.exports = {ok : 1 }",
//         }, "**/*.js").then(root => {
//             const res = root.FuseBox.import("./index");
//             res.should.deepEqual({ ok: 1 });
//             done();
//         }).catch(done);
//     });
//
//     it("Add .ts (folder)", (done) => {
//         getTestEnv({
//             "index.ts": `module.exports = require("./foo/hello");`,
//             "foo/hello/index.ts": "module.exports = {ok : 1 }",
//         }, "index.ts").then(root => {
//             const res = root.FuseBox.import("./index");
//             res.should.deepEqual({ ok: 1 });
//             done();
//         }).catch(done);
//     });
//
//     it("Find .tsx (folder)", (done) => {
//         getTestEnv({
//             "index.ts": `module.exports = require("./foo/hello");`,
//             "foo/hello/index.tsx": "module.exports = {ok : 1 }",
//         }, "index.ts").then(root => {
//             const res = root.FuseBox.import("./index");
//             res.should.deepEqual({ ok: 1 });
//             done();
//         }).catch(done);
//     });
//
// });
