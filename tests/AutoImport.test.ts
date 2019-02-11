import { createEnv } from "./_helpers/OldEnv";

describe("AutoImportTest", () => {
	it("Should inject a variable woops case 1", () => {
		return createEnv({
			modules: {
				superFoo: {
					files: {
						"index.ts": `export const HelloFoo = "I am super"`,
					},
					package: "superFoo",
					instructions: ">index.ts",
				},
			},
			project: {
				autoImport: {
					woops: "superFoo",
				},
				files: {
					"index.ts": `exports.something = woops`,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();

			expect(contents).toContain(`/* fuse:injection: */ var woops`);
			expect(out).toEqual({ something: { HelloFoo: "I am super" } });
		});
	});

	it("Should inject a variable woops case 1 ({ target: server })", () => {
		return createEnv({
			modules: {
				superFoo: {
					files: {
						"index.ts": `export const HelloFoo = "I am super"`,
					},
					package: "superFoo",
					instructions: ">index.ts",
				},
			},
			project: {
				target: "server",
				autoImport: {
					woops: "superFoo",
				},
				files: {
					"index.ts": `exports.something = woops`,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();

			expect(contents).toContain(`/* fuse:injection: */ var woops`);
			expect(out).toEqual({ something: { HelloFoo: "I am super" } });
		});
	});

	it("Should inject a variable woops case 4", () => {
		return createEnv({
			modules: {
				superFoo: {
					files: {
						"index.ts": `export const HelloFoo = {someAction : () => "here"}`,
					},
					package: "superFoo",
					instructions: ">index.ts",
				},
			},
			project: {
				autoImport: {
					woops: "superFoo",
				},
				files: {
					"index.ts": `exports.something = woops.HelloFoo.someAction()`,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();

			expect(contents).toContain(`/* fuse:injection: */ var woops`);
			expect(out).toEqual({ something: "here" });
		});
	});

	it("Should inject a variable woops case 4 ({ target: server })", () => {
		return createEnv({
			modules: {
				superFoo: {
					files: {
						"index.ts": `export const HelloFoo = {someAction : () => "here"}`,
					},
					package: "superFoo",
					instructions: ">index.ts",
				},
			},
			project: {
				target: "server",
				autoImport: {
					woops: "superFoo",
				},
				files: {
					"index.ts": `exports.something = woops.HelloFoo.someAction()`,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();

			expect(contents).toContain(`/* fuse:injection: */ var woops`);
			expect(out).toEqual({ something: "here" });
		});
	});

	it("Should inject a variable woops case 2", () => {
		return createEnv({
			modules: {
				superFoo: {
					files: {
						"index.ts": `export const HelloFoo = "I am super"`,
					},
					package: "superFoo",
					instructions: ">index.ts",
				},
			},
			project: {
				autoImport: {
					woops: "superFoo",
				},
				files: {
					"index.ts": `
                        var coo = woops;
                        exports.something = coo;
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();

			expect(contents).toContain(`/* fuse:injection: */ var woops`);
			expect(out).toEqual({ something: { HelloFoo: "I am super" } });
		});
	});
	it("Should inject a variable woops case 2 ({ target: server })", () => {
		return createEnv({
			modules: {
				superFoo: {
					files: {
						"index.ts": `export const HelloFoo = "I am super"`,
					},
					package: "superFoo",
					instructions: ">index.ts",
				},
			},
			project: {
				target: "server",
				autoImport: {
					woops: "superFoo",
				},
				files: {
					"index.ts": `
                        var coo = woops;
                        exports.something = coo;
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();

			expect(contents).toContain(`/* fuse:injection: */ var woops`);
			expect(out).toEqual({ something: { HelloFoo: "I am super" } });
		});
	});

	it("Should not inject a variable woops case 1", () => {
		return createEnv({
			modules: {
				superFoo2: {
					files: {
						"index.ts": `export const HelloFoo = "I am super"`,
					},
					package: "superFoo2",
					instructions: ">index.ts",
				},
			},
			project: {
				autoImport: {
					woops: "superFoo2",
				},
				files: {
					"index.ts": `

                        var woops = {nada : true}
                        exports.myExport = woops;
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();
			expect(contents).not.toContain(`/* fuse:injection: */ var woops`);
			expect(out).toEqual({ myExport: { nada: true } });
		});
	});

	it("Should not inject a variable woops case 1 ({ target: server })", () => {
		return createEnv({
			modules: {
				superFoo2: {
					files: {
						"index.ts": `export const HelloFoo = "I am super"`,
					},
					package: "superFoo2",
					instructions: ">index.ts",
				},
			},
			project: {
				target: "server",
				autoImport: {
					woops: "superFoo2",
				},
				files: {
					"index.ts": `

                        var woops = {nada : true}
                        exports.myExport = woops;
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();
			expect(contents).not.toContain(`/* fuse:injection: */ var woops`);
			expect(out).toEqual({ myExport: { nada: true } });
		});
	});

	it("Should inject a variable Inferno", () => {
		return createEnv({
			modules: {
				inferno: {
					files: {
						"index.ts": `
                            export function magic(){
                                return "pure magic"
                            }
                        `,
					},
					package: "Inferno",
					instructions: ">index.ts",
				},
			},
			project: {
				autoImport: {
					Inferno: "inferno",
				},
				files: {
					"index.ts": `exports.result = Inferno.magic()`,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();

			expect(contents).toContain(`/* fuse:injection: */ var Inferno`);
			expect(out).toEqual({ result: "pure magic" });
		});
	});

	it("Should inject a variable Inferno ({ target: server })", () => {
		return createEnv({
			modules: {
				inferno: {
					files: {
						"index.ts": `
								export function magic(){
										return "pure magic"
								}
						`,
					},
					package: "Inferno",
					instructions: ">index.ts",
				},
			},
			project: {
				target: "server",
				autoImport: {
					Inferno: "inferno",
				},
				files: {
					"index.ts": `exports.result = Inferno.magic()`,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();

			expect(contents).toContain(`/* fuse:injection: */ var Inferno`);
			expect(out).toEqual({ result: "pure magic" });
		});
	});

	it("Should auto import Buffer", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": ` exports.hello = new Buffer("sd");
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();

			expect(out.hello).toBeTruthy();
			expect(contents).toContain(`/* fuse:injection: */ var Buffer = require("buffer").Buffer`);
		});
	});

	it("Process check with function", () => {
		return createEnv({
			project: {
				autoImport: {
					woops: "superFoo",
				},
				files: {
					"index.ts": `
                        function process(node) {

                        }
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.projectContents.toString();

			expect(contents).not.toContain(`/* fuse:injection: */ var process`);
		});
	});

	it("Process check with type property", () => {
		return createEnv({
			project: {
				autoImport: {
					woops: "superFoo",
				},
				files: {
					"index.ts": `
                        var a ={ process : "sdf"}
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.projectContents.toString();

			expect(contents).not.toContain(`/* fuse:injection: */ var process`);
		});
	});

	it("Process check with function param 'function(process){}'", () => {
		return createEnv({
			project: {
				autoImport: {
					woops: "superFoo",
				},
				files: {
					"index.ts": `
                        var a = function(process){}
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.projectContents.toString();
			expect(contents).not.toContain(`/* fuse:injection: */ var process`);
		});
	});

	it("Should not bundle process with 'function Users(process)'", () => {
		return createEnv({
			project: {
				autoImport: {
					woops: "superFoo",
				},
				files: {
					"index.ts": `
                       function Users(process){}
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.projectContents.toString();
			expect(contents).not.toContain(`/* fuse:injection: */ var process`);
		});
	});

	it("Should not bundle process with 'hello.process()'", () => {
		return createEnv({
			project: {
				autoImport: {
					woops: "superFoo",
				},
				files: {
					"index.ts": `
                        var hello = { }
                        var a = () => {
                            return hello.process();
                        }
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.projectContents.toString();
			expect(contents).not.toContain(`/* fuse:injection: */ var process`);
		});
	});

	it("Should export process", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `
                       module.exports = {
                           hello : process
                       }
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.projectContents.toString();

			expect(contents).toContain(`/* fuse:injection: */ var process`);
		});
	});
});
