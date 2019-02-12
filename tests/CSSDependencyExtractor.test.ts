import * as path from "path";
import * as appRoot from "app-root-path";
import { CSSDependencyExtractor } from "../src/lib/CSSDependencyExtractor";

const stubs = path.join(appRoot.path, "tests/_helpers/stubs/css/path1");
const nestedStubs = path.join(appRoot.path, "tests/_helpers/stubs/css/nested");

describe("DependencyExtractorTest", () => {
	it("Should extract", () => {
		let extractor = CSSDependencyExtractor.init({
			paths: [stubs],
			extensions: ["scss"],
			content: `
            @import "hello";
            body {
                background-color: blue;
            }
            `,
		});
		let deps = extractor.getDependencies();
		let expected = [
			"tests/_helpers/stubs/css/path1/foo.scss",
			"tests/_helpers/stubs/css/path1/woo.scss",
			"tests/_helpers/stubs/css/path1/hello.scss",
		].map(path.normalize);
		deps.forEach((dep, index) => {
			expect(dep).toContain(expected[index]);
		});
	});

	it("Should extract with slashes if sass or scss is included", () => {
		let extractor = CSSDependencyExtractor.init({
			paths: [stubs],
			extensions: ["scss"],
			sassStyle: true,
			content: `
            @import "underscore";
            body {
                background-color: blue;
            }
            `,
		});
		let deps = extractor.getDependencies();
		let expected = ["tests/_helpers/stubs/css/path1/_underscore.scss"].map(path.normalize);
		deps.forEach((dep, index) => {
			expect(dep).toContain(expected[index]);
		});
	});

	it("Should extract with slashes if sass or scss is included (existing slash)", () => {
		let extractor = CSSDependencyExtractor.init({
			paths: [stubs],
			extensions: ["scss"],
			sassStyle: true,
			content: `
            @import "_underscore";
            body {
                background-color: blue;
            }
            `,
		});
		let deps = extractor.getDependencies();
		let expected = ["tests/_helpers/stubs/css/path1/_underscore.scss"].map(path.normalize);
		deps.forEach((dep, index) => {
			expect(dep).toContain(expected[index]);
		});
	});

	it("Should extract with slashes if sass or scss is included (css file)", () => {
		let extractor = CSSDependencyExtractor.init({
			paths: [stubs],
			extensions: ["scss"],
			sassStyle: true,
			content: `
            @import "underscore_css";
            body {
                background-color: blue;
            }
            `,
		});
		let deps = extractor.getDependencies();
		let expected = ["tests/_helpers/stubs/css/path1/_underscore_css.css"].map(path.normalize);
		deps.forEach((dep, index) => {
			expect(dep).toContain(expected[index]);
		});
	});

	it("Should extract nested (2 levels)", () => {
		let extractor = CSSDependencyExtractor.init({
			paths: [nestedStubs],
			extensions: ["scss"],
			sassStyle: true,
			content: `
            @import "main";
            `,
		});
		let deps = extractor.getDependencies();
		let expected = [
			"tests/_helpers/stubs/css/nested/a/foo.scss",
			"tests/_helpers/stubs/css/nested/a/b/bar.scss",
			"tests/_helpers/stubs/css/nested/main.scss",
		].map(path.normalize);
		deps.forEach((dep, index) => {
			expect(dep).toContain(expected[index]);
		});
	});
});
