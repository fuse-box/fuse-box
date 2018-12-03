import { should } from "fuse-test-runner";
import { CSSDependencyExtractor } from "../lib/CSSDependencyExtractor";
import * as path from "path";
import * as appRoot from "app-root-path";

const stubs = path.join(appRoot.path, "src/tests/stubs/css/path1");
const nestedStubs = path.join(appRoot.path, "src/tests/stubs/css/nested");

export class DependencyExtractorTest {
	"Should extract"() {
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
			"tests/stubs/css/path1/foo.scss",
			"tests/stubs/css/path1/woo.scss",
			"tests/stubs/css/path1/hello.scss",
		].map(path.normalize);
		deps.forEach((dep, index) => {
			should(dep).findString(expected[index]);
		});
	}

	"Should extract with slashes if sass or scss is included"() {
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
		let expected = ["tests/stubs/css/path1/_underscore.scss"].map(path.normalize);
		deps.forEach((dep, index) => {
			should(dep).findString(expected[index]);
		});
	}

	"Should extract with slashes if sass or scss is included (existing slash)"() {
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
		let expected = ["tests/stubs/css/path1/_underscore.scss"].map(path.normalize);
		deps.forEach((dep, index) => {
			should(dep).findString(expected[index]);
		});
	}

	"Should extract with slashes if sass or scss is included (css file)"() {
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
		let expected = ["tests/stubs/css/path1/_underscore_css.css"].map(path.normalize);
		deps.forEach((dep, index) => {
			should(dep).findString(expected[index]);
		});
	}

	"Should extract nested (2 levels)"() {
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
			"tests/stubs/css/nested/a/foo.scss",
			"tests/stubs/css/nested/a/b/bar.scss",
			"tests/stubs/css/nested/main.scss",
		].map(path.normalize);
		deps.forEach((dep, index) => {
			should(dep).findString(expected[index]);
		});
	}
}
