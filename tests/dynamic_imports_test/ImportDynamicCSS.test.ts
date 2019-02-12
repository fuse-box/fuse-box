import { QuantumPlugin } from "../../src";
import { createRealNodeModule, FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";

describe("ImportDynamicCssTest", () => {
	it("Should import a remote css file with Vanilla API (browser)", () => {
		return FuseTestEnv.create({
			project: {
				distFiles: {
					"main.css": `
                            body: {
                                background-color:red;
                            }
                        `,
				},
				files: {
					"index.ts": `
                            import("./main.css")
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					window.FuseBox.import("./index");
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							expect(window.document.querySelectorAll("link")[0].attributes.href.value).toEqual("./main.css");
							return resolve();
						}, 1);
					});
				}),
			);
	});

	it("Should import a remote css file with Quantum API (browser : browser)", () => {
		return FuseTestEnv.create({
			project: {
				distFiles: {
					"main.css": `
                            body: {
                                background-color:red;
                            }
                        `,
				},
				files: {
					"index.ts": `
                            import("./main.css")
                        `,
				},
				plugins: [
					QuantumPlugin({
						target: "browser",
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					window.$fsx.r(0);
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							expect(window.document.querySelectorAll("link")[0].attributes.href.value).toEqual("./main.css");
							return resolve();
						}, 1);
					});
				}),
			);
	});

	it("Should import a remote css file with Quantum API (browser : universal)", () => {
		return FuseTestEnv.create({
			project: {
				distFiles: {
					"main.css": `
                            body: {
                                background-color:red;
                            }
                        `,
				},
				files: {
					"index.ts": `
                            import("./main.css")
                        `,
				},
				plugins: [
					QuantumPlugin({
						target: "universal",
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					window.$fsx.r(0);
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							expect(window.document.querySelectorAll("link")[0].attributes.href.value).toEqual("./main.css");
							return resolve();
						}, 1);
					});
				}),
			);
	});
});
