import { should } from "fuse-test-runner";
import { createBundleAbstraction } from "./helper";


export class AbstractPackageTest {
    "Should inject a directory name"() {
        let app = createBundleAbstraction({})
        app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("foo", {}, function(___scope___) {
                ___scope___.file("hello/bar.js", function(exports, require, module, __filename, __dirname) {
                    console.log(__dirname);
                });
            });
        })();`)
        const defaultPackage = app.packageAbstractions.get("foo");
        const barFile = defaultPackage.fileAbstractions.get("hello/bar.js");

        should(barFile.generate()).findString('var __dirname = "hello";');
    }

    "Should inject a file name"() {
        let app = createBundleAbstraction({})
        app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("foo", {}, function(___scope___) {
                ___scope___.file("hello/bar.js", function(exports, require, module, __filename, __dirname) {
                    console.log(__filename);
                });
            });
        })();`)
        const defaultPackage = app.packageAbstractions.get("foo");
        const barFile = defaultPackage.fileAbstractions.get("hello/bar.js");

        should(barFile.generate()).findString('var __filename = "hello/bar.js";');
    }

    "Should inject both filename and dirname"() {
        let app = createBundleAbstraction({})
        app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("foo", {}, function(___scope___) {
                ___scope___.file("hello/bar.js", function(exports, require, module, __filename, __dirname) {
                    console.log(__filename);
                    console.log(__dirname);
                });
            });
        })();`)
        const defaultPackage = app.packageAbstractions.get("foo");
        const barFile = defaultPackage.fileAbstractions.get("hello/bar.js");
        const code = barFile.generate();
        should(code).findString('var __filename = "hello/bar.js";');
        should(code).findString('var __dirname = "hello";');
    }





}