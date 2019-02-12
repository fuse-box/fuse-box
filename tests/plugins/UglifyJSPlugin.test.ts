import { createEnv } from "../_helpers/OldEnv";
import { UglifyJSPlugin } from "../../src";

describe("UglifyJSPluginTest", () => {
	it("Should return compressed js 1", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `
                var longVar = 'str1';
                var longVar2 = 'str2';
                module.exports = function () {return longVar + ' ' + longVar2;}
                `,
				},
				plugins: [UglifyJSPlugin()],
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
                  var longVar = 'str1';
                  var longVar2 = 'str2';
                  module.exports = function () {return longVar + ' ' + longVar2;}
                  `,
				},
				globals: { default: "__compressed__" },
				plugins: [UglifyJSPlugin()],
				instructions: ">index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			expect("__compressed__" in result.project).toBeTruthy();
			expect(result.project.__compressed__()).toContain("str1 str2");
		});
	});
});
