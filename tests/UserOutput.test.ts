import * as fs from "fs";
import { UserOutput } from "../src/core/UserOutput";
import { WorkFlowContext } from "../src";
import { ensureFuseBoxPath } from "../src/Utils";

const testDir = ".fusebox/test-dir/$name.js";
const foobarHash = "f0290b6d";
describe("UserOutputTest", () => {
	it("Should construct an output", () => {
		let output = new UserOutput(new WorkFlowContext(), testDir);
		expect(output.original).toEqual(testDir);
	});

	it("Should replace with $name if not set", () => {
		let output = new UserOutput(new WorkFlowContext(), ".fusebox/test-dir/hello.js");
		expect(output.original).toEqual(".fusebox/test-dir/$name");
		expect(output.filename).toEqual("hello.js");
	});

	it("Folder should be created", () => {
		let output = new UserOutput(new WorkFlowContext(), testDir);
		expect(fs.existsSync(output.dir)).toBeTruthy();
	});

	it("Check template", () => {
		let output = new UserOutput(new WorkFlowContext(), testDir);
		expect(output.template).toEqual("$name.js");
	});

	it("Should generate hash", () => {
		let output = new UserOutput(new WorkFlowContext(), testDir);
		expect(output.generateHash("foobar")).toEqual(foobarHash);
	});

	it("Should pass with hash true", () => {
		let context = new WorkFlowContext();
		context.hash = true;
		new UserOutput(new WorkFlowContext(), testDir);
	});

	it("Should pass with hash option md5", () => {
		let context = new WorkFlowContext();
		context.hash = "md5";
		new UserOutput(new WorkFlowContext(), testDir);
	});

	it("Should not pass with other hash option", () => {
		let context = new WorkFlowContext();
		context.hash = "md4";
		expect(() => {
			new UserOutput(context, testDir);
		}).toThrowError();
	});

	it("Should give a simple path", () => {
		let output = new UserOutput(new WorkFlowContext(), testDir);
		let result = output.getPath("bundle");
		expect(
			ensureFuseBoxPath(result), // fixing slashes for windows
		).toContain("/.fusebox/test-dir/bundle.js");
	});

	it("Should give a simple path without ext", () => {
		let output = new UserOutput(new WorkFlowContext(), ".fusebox/test-dir/$name");
		let result = output.getPath("bundle");
		expect(
			ensureFuseBoxPath(result), // fixing slashes for windows
		).toMatch(/\/\.fusebox\/test-dir\/bundle$/);
	});

	it("Should omit extension if given by user", () => {
		let output = new UserOutput(new WorkFlowContext(), testDir);
		let result = output.getPath("bundle.html");
		expect(
			ensureFuseBoxPath(result), // fixing slashes for windows
		).toMatch(/\/\.fusebox\/test-dir\/bundle\.html$/);
	});

	it("Should give a simple path + hash defined", () => {
		let output = new UserOutput(new WorkFlowContext(), testDir);
		let result = output.getPath("bundle", "123");
		expect(
			ensureFuseBoxPath(result), // fixing slashes for windows
		).toContain("/.fusebox/test-dir/123-bundle.js");
	});

	it("Should give a simple path + hash defined in template", () => {
		let output = new UserOutput(new WorkFlowContext(), ".fusebox/test-dir/$name__$hash.js");
		let result = output.getPath("bundle", "123");
		expect(
			ensureFuseBoxPath(result), // fixing slashes for windows
		).toContain("/.fusebox/test-dir/bundle__123.js");
	});

	it("Should give a simple path + hash defined in template but not given", () => {
		let output = new UserOutput(new WorkFlowContext(), ".fusebox/test-dir/$name__$hash.js");
		let result = output.getPath("bundle");
		expect(
			ensureFuseBoxPath(result), // fixing slashes for windows
		).toContain("/.fusebox/test-dir/bundle.js");
	});

	it("Should give a path with directory", () => {
		let output = new UserOutput(new WorkFlowContext(), testDir);
		let result = output.getPath("hello/bundle");
		expect(
			ensureFuseBoxPath(result), // fixing slashes for windows
		).toContain("/.fusebox/test-dir/hello/bundle.js");
	});

	it("Should give a path with directory + hash", () => {
		let output = new UserOutput(new WorkFlowContext(), testDir);
		let result = output.getPath("hello/bundle", "456");
		expect(
			ensureFuseBoxPath(result), // fixing slashes for windows
		).toContain("/.fusebox/test-dir/hello/456-bundle.js");
	});

	it("Should give a path with directory with a different template", () => {
		let output = new UserOutput(new WorkFlowContext(), ".fusebox/test-dir/foo-$name.js");
		let result = output.getPath("hello/bundle");
		expect(
			ensureFuseBoxPath(result), // fixing slashes for windows
		).toContain("/.fusebox/test-dir/hello/foo-bundle.js");
	});

	it("Should write a file without hash", () => {
		let output = new UserOutput(new WorkFlowContext(), testDir);
		const testContents = `hello-${new Date().getTime()}`;

		let file = output.write("foo", testContents);
		return file.then(result => {
			let name = ensureFuseBoxPath(result.path); // fixing slashes for windows
			expect(name).toContain(".fusebox/test-dir/foo.js");
			expect(fs.readFileSync(name).toString()).toEqual(testContents);
		});
	});

	it("Should write a file with hash", () => {
		const context = new WorkFlowContext();
		context.hash = true;
		let output = new UserOutput(context, testDir);
		const testContents = `foobar`;
		return output.write("myFile", testContents).then(result => {
			let file = ensureFuseBoxPath(result.path); // fixing slashes for windows
			expect(file).toContain(`.fusebox/test-dir/${foobarHash}-myFile.js`);
			expect(fs.readFileSync(file).toString()).toEqual(testContents);
		});
	});

	it("Should write a file with hash and custom template", () => {
		const context = new WorkFlowContext();
		context.hash = true;
		let output = new UserOutput(context, ".fusebox/test-dir/$name_____$hash___.js");
		const testContents = `foobar`;
		return output.write("myFile", testContents).then(result => {
			let file = ensureFuseBoxPath(result.path); // fixing slashes for windows
			expect(file).toContain(`.fusebox/test-dir/myFile_____${foobarHash}___.js`);
			expect(fs.readFileSync(file).toString()).toEqual(testContents);
		});
	});
});
