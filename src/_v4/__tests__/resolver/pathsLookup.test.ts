import * as path from "path";
import { pathsLookup } from "../../resolver/pathsLookup";

const CASE1 = path.join(__dirname, "cases/paths_lookup/src1");

describe("Paths lookup", () => {
	describe("Basic lookup based on listing", () => {
		it("Should lookup and resolve baseURL . (tsx)", () => {
			const result = pathsLookup({ baseURL: CASE1, homeDir: CASE1, target: "bar/Bar" });

			expect(result.fileExists).toBe(true);
			expect(result.absPath).toMatch(/Bar\.tsx$/);
		});

		it("Should lookup and resolve baseURL . (foo/index.ts)", () => {
			const result = pathsLookup({ baseURL: CASE1, homeDir: CASE1, target: "foo" });
			expect(result.fileExists).toBe(true);
			expect(result.absPath).toMatch(/foo\/index\.ts$/);
		});

		it("Should lookup and resolve baseURL . (foo/index.ts) with slash", () => {
			const result = pathsLookup({ baseURL: CASE1, homeDir: CASE1, target: "foo/" });
			expect(result.fileExists).toBe(true);
			expect(result.absPath).toMatch(/foo\/index\.ts$/);
		});

		it("Should fail to resolve", () => {
			const result = pathsLookup({ baseURL: CASE1, homeDir: CASE1, target: "foosome/" });
			expect(result).toBe(undefined);
		});

		it("Should result just a file name Moi.ts", () => {
			const result = pathsLookup({ baseURL: CASE1, homeDir: CASE1, target: "Moi" });
			expect(result.fileExists).toBe(true);
			expect(result.absPath).toMatch(/Moi.ts$/);
		});
	});

	describe("Lookup based on paths", () => {
		it("should look up an find @app", () => {
			const result = pathsLookup({
				baseURL: CASE1,
				homeDir: CASE1,
				paths: {
					"@app/*": ["something/app/*"],
				},
				target: "@app/Foo",
			});
			expect(result.fileExists).toBe(true);
			expect(result.extension).toEqual(".tsx");
			expect(result.absPath).toMatch(/something\/app\/Foo\.tsx$/);
		});

		it("should look up an find in 2 directories", () => {
			const result = pathsLookup({
				baseURL: CASE1,
				homeDir: CASE1,
				paths: {
					"@app/*": ["something/app/*", "something/other/*"],
				},
				target: "@app/AnotherFile",
			});
			expect(result.fileExists).toBe(true);
			expect(result.extension).toEqual(".jsx");
			expect(result.absPath).toMatch(/something\/other\/AnotherFile\.jsx$/);
		});
	});
});
