import { should } from "fuse-test-runner";
import { createBundleAbstraction } from "./helper";


export class AbstractPackageTest {
    "Should register an entry point"() {
        let app = createBundleAbstraction({})
        app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("foo", {}, function(___scope___) {
                ___scope___.file("bar.js", function(exports, require, module, __filename, __dirname) {
                    require("./hello.js");
                });
                return ___scope___.entry = "bar.js";
            });
        })();`)
        const defaultPackage = app.packageAbstractions.get("foo")
        should(defaultPackage).beOkay();
    }

    "Should have correct structure"() {
        let app = createBundleAbstraction({})
        app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("default", {}, function(___scope___) {
                ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {
                    require("./hello.js");
                });
                ___scope___.file("hello.js", function(exports, require, module, __filename, __dirname) {
                });
            });
        })();`)
        const defaultPackage = app.packageAbstractions.get("default")
        should(defaultPackage).beOkay();
        should(defaultPackage.fileAbstractions.get("hello.js")).beOkay();
        should(defaultPackage.fileAbstractions.get("index.js")).beOkay();
    }

    "Should resolve a file within the same package"() {
        let app = createBundleAbstraction({})
        app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("default", {}, function(___scope___) {
                ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {
                    require("./hello.js");
                });
                ___scope___.file("hello.js", function(exports, require, module, __filename, __dirname) {
                    console.log("i am hello");
                });
            });
        })();`)
        const defaultPackage = app.packageAbstractions.get("default")
        const indexFile = defaultPackage.fileAbstractions.get("index.js");
        const helloStatement = indexFile.findRequireStatements(/hello/)[0];
        const helloFile = helloStatement.resolve();

        should(helloFile.generate()).equal("function(){\nconsole.log('i am hello');\n}");
    }

    "Should resolve a file within the same package (package fusing)"() {
        let app = createBundleAbstraction({})
        app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("default", {}, function(___scope___) {
                ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {
                    require("./hello.js");
                });

            });

            FuseBox.pkg("default", {}, function(___scope___) {
                ___scope___.file("hello.js", function(exports, require, module, __filename, __dirname) {
                    console.log("i am hello");
                });
            });

        })();`)
        const defaultPackage = app.packageAbstractions.get("default")
        const indexFile = defaultPackage.fileAbstractions.get("index.js");
        const helloStatement = indexFile.findRequireStatements(/hello/)[0];
        const helloFile = helloStatement.resolve();
        // resolves and finds a AbstractFile and generates the code
        should(helloFile.generate()).equal("function(){\nconsole.log('i am hello');\n}");
    }
}