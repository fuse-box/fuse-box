import * as path from "path";
import { fileLookup } from "../../resolver/fileLookup";
const cases = path.join(__dirname, "cases/lk");

describe("lookup test", () => {
	it("Should resolve (with ext", () => {
		const response = fileLookup({ fileDir: cases, target: "a/index.js" });
		expect(response.fileExists).toBe(true);
		expect(response.absPath).toContain("index.js");
	});

	it("Should resolve (with ext not found)", () => {
		const response = fileLookup({ fileDir: cases, target: "a/index.jsx" });
		expect(response.fileExists).toBe(false);
		expect(response.absPath).toContain("index.jsx");
	});

	it("Should resolve directory index.js", () => {
		const response = fileLookup({ fileDir: cases, target: "a/" });
		expect(response.isDirectoryIndex).toBe(true);
		expect(response.fileExists).toBe(true);
		expect(response.absPath).toMatch(/index\.js$/);
	});

	it("Should resolve directory index.jsx", () => {
		const response = fileLookup({ fileDir: cases, target: "b/" });
		expect(response.isDirectoryIndex).toBe(true);
		expect(response.fileExists).toBe(true);
		expect(response.absPath).toMatch(/index\.jsx$/);
	});

	it("Should resolve directory index.ts", () => {
		const response = fileLookup({ fileDir: cases, target: "c/" });

		expect(response.isDirectoryIndex).toBe(true);
		expect(response.fileExists).toBe(true);
		expect(response.absPath).toMatch(/index\.ts$/);
	});

	it("Should resolve directory index.tsx", () => {
		const response = fileLookup({ fileDir: cases, target: "d/" });
		expect(response.isDirectoryIndex).toBe(true);
		expect(response.fileExists).toBe(true);
		expect(response.absPath).toMatch(/index\.tsx$/);
	});

	it("Should resolve directory with package.json in it", () => {
		const response = fileLookup({ fileDir: cases, target: "e/" });
		expect(response.isDirectoryIndex).toBe(true);
		expect(response.fileExists).toBe(true);
		expect(response.customIndex).toBe(true);
		expect(response.absPath).toMatch(/foo.js$/);
	});

	it("Should resolve file .js", () => {
		const response = fileLookup({ fileDir: cases, target: "f/foo" });
		expect(response.fileExists).toBe(true);
		expect(response.absPath).toMatch(/foo.js$/);
	});

	it("Should resolve file .jsx", () => {
		const response = fileLookup({ fileDir: cases, target: "f/bar" });
		expect(response.fileExists).toBe(true);
		expect(response.absPath).toMatch(/bar.jsx$/);
	});

	it("Should resolve file .ts", () => {
		const response = fileLookup({ fileDir: cases, target: "f/aha" });
		expect(response.fileExists).toBe(true);
		expect(response.absPath).toMatch(/aha.ts$/);
	});

	it("Should resolve file .tsx", () => {
		const response = fileLookup({ fileDir: cases, target: "f/moi" });
		expect(response.fileExists).toBe(true);
		expect(response.absPath).toMatch(/moi.tsx$/);
	});

	it("Should not fail on an uknown directory", () => {
		const response = fileLookup({ fileDir: cases, target: "g" });
		expect(response.fileExists).toEqual(false);
	});
});
