import * as fs from "fs";
import * as path from "path";
import { CSSPlugin, SassPlugin } from "../../src";
import { Config } from "../../src/Config";
import { createEnv } from "../_helpers/OldEnv";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";
describe("CssPluginTest", () => {
	it("Should import reset.css", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `exports.hello = { bar : require("./a.scss") }`,
					"a.scss": `
                        @import 'reset';
                        body { font-size:12px }

                    `,
					"reset.scss": "h1 { color:red}",
				},
				plugins: [[SassPlugin(), CSSPlugin()]],
				instructions: "index.ts",
			},
		}).then(result => {
			const js = result.projectContents.toString();

			expect(js).toContain(`color: red`);
			expect(js).toContain("font-size: 12px");
		});
	});

	it("Should allow extension overrides", () => {
		return FuseTestEnv.create({
			project: {
				plugins: [[SassPlugin(), CSSPlugin()]],
				extensionOverrides: [".foo.scss"],
				files: {
					"index.ts": `import './main.scss'`,
					"main.scss": `html { background: red; }`,
					"main.foo.scss": `html { background: blue; }`,
				},
			},
		})
			.simple()
			.then(env =>
				env.browser(window => {
					expect(window.document.querySelectorAll("style")).toHaveLength(1);
					expect(window.document.querySelector("style").attributes.id.value).toEqual("default-main-scss");
					expect(window.document.querySelector("style").innerHTML).toContain("background: blue;");
				}),
			);
	});

	it("Should compile with $homeDir macro", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `exports.hello = { bar : require("./a.scss") }`,
					"a.scss": `
                        @import '$homeDir/b.scss';

                        body { font-size:12px }

                    `,
					"b.scss": "h1 { color:red}",
				},
				plugins: [[SassPlugin({ importer: true }), CSSPlugin()]],
				instructions: "index.ts",
			},
		}).then(result => {
			const js = result.projectContents.toString();
			expect(js).toContain(`color: red`);
			expect(js).toContain("font-size: 12px");
		});
	});

	it("Should allow extension overrides with $homeDir macro", () => {
		return FuseTestEnv.create({
			project: {
				plugins: [[SassPlugin({ importer: true }), CSSPlugin()]],
				extensionOverrides: [".foo.scss"],
				files: {
					"index.ts": `import './main.scss'`,
					"main.scss": `@import '$homeDir/b.scss';`,
					"b.scss": `html { color: blue; }`,
					"b.foo.scss": `html { color: red; }`,
				},
			},
		})
			.simple()
			.then(env =>
				env.browser(window => {
					expect(window.document.querySelectorAll("style")).toHaveLength(1);
					expect(window.document.querySelector("style").attributes.id.value).toEqual("default-main-scss");
					expect(window.document.querySelector("style").innerHTML).toContain("color: red;");
				}),
			);
	});

	it("Should compile with $appRoot macro", () => {
		fs.writeFileSync(path.join(Config.TEMP_FOLDER, "test.scss"), "h1 {color: pink}");
		return createEnv({
			project: {
				files: {
					"index.ts": `exports.hello = { bar : require("./a.scss") }`,
					"a.scss": `
                        @import '$appRoot/.fusebox/test.scss';


                        body { font-size:12px }
                    `,
				},
				plugins: [[SassPlugin({ importer: true }), CSSPlugin()]],
				instructions: "index.ts",
			},
		}).then(result => {
			const js = result.projectContents.toString();
			expect(js).toContain(`color: pink`);
			expect(js).toContain("font-size: 12px");
		});
	});

	it("Should compile with custom $hello", () => {
		fs.writeFileSync(path.join(Config.TEMP_FOLDER, "test2.scss"), "h1 {color: purple}");
		return createEnv({
			project: {
				files: {
					"index.ts": `exports.hello = { bar : require("./a.scss") }`,
					"a.scss": `
                        @import '$hello/test2.scss';


                        body { font-size:12px }
                    `,
				},
				plugins: [
					[
						SassPlugin({
							importer: true,
							macros: {
								$hello: Config.TEMP_FOLDER + "/",
							},
						}),
						CSSPlugin(),
					],
				],
				instructions: "index.ts",
			},
		}).then(result => {
			const js = result.projectContents.toString();
			expect(js).toContain(`color: purple`);
			expect(js).toContain("font-size: 12px");
		});
	});

	it("Should be able to override $homeDir", () => {
		fs.writeFileSync(path.join(Config.TEMP_FOLDER, "test3.scss"), "h1 {color: purple}");
		return createEnv({
			project: {
				files: {
					"index.ts": `exports.hello = { bar : require("./a.scss") }`,
					"a.scss": `
                        @import '$homeDir/test3.scss';


                        body { font-size:12px }
                    `,
				},
				plugins: [
					[
						SassPlugin({
							importer: true,
							macros: {
								$homeDir: Config.TEMP_FOLDER + "/",
							},
						}),
						CSSPlugin(),
					],
				],
				instructions: "index.ts",
			},
		}).then(result => {
			const js = result.projectContents.toString();

			expect(js).toContain(`color: purple`);
			expect(js).toContain("font-size: 12px");
		});
	});

	it("Should compile with custom functions", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `exports.hello = { bar : require("./a.scss") }`,
					"a.scss": `
                        .foo { font-size: foo(1); }
                        .bar { font-size: bar(2, 2); }
                    `,
				},
				plugins: [
					[
						SassPlugin({
							functions: {
								"foo($a)": a => {
									a.setUnit("rem");
									return a;
								},
								"bar($a,$b)": (a, b) => {
									a.setValue(a.getValue() * b.getValue());
									a.setUnit("rem");
									return a;
								},
							},
						}),
						CSSPlugin(),
					],
				],
				instructions: "index.ts",
			},
		}).then(result => {
			const js = result.projectContents.toString();

			expect(js).toContain(`font-size: 1rem;`);
			expect(js).toContain(`font-size: 4rem;`);
		});
	});
});
