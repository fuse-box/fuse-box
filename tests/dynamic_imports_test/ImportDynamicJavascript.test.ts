import { QuantumPlugin } from "../../src";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";

describe("ImportDynamicJavascript", () => {
	it("Should import a remote javascript file with Vanilla API (browser)", () => {
		return FuseTestEnv.create({
			project: {
				distFiles: {
					"hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}",
				},
				files: {
					"index.ts": `
                    export function getRemoteFile(){
                        return import("./hello.js")
                    }`,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					return index.getRemoteFile().then(result => {
						expect(result.remoteFN()).toEqual(`some result from a remote file`);
					});
				}),
			);
	});

	it("Should import a remote javascript file with Vanilla API (server)", () => {
		return FuseTestEnv.create({
			project: {
				distFiles: {
					"hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}",
				},
				files: {
					"index.ts": `
                    export function getRemoteFile(){
                        return import("./hello.js")
                    }`,
				},
			},
		})
			.simple()
			.then(test =>
				test.server(
					`
                const index = FuseBox.import("./index");
                index.getRemoteFile().then(result => {
                    process.send({ response: result.remoteFN()});
                });
            `,
					data => {
						expect(data.response).toEqual(`some result from a remote file`);
					},
				),
			);
	});

	it("Should import a remote javascript file with Quantum API (browser, target : browser)", () => {
		return FuseTestEnv.create({
			project: {
				distFiles: {
					"hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}",
				},
				files: {
					"index.ts": `
                    export function getRemoteFile(){
                        return import("./hello.js")
                    }`,
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
					const index = window.$fsx.r(0);
					return index.getRemoteFile().then(result => {
						expect(result.remoteFN()).toEqual(`some result from a remote file`);
					});
				}),
			);
	});

	it("Should import a remote javascript file with Quantum API (browser, target : univeral)", () => {
		return FuseTestEnv.create({
			project: {
				distFiles: {
					"hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}",
				},
				files: {
					"index.ts": `
                    export function getRemoteFile(){
                        return import("./hello.js")
                    }`,
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
					const index = window.$fsx.r(0);
					return index.getRemoteFile().then(result => {
						expect(result.remoteFN()).toEqual(`some result from a remote file`);
					});
				}),
			);
	});

	it("Should import a remote javascript file with Quantum API (server, target : server)", () => {
		return FuseTestEnv.create({
			project: {
				distFiles: {
					"hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}",
				},
				files: {
					"index.ts": `
                    export function getRemoteFile(){
                        return import("./hello.js")
                    }`,
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
                index.getRemoteFile().then(result => {
                    process.send({ response: result.remoteFN()});
                });
            `,
					data => {
						expect(data.response).toEqual(`some result from a remote file`);
					},
				),
			);
	});

	it("Should fail to import import a remote javascript file with Quantum API (browser, target : browser) (NOT FOUND)", () => {
		return FuseTestEnv.create({
			project: {
				distFiles: {
					"hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}",
				},
				files: {
					"index.ts": `
                    export function getRemoteFile(){
                        return import("./hello2.js")
                    }`,
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
					const index = window.$fsx.r(0);
					return index
						.getRemoteFile()
						.then(result => {
							throw "Should not happen";
						})
						.catch(e => {
							expect(e.code).toEqual(404);
						});
				}),
			);
	});

	it("Should fail to import import a remote javascript file with Quantum API (browser, target : universal) (NOT FOUND)", () => {
		return FuseTestEnv.create({
			project: {
				distFiles: {
					"hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}",
				},
				files: {
					"index.ts": `
                    export function getRemoteFile(){
                        return import("./hello2.js")
                    }`,
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
					const index = window.$fsx.r(0);
					return index
						.getRemoteFile()
						.then(result => {
							throw "Should not happen";
						})
						.catch(e => {
							expect(e).toEqual({ code: 404, msg: "Not Found" });
						});
				}),
			);
	});

	it("Should fail trying to execute a Quantum server Build in browser", () => {
		return FuseTestEnv.create({
			project: {
				distFiles: {
					"hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}",
				},
				files: {
					"index.ts": `
                    export function getRemoteFile(){
                        return import("./hello.js")
                    }`,
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
				test.browser(window => {
					expect(window.$fsx).toBeFalsy();
				}),
			);
	});
});
