import { findTargetFolder } from "../nodeModuleLookup";
import * as path from "path";
import { createRealNodeModule } from "../../test_utils";

const homeDir = path.join(__dirname, "cases/nm_lookup/src1");

describe("Node module lookup", () => {
	describe("Correct node_modules paths finder", () => {
		const filePath = path.join(homeDir, "foo.js");
		const moduleNames = {
			primary: { name: "nm-lookup-test-a", submodule: { name: "nm-submod_a" } },
		};
		const primaryPath = createRealNodeModule(
			moduleNames.primary.name,
			{
				main: "index.js",
				version: "1.0.1",
			},
			{
				"index.js": "module.exports = {}",
			},
		);

		const secondaryPath = createRealNodeModule(
			`${moduleNames.primary.name}/node_modules/${moduleNames.primary.submodule.name}`,
			{
				main: "index.js",
				version: "2.0.1",
			},
			{
				"index.js": "module.exports = {}",
			},
		);

		const thirdPath = createRealNodeModule(
			`${moduleNames.primary.name}/node_modules/${moduleNames.primary.submodule.name}/node_modules/foomod`,
			{
				main: "index.js",
				version: "2.0.1",
			},
			{
				"index.js": "module.exports = {}",
			},
		);

		it("Should find corrent node_modules paths", () => {
			const result = findTargetFolder({
				homeDir: homeDir,
				filePath: filePath,
				target: moduleNames.primary.name,
			});
			expect(result).toMatchFilePath("node_modules/nm-lookup-test-a$");
		});

		it("Should find a submodule", () => {
			const result = findTargetFolder({
				homeDir: homeDir,
				filePath: path.join(primaryPath, "foo/index.js"),
				target: moduleNames.primary.submodule.name,
			});
			//	console.log(result);
			//expect(result).toMatchFilePath("node_modules/nm-lookup-test-a$");
		});

		/*
				nm-lookup-test-a/
					node_modules/nm-submod_a
													<- we are here, requesting "foomod"
													node_modules/foomod
		*/

		test.only("Should find a third submodule", () => {
			const result = findTargetFolder({
				homeDir: homeDir,
				filePath: path.join(secondaryPath, "foo/index.js"),
				target: "foomod",
			});
			//console.log(result);
			//expect(result).toMatchFilePath("node_modules/nm-lookup-test-a$");
		});
	});
});
