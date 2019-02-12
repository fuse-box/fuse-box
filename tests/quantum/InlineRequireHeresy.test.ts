import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";

describe("InlineRequireHeresyTest", () => {
	it("Should handle inline require and a call right away", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeUseStrict: false,
			},
			project: {
				files: {
					"index.ts": `
                        if ('object' !== 'undefined')
                            Object.defineProperty(exports,
                                    'babelPluginFlowReactPropTypes_proptype_StyleSheet',
                                        { value: require('./foo') });
                        }
                    `,
					"foo.ts": "export function hello(){}",
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("require");
			expect(contents).toContain("value: $fsx.r(1)");
		});
	});
});
