import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";

describe("TreeShakeTest", () => {
	it("Should not tree shake Foo2", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: false,
			},
			project: {
				files: {
					"index.ts": `
                        import { Foo1 } from "./foo";
                        console.log(Foo1);
                    `,
					"foo.ts": `
                        class Foo1 {}
                        class Foo2 {}
                        exports.Foo1 = Foo1;
                        exports.Foo2 = Foo2;

                    `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain(`exports.Foo2`);
		});
	});

	it("Should tree shake Foo2", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
			},
			project: {
				files: {
					"index.ts": `
                        import { Foo1 } from "./foo";
                        console.log(Foo1);
                    `,
					"foo.ts": `
                        class Foo1 {}
                        class Foo2 {}
                        exports.Foo1 = Foo1;
                        exports.Foo2 = Foo2;

                    `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain(`exports.Foo2`);
		});
	});

	it("Should not shake an imidiate require", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
			},
			project: {
				files: {
					"index.js": `
                        require('./bar');
                    `,
					"foo.ts": `
                        class Foo1 {}
                        class Foo2 {}
                        exports.Foo1 = Foo1;
                        exports.Foo2 = Foo2;

                    `,
				},
				instructions: "index.js",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			//console.log(contents);
			//expect(contents).not.toContain(`exports.Foo2`);
		});
	});

	it("Should not tree shake local usage", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
			},
			project: {
				files: {
					"index.ts": `
                        var Reflux = require("./reflux")

                        Reflux.createAction();
                    `,
					"reflux.ts": `
                        exports.createAction = () => {
                            return exports.createSomething();
                        }
                        exports.createSomething = () => {}

                    `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain(`exports.createSomething`);
		});
	});

	it("Should not tree shake local usage if not used", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
			},
			project: {
				files: {
					"index.ts": `
                        var Reflux = require("./reflux")

                        Reflux.createAction();
                    `,
					"reflux.ts": `
                        exports.createAction = () => {
                            //return exports.createSomething();
                        }
                        exports.createSomething = () => {}

                    `,
				},
				instructions: "**/**.ts > index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain(`exports.createSomething`);
		});
	});

	it("Should remove unaffected files ( foo should be removed )", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
			},
			project: {
				files: {
					"index.ts": `
                        require("./bar")
                    `,
					"bar.ts": `
                        exports.bar = 1;

                    `,
					"foo.ts": `
                        exports.foo = 1;

                    `,
				},
				instructions: "**/**.ts > index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("exports.foo");
		});
	});

	it("Should not remove foo ( was referenced by bar )", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
			},
			project: {
				files: {
					"index.ts": `
                        require("./bar")
                    `,
					"bar.ts": `
                        exports.bar = require("./foo");

                    `,
					"foo.ts": `
                        exports.foo = 1;

                    `,
				},
				instructions: "**/**.ts > index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("exports.foo");
		});
	});

	it("Should NOT remove unaffecte file (restricted by user)", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: {
					shouldRemove: file => {
						if (file.fuseBoxPath === "foo.js") {
							return false;
						}
					},
				},
			},
			project: {
				files: {
					"index.ts": `
                        require("./bar")
                    `,
					"bar.ts": `
                        exports.bar = 1;

                    `,
					"foo.ts": `
                        exports.foo = 1;

                    `,
				},
				instructions: "**/**.ts > index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("exports.foo");
		});
	});

	it("Should remove unaffecte file (allowed by user)", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: {
					shouldRemove: file => {
						if (file.fuseBoxPath === "foo.js") {
							return true;
						}
					},
				},
			},
			project: {
				files: {
					"index.ts": `
                        require("./bar")
                    `,
					"bar.ts": `
                        exports.bar = 1;

                    `,
					"foo.ts": `
                        exports.foo = 1;

                    `,
				},
				instructions: "**/**.ts > index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("exports.foo");
		});
	});

	it("Should remove deeply", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
			},

			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `
                        if ( process.env.NODE_ENV !== "production"){
                            require("./bar")
                        } else {
                            console.log("Production")
                        }
                    `,
					"bar.ts": `
                        console.log('i am bar');
                        exports.bar = require("./foo");

                    `,
					"foo.ts": `
                        console.log('i am foo');
                        exports.foo = 1;

                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("i am bar");
			expect(contents).not.toContain("i am foo");
		});
	});

	it("Should not remove a module that is cross referenced", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
			},

			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `
                        if ( process.env.NODE_ENV !== "production"){
                            require("./bar")
                        } else {
                            require("./foo")
                            console.log("Production")
                        }
                    `,
					"bar.ts": `
                        console.log('i am bar');
                        exports.bar = require("./foo");

                    `,
					"foo.ts": `
                        console.log('i am foo');
                        exports.foo = 1;

                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("i am bar");
			expect(contents).toContain("i am foo");
		});
	});

	it("Should exports from a module that is double exported", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
			},

			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `
                        import {hello} from "./bar";
                        console.log(hello);
                    `,
					"bar.ts": `
                        export {hello, hello2} from "./utils"


                    `,
					"utils.ts": `
                        export function hello(){}
                        export function hello2(){}

                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			// to be resolved....
			//console.log(contents);
		});
	});

	it("Should tree shake unreferenced require statements", () => {
		return createOptimisedBundleEnv({
			stubs: true,

			options: {
				treeshake: true,
			},

			project: {
				natives: {
					process: false,
				},
				files: {
					"hello.ts": `
                        export {bar} from "./bar"
                        export {foo} from "./foo"
                    `,
					"index.ts": `
                       import {bar} from "./hello";
                       bar()

                    `,
					"bar.ts": `
                        export function bar(){return "i am bar"}

                    `,
					"foo.ts": `
                        export function foo(){return "i am foo"}

                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("i am foo");
			expect(contents).toContain("i am bar");
		});
	});

	it("Should NOT tree shake unreferenced require statements", () => {
		return createOptimisedBundleEnv({
			stubs: true,

			options: {
				treeshake: true,
			},

			project: {
				natives: {
					process: false,
				},
				files: {
					"hello.ts": `
                        export {bar} from "./bar"
                        import {foo} from "./foo"
                        foo()
                        export.foo = foo
                    `,
					"index.ts": `
                       import {bar} from "./hello";
                       bar()

                    `,
					"bar.ts": `
                        export function bar(){return "i am bar"}

                    `,
					"foo.ts": `
                        export function foo(){return "i am foo"}

                    `,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("i am foo");
			expect(contents).toContain("i am bar");
		});
	});
});
