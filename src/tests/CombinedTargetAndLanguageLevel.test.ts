import { should } from "fuse-test-runner";
import { CombinedTargetAndLanguageLevel } from '../core/CombinedTargetAndLanguageLevel';
import { ScriptTarget } from '../core/File';

const TARGET_BROWSER = "browser";
const TARGET_DUMMY = "asd";

export class CombinedTargetAndLanguageLevelTest {

	"Should default to browser target"() {
		const combination = new CombinedTargetAndLanguageLevel(null);
		should(combination.target()).equal(TARGET_BROWSER);
	}

	"Should detect target without language level"() {
		const combination = new CombinedTargetAndLanguageLevel(TARGET_DUMMY);
		should(combination.target()).equal(TARGET_DUMMY);
	}

	"Should provide undefined for missing language level"() {
		const combination = new CombinedTargetAndLanguageLevel(TARGET_DUMMY);
		should(combination.languageLevel()).beUndefined();
	}

	"Should detect target and language level"() {
		const combination = new CombinedTargetAndLanguageLevel(`${TARGET_DUMMY}@es5`);
		should(combination.target()).equal(TARGET_DUMMY);
		should(combination.languageLevel()).equal(ScriptTarget.ES5);
	}

	"Should default to language level es2016"() {
		const combination = new CombinedTargetAndLanguageLevel(TARGET_DUMMY);
		should(combination.languageLevelOrDefault()).equal(ScriptTarget.ES2016);
	}

	"Should detect target and language level (for default variant)"() {
		const combination = new CombinedTargetAndLanguageLevel(`${TARGET_DUMMY}@es5`);
		should(combination.target()).equal(TARGET_DUMMY);
		should(combination.languageLevelOrDefault()).equal(ScriptTarget.ES5);
	}
}
