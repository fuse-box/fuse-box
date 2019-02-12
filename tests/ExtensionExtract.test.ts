import { extractExtension } from "../src/Utils";

describe("UtilsExtensionExtract", () => {
	it("Should extract extension without $", () => {
		expect(extractExtension(".css")).toEqual("css");
	});

	it("Should extract extension with $", () => {
		expect(extractExtension(".css$")).toEqual("css");
	});

	it("Should throw an error", () => {
		expect(() => {
			extractExtension("css$");
		}).toThrowError();
	});
});
