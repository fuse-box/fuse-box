import { createBundleAbstraction } from "./helper";

describe("AbstractPackageTest", () => {
	it("Should inject a directory name", async () => {
		let app = createBundleAbstraction({});
		app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("foo", {}, function(___scope___) {
                ___scope___.file("hello/bar.js", function(exports, require, module, __filename, __dirname) {
                    console.log(__dirname);
                });
            });
        })();`);
		const defaultPackage = app.packageAbstractions.get("foo");
		const barFile = defaultPackage.fileAbstractions.get("hello/bar.js");

		expect((await barFile.getGeneratedCode()).toString()).toContain('var __dirname = "hello";');
	});

	it("Should inject a file name", async () => {
		let app = createBundleAbstraction({});
		app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("foo", {}, function(___scope___) {
                ___scope___.file("hello/bar.js", function(exports, require, module, __filename, __dirname) {
                    console.log(__filename);
                });
            });
        })();`);
		const defaultPackage = app.packageAbstractions.get("foo");
		const barFile = defaultPackage.fileAbstractions.get("hello/bar.js");

		expect((await barFile.getGeneratedCode()).toString()).toContain('var __filename = "hello/bar.js";');
	});

	it("Should inject both filename and dirname", async () => {
		let app = createBundleAbstraction({});
		app.parse(`
        (function(FuseBox) {
            FuseBox.pkg("foo", {}, function(___scope___) {
                ___scope___.file("hello/bar.js", function(exports, require, module, __filename, __dirname) {
                    console.log(__filename);
                    console.log(__dirname);
                });
            });
        })();`);
		const defaultPackage = app.packageAbstractions.get("foo");
		const barFile = defaultPackage.fileAbstractions.get("hello/bar.js");
		const code = (await barFile.getGeneratedCode()).toString();
		expect(code).toContain('var __filename = "hello/bar.js";');
		expect(code).toContain('var __dirname = "hello";');
	});
});
