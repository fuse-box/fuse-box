import { CombinedTargetAndLanguageLevel } from "../src/core/CombinedTargetAndLanguageLevel";
import { ScriptTarget } from "../src/core/File";

const TARGET_BROWSER = "browser";
const TARGET_DUMMY = "asd";

describe("CombinedTargetAndLanguageLevelTest", () => {
	it("Should default to browser target", () => {
		const combination = new CombinedTargetAndLanguageLevel(null);
		expect(combination.getTarget()).toEqual(TARGET_BROWSER);
	});

	it("Should detect target without language level", () => {
		const combination = new CombinedTargetAndLanguageLevel(TARGET_DUMMY);
		expect(combination.getTarget()).toEqual(TARGET_DUMMY);
	});

	it("Should provide undefined for missing language level", () => {
		const combination = new CombinedTargetAndLanguageLevel(TARGET_DUMMY);
		expect(combination.getLanguageLevel()).toEqual(undefined);
	});

	it("Should detect target and language level", () => {
		const combination = new CombinedTargetAndLanguageLevel(`${TARGET_DUMMY}@es5`);
		expect(combination.getTarget()).toEqual(TARGET_DUMMY);
		expect(combination.getLanguageLevel()).toEqual(ScriptTarget.ES5);
		expect(typeof combination.getLanguageLevel()).toEqual("number");
	});

	it("Should default to language level es2018", () => {
		const combination = new CombinedTargetAndLanguageLevel(TARGET_DUMMY);
		expect(combination.getLanguageLevelOrDefault()).toEqual(ScriptTarget.ES2018);
		expect(typeof combination.getLanguageLevelOrDefault()).toEqual("number");
	});

	it("Should detect target and language level (for default variant)", () => {
		const combination = new CombinedTargetAndLanguageLevel(`${TARGET_DUMMY}@es5`);
		expect(combination.getTarget()).toEqual(TARGET_DUMMY);
		expect(combination.getLanguageLevelOrDefault()).toEqual(ScriptTarget.ES5);
		expect(typeof combination.getLanguageLevelOrDefault()).toEqual("number");
	});

	it("Should detect target and language level (for default variant [number])", () => {
		const combination = new CombinedTargetAndLanguageLevel(`${TARGET_DUMMY}@1`);
		expect(combination.getTarget()).toEqual(TARGET_DUMMY);
		expect(combination.getLanguageLevelOrDefault()).toEqual(ScriptTarget.ES5);
		expect(typeof combination.getLanguageLevelOrDefault()).toEqual("number");
	});
});
