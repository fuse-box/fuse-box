import * as log from "fliplog";
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
});
