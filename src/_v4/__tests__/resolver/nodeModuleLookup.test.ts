import { findTargetFolder } from "../../resolver/nodeModuleLookup";
import * as path from "path";
import { createRealNodeModule } from "../utils";

const homeDir = path.join(__dirname, "cases/nm_lookup/src1");

describe("Node module lookup", () => {
	describe("Correct node_modules paths finder", () => {
		const filePath = path.join(homeDir, "foo.js");

		createRealNodeModule(
			"nm-lookup-test-a",
			{
				main: "index.js",
				version: "1.0.1",
			},
			{
				"index.js": "module.exports = {}",
			},
		);

		it("Should find corrent node_modules paths", () => {
			const result = findTargetFolder({
				homeDir: homeDir,
				filePath: filePath,
				target: "nm-lookup-test-a",
			});
			expect(result).toMatchFilePath("node_modules/nm-lookup-test-a$");
		});
	});
});
