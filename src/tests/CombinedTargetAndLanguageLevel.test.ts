import { should } from "fuse-test-runner";
import { CombinedTargetAndLanguageLevel } from "../core/CombinedTargetAndLanguageLevel";
import { ScriptTarget } from "../core/File";

const TARGET_BROWSER = "browser";
const TARGET_DUMMY = "asd";

export class CombinedTargetAndLanguageLevelTest {
	"Should default to browser target"() {
		const combination = new CombinedTargetAndLanguageLevel(null);
		should(combination.getTarget()).equal(TARGET_BROWSER);
	}

	"Should detect target without language level"() {
		const combination = new CombinedTargetAndLanguageLevel(TARGET_DUMMY);
		should(combination.getTarget()).equal(TARGET_DUMMY);
	}

	"Should provide undefined for missing language level"() {
		const combination = new CombinedTargetAndLanguageLevel(TARGET_DUMMY);
		should(combination.getLanguageLevel()).beUndefined();
	}

	"Should detect target and language level"() {
		const combination = new CombinedTargetAndLanguageLevel(`${TARGET_DUMMY}@es5`);
		should(combination.getTarget()).equal(TARGET_DUMMY);
		should(combination.getLanguageLevel()).equal(ScriptTarget.ES5);
		should(combination.getLanguageLevel()).beNumber();
	}

	"Should default to language level es2018"() {
		const combination = new CombinedTargetAndLanguageLevel(TARGET_DUMMY);
		should(combination.getLanguageLevelOrDefault()).equal(ScriptTarget.ES2018);
		should(combination.getLanguageLevelOrDefault()).beNumber();
	}

	"Should detect target and language level (for default variant)"() {
		const combination = new CombinedTargetAndLanguageLevel(`${TARGET_DUMMY}@es5`);
		should(combination.getTarget()).equal(TARGET_DUMMY);
		should(combination.getLanguageLevelOrDefault()).equal(ScriptTarget.ES5);
		should(combination.getLanguageLevelOrDefault()).beNumber();
	}
	"Should detect target and language level (for default variant [number])"() {
		const combination = new CombinedTargetAndLanguageLevel(`${TARGET_DUMMY}@1`);
		should(combination.getTarget()).equal(TARGET_DUMMY);
		should(combination.getLanguageLevelOrDefault()).equal(ScriptTarget.ES5);
		should(combination.getLanguageLevelOrDefault()).beNumber();
	}
}
