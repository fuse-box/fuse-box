import { QuantumPlugin } from "../../src";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";

describe("ImportDynamicJSON", () => {
	it("Should execute node module (path) UNIVERSAL (path polyfilled)", () => {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                        module.exports = require("path").join('a')
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
				test.server(
					`
                const index = $fsx.r(0);
                process.send({response : index})

            `,
					data => {
						expect(data.response).toEqual("a");
					},
				),
			);
	});

	it("Should execute node module (path) UNIVERSAL (path excluded)", () => {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                        module.exports = require("path").join('a')
                        `,
				},
				plugins: [
					QuantumPlugin({
						target: "universal",
					}),
				],
			},
		})
			.simple("[index.ts]")
			.then(test =>
				test.server(
					`
                const index = $fsx.r(0);
                process.send({response : index})

            `,
					data => {
						expect(data.response).toEqual("a");
					},
				),
			);
	});

	it("Should execute node module (path) SERVER (path polyfilled)", () => {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                        module.exports = require("path").join('a')
                        `,
				},
				plugins: [
					QuantumPlugin({
						target: "server",
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.server(
					`
                const index = $fsx.r(0);
                process.send({response : index})

            `,
					data => {
						expect(data.response).toEqual("a");
					},
				),
			);
	});
	it("Should execute node module (path) SERVER (path excluded)", () => {
		return FuseTestEnv.create({
			testFolder: "_current_test",
			project: {
				files: {
					"index.ts": `
                        module.exports = require("path").join('a')
                        `,
				},
				plugins: [
					QuantumPlugin({
						target: "server",
					}),
				],
			},
		})
			.simple("[index.ts]")
			.then(test =>
				test.server(
					`
                const index = $fsx.r(0);
                process.send({response : index})

            `,
					data => {
						expect(data.response).toEqual("a");
					},
				),
			);
	});
});
