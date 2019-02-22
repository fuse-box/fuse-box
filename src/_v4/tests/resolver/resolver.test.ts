import { resolveModule } from "../../resolver";
import * as path from "path";

const cases = path.join(__dirname, "cases/");

describe("Resolver test", () => {
	describe("External modules", () => {
		it("Should resolve external target", () => {
			const info = resolveModule({ target: "http://foo.com/some.js" });
			expect(info).toEqual({ isExternal: true });
		});
	});

	describe("Folder resolution", () => {
		const homeDir = path.join(cases, "src1");

		it("Should resolve index.js", () => {
			const info = resolveModule({
				homeDir: homeDir,
				filePath: path.join(homeDir, "foo.js"),
				target: "./some1",
			});
			expect(info.extension).toEqual(".js");
			expect(info.fuseBoxPath).toEqual("some1/index.js");
			expect(info.absPath).toContain("cases/src1/some1/index.js");
		});

		it("Should resolve index.jsx", () => {
			const info = resolveModule({
				homeDir: homeDir,
				filePath: path.join(cases, "src1/foo.js"),
				target: "./some2",
			});
			expect(info.extension).toEqual(".jsx");
			expect(info.fuseBoxPath).toEqual("some2/index.jsx");
			expect(info.absPath).toContain("cases/src1/some2/index.jsx");
		});

		it("Should resolve index.ts", () => {
			const info = resolveModule({
				homeDir: homeDir,
				filePath: path.join(homeDir, "foo.js"),
				target: "./some3",
			});
			expect(info.extension).toEqual(".ts");
			expect(info.fuseBoxPath).toEqual("some3/index.js");
			expect(info.absPath).toContain("cases/src1/some3/index.ts");
		});

		it("Should resolve index.tsx", () => {
			const info = resolveModule({
				homeDir: homeDir,
				filePath: path.join(homeDir, "foo.js"),
				target: "./some4",
			});
			expect(info.extension).toEqual(".tsx");
			expect(info.fuseBoxPath).toEqual("some4/index.jsx");
			expect(info.absPath).toContain("cases/src1/some4/index.tsx");
		});

		test.only("Should resolve with package override", () => {
			const info = resolveModule({
				homeDir: homeDir,
				filePath: path.join(homeDir, "foo.js"),
				target: "./some5",
			});
			// here is basically it needs to contain an alias...
			// we need to detect if there was a package.json on the way
		});
	});
});
