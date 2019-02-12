import { ConsolidatePlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";

describe("ConsolidatePluginTest", () => {
	it("Should compile a template using consolidate", () => {
		return createEnv({
			project: {
				files: {
					"template.pug": "p Compiled with Pug",
				},
				plugins: [
					ConsolidatePlugin({
						engine: "pug",
					}),
				],
				instructions: "template.pug",
			},
		}).then(result => {
			const template = result.project.FuseBox.import("./template.pug");
			expect(template.default).toEqual("<p>Compiled with Pug</p>");
		});
	});

	it("Should allow user to override extension", () => {
		return createEnv({
			project: {
				files: {
					"template.foobar": "p Compiled with Pug",
				},
				plugins: [
					ConsolidatePlugin({
						engine: "pug",
						extension: ".foobar",
					}),
				],
				instructions: "template.foobar",
			},
		}).then(result => {
			const template = result.project.FuseBox.import("./template.foobar");
			expect(template.default).toEqual("<p>Compiled with Pug</p>");
		});
	});

	it("Should allow user to override default exports", () => {
		return createEnv({
			project: {
				files: {
					"template.pug": "p Compiled with Pug",
				},
				plugins: [
					ConsolidatePlugin({
						engine: "pug",
						useDefault: false,
					}),
				],
				instructions: "template.pug",
			},
		}).then(result => {
			const template = result.project.FuseBox.import("./template.pug");
			expect(template).toEqual("<p>Compiled with Pug</p>");
		});
	});

	it("Should allow extension overrides", () => {
		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.pug"],
				plugins: [
					ConsolidatePlugin({
						engine: "pug",
					}),
				],
				files: {
					"template.pug": "p I should not be included",
					"template.foo.pug": "p I should be included",
				},
			},
		})
			.simple(">template.pug")
			.then(env =>
				env.browser(window => {
					expect(window.FuseBox.import("./template.pug")).toEqual({ default: "<p>I should be included</p>" });
				}),
			);
	});

	it("Should allow user to specify baseDir", () => {
		return createEnv({
			project: {
				files: {
					"template.pug": "p Compiled with Pug",
				},
				plugins: [
					ConsolidatePlugin({
						engine: "pug",
						baseDir: "",
					}),
				],
				instructions: "template.pug",
			},
		}).then(result => {
			const template = result.project.FuseBox.import("./template.pug");
			expect(template.default).toEqual("<p>Compiled with Pug</p>");
		});
	});

	it("Should allow user to specify includeDir", () => {
		return createEnv({
			project: {
				files: {
					"template.pug": "p Compiled with Pug",
				},
				plugins: [
					ConsolidatePlugin({
						engine: "pug",
						includeDir: "",
					}),
				],
				instructions: "template.pug",
			},
		}).then(result => {
			const template = result.project.FuseBox.import("./template.pug");
			expect(template.default).toEqual("<p>Compiled with Pug</p>");
		});
	});
});
