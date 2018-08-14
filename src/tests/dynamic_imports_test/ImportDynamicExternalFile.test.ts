import { should } from "fuse-test-runner";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { QuantumPlugin } from "../../index";

const TINY_LIB = "https://unpkg.com/bespoke@1.1.0/lib/bespoke.js";

export class ImportDynamicExternalFile {
	"Should import a external javascript file with Vanilla API (browser)"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                            export function getRemoteFile(){ 
                                return import("${TINY_LIB}")
                            }`,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					return index.getRemoteFile().then(result => {
						should(result.from).beFunction();
					});
				}),
			);
	}

	"Should import an external javascript file with Vanilla API (server)"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                            export function getRemoteFile(){ 
                                return import("${TINY_LIB}")
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
                    process.send({ response: result.from !== undefined});
                });
            `,
					data => {
						should(data).deepEqual({ response: true });
					},
				),
			);
	}

	"Should NOT import (catch) an external javascript file with Vanilla API (server)"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                            export function getRemoteFile(){ 
                                return import("http://asdfasdfs.js")
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
                    process.send({ response: result.from !== undefined});
                }).catch(e => {
                    process.send({ error: e});
                })
            `,
					data => {
						// Node 8 doesn't provide a message and Node 9 does.
						// Removing it from data error object.
						delete data.error.message;

						should(data).deepEqual({
							error: {
								code: "ENOTFOUND",
								errno: "ENOTFOUND",
								syscall: "getaddrinfo",
								hostname: "asdfasdfs.js",
								host: "asdfasdfs.js",
								port: 80,
							},
						});
					},
				),
			);
	}

	"Should import a remote javascript file with QuantumPlugin API (browser) (browser, target : universal)"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                        export function getRemoteFile(){ 
                            return import("${TINY_LIB}")
                        }
                        `,
				},
				plugins: [
					QuantumPlugin({
						target: "universal",
						extendServerImport: true,
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const index = window.$fsx.r(0);
					return index.getRemoteFile().then(result => {
						should(result.from).beFunction();
					});
				}),
			);
	}

	"Should import a remote javascript file with QuantumPlugin API (browser) (browser, target : browser)"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                        export function getRemoteFile(){ 
                            return import("${TINY_LIB}")
                        }
                        `,
				},
				plugins: [
					QuantumPlugin({
						target: "browser",
						extendServerImport: true,
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const index = window.$fsx.r(0);
					return index.getRemoteFile().then(result => {
						should(result.from).beFunction();
					});
				}),
			);
	}

	"Should import a remote javascript file with QuantumPlugin API (server) (browser, target : universal)"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                            export function getRemoteFile(){ 
                                return import("${TINY_LIB}")
                            }`,
				},
				plugins: [
					QuantumPlugin({
						target: "universal",
						extendServerImport: true,
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
                    process.send({ response: result.from !== undefined});
                });
            `,
					data => {
						should(data).deepEqual({ response: true });
					},
				),
			);
	}

	"Should import a remote javascript file with Vanilla API (server) (server, target : server)"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                            export function getRemoteFile(){ 
                                return import("${TINY_LIB}")
                            }`,
				},
				plugins: [
					QuantumPlugin({
						target: "server",
						extendServerImport: true,
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
                    process.send({ response: result.from !== undefined});
                });
            `,
					data => {
						should(data).deepEqual({ response: true });
					},
				),
			);
	}
}
