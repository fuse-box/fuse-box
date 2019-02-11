import { createEnv } from "./_helpers/OldEnv";

describe("NativeAutoImportConfig", () => {
	it("Should bundle process because { process: true }", () => {
		return createEnv({
			project: {
				natives: {
					process: true,
				},
				files: {
					"index.ts": `

                        module.exports = {
                            hello : process.env
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

	it("Should not bundle process because { process: false }", () => {
		return createEnv({
			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `

                        module.exports = {
                            hello : process.env
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

	it("Should not bundle http because it's not set to false", () => {
		return createEnv({
			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `

                        module.exports = {
                            hello : http
                        }
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.projectContents.toString();
			expect(contents).toContain(`/* fuse:injection: */ var http`);
		});
	});

	it("Should inject stream test 1", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `var myStream = stream;

                        module.exports = {
                            hello : myStream
                        }
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.projectContents.toString();
			expect(contents).toContain(`/* fuse:injection: */ var stream`);
		});
	});

	it("Should inject stream test 2", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `
                        module.exports = {
                            hello : stream
                        }
                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.projectContents.toString();
			expect(contents).toContain(`/* fuse:injection: */ var stream`);
		});
	});
});
