import * as path from "path";
import { getMemoryAdapter } from "../../cache/adapters";
import { getCache, getTree } from "../../cache/cache";
import { ICacheAdapter } from "../../cache/Interfaces";

const CASES = path.join(__dirname, "cases");

describe("Cache test", () => {
	let adapter: ICacheAdapter;
	const dummyPackage = {
		"1.0.0": {
			name: "foo",
			version: "1.0.0",
			packageJSONLocation: "./",
			modules: [],
		},
	};

	describe("Shared tree object", () => {
		beforeAll(() => {
			adapter = getMemoryAdapter();
		});
		it("Should get a default tree", () => {
			const tree = getTree(adapter);
			expect(tree).toEqual({ packages: {} });
		});

		it("Should modify the tree", () => {
			const tree = getTree(adapter);
			tree.packages["foo"] = dummyPackage;
		});

		it("Should retain the information", () => {
			const tree = getTree(adapter);
			expect(tree.packages["foo"]).toEqual(dummyPackage);
		});
	});

	describe("Cache test", () => {
		const adapter = getMemoryAdapter();
		const cache = getCache(adapter);
		const pkg1Json = path.join(CASES, "/pkg1/package.json");
		const pkg2Json = path.join(CASES, "/pkg2/package.json");
		const pkg3Json = path.join(CASES, "/pkg3/package.json");

		beforeAll(() => {
			cache.syncPackage(
				{
					name: "pkg1",
					version: require(pkg1Json).version,
					packageJSONLocation: pkg1Json,
					modules: ["index.js"],
				},
				{ compiled: "foo bar", sourceMap: "sm" },
			);

			cache.syncPackage(
				{
					name: "pkg2",
					version: require(pkg2Json).version,
					packageJSONLocation: pkg2Json,
					modules: ["index.js"],
					dependencies: [{ name: "pkg3", version: require(pkg3Json).version }],
				},
				{ compiled: "pkg2", sourceMap: "sm" },
			);

			cache.syncPackage(
				{
					name: "pkg3",
					version: require(pkg3Json).version,
					packageJSONLocation: pkg3Json,
					modules: ["index.js"],
				},
				{ compiled: "pkg3", sourceMap: "sm" },
			);
		});

		it("Should find a package in cache", () => {
			const pkg = cache.findPackage("pkg1", require(pkg1Json).version);
			expect(pkg.name).toEqual("pkg1");
			expect(pkg.version).toEqual(require(pkg1Json).version);
			expect(pkg.packageJSONLocation).toContain("pkg1/package.json");
			expect(pkg.modules).toEqual(["index.js"]);
		});

		it("Should resolve correctly", () => {
			const result = cache.resolve({
				name: "pkg1",
				version: require(pkg1Json).version,
				forModules: ["index.js"],
			});

			expect(result).toHaveLength(1);
			expect(result[0].content.compiled).toEqual("foo bar");
			expect(result[0].content.sourceMap).toEqual("sm");
			expect(result[0].meta.name).toEqual("pkg1");
		});

		it("Should not be satisfied because of different file requirement", () => {
			const result = cache.resolve({
				name: "pkg1",
				version: require(pkg1Json).version,
				forModules: ["someOther.js"],
			});

			expect(result).toEqual(undefined);
		});

		it("Should not be satisfied (version mismatch)", () => {
			// don't do this at home
			const directObject = adapter["data"]["tree.json"].packages.pkg1["5.0.1"];
			directObject.packageJSONLocation = path.join(CASES, "pkg1/other.package.json");
			const result = cache.resolve({
				name: "pkg1",
				version: require(pkg1Json).version,
				forModules: ["index.js"],
			});

			expect(result).toEqual(undefined);
			// restore it back
			directObject.packageJSONLocation = pkg1Json;
		});

		it("Should resolve package with 2 dependencies", () => {
			const result = cache.resolve({
				name: "pkg2",
				version: require(pkg2Json).version,
				forModules: ["index.js"],
			});
			expect(result).toHaveLength(2);

			expect(result[0].meta.name).toEqual("pkg2");
			expect(result[1].meta.name).toEqual("pkg3");
		});
	});
});
