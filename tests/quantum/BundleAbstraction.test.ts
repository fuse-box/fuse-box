import { createBundleAbstraction } from "./helper";

describe("AbstractPackageTest", () => {
	it("Should register an entry point", () => {
		let app = createBundleAbstraction({});
		app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("foo", {}, function(___scope___) {
                ___scope___.file("bar.js", function(exports, require, module, __filename, __dirname) {
                    require("./hello.js");
                });
                return ___scope___.entry = "bar.js";
            });
        })();`);
		const defaultPackage = app.packageAbstractions.get("foo");
		expect(defaultPackage).toBeTruthy();
	});

	it("Should have correct structure", () => {
		let app = createBundleAbstraction({});
		app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("default", {}, function(___scope___) {
                ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {
                    require("./hello.js");
                });
                ___scope___.file("hello.js", function(exports, require, module, __filename, __dirname) {
                });
            });
        })();`);
		const defaultPackage = app.packageAbstractions.get("default");
		expect(defaultPackage).toBeTruthy();
		expect(defaultPackage.fileAbstractions.get("hello.js")).toBeTruthy();
		expect(defaultPackage.fileAbstractions.get("index.js")).toBeTruthy();
	});

	it("Should resolve a file within the same package", async () => {
		let app = createBundleAbstraction({});
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
        })();`);
		const defaultPackage = app.packageAbstractions.get("default");
		const indexFile = defaultPackage.fileAbstractions.get("index.js");
		const helloStatement = indexFile.findRequireStatements(/hello/)[0];
		const helloFile = helloStatement.resolve();

		expect(await helloFile.getGeneratedCode()).toEqual("function(){\nconsole.log('i am hello');\n}");
	});

	it("Should resolve a file within the same package (package fusing)", async () => {
		let app = createBundleAbstraction({});
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

        })();`);
		const defaultPackage = app.packageAbstractions.get("default");
		const indexFile = defaultPackage.fileAbstractions.get("index.js");
		const helloStatement = indexFile.findRequireStatements(/hello/)[0];
		const helloFile = helloStatement.resolve();
		// resolves and finds a AbstractFile and generates the code
		expect(await helloFile.getGeneratedCode()).toEqual("function(){\nconsole.log('i am hello');\n}");
	});
});
