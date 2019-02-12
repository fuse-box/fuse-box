import { TerserPlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";

describe("TerserPluginTest", () => {
	it("Should return compressed js 1", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `
                const longVar = 'str1';
                let longVar2 = 'str2';
                module.exports = () => { return longVar + ' ' + longVar2; }
                `,
				},
				plugins: [TerserPlugin()],
				instructions: ">index.ts",
			},
		}).then(result => {
			result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();
			expect(contents).toContain("str1 str2");
		});
	});

	it("Should return __compressed__ js 2", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `
                    const longVar = 'str1';
                    let longVar2 = 'str2';
                    module.exports = () => { return longVar + ' ' + longVar2; }
                  `,
				},
				globals: { default: "__compressed__" },
				plugins: [TerserPlugin()],
				instructions: ">index.ts",
			},
		}).then(result => {
			result.project.FuseBox.import("./index");
			expect("__compressed__" in result.project).toBeTruthy();
			expect(result.project.__compressed__()).toContain("str1 str2");
		});
	});
});
