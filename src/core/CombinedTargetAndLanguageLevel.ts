import { ScriptTarget } from './File';

export class CombinedTargetAndLanguageLevel {

	constructor(private combination: string) {
		this.combination = this.combination || "browser";
	}

	target(): string {
		const [target,] = this.splittedCombination();
		return target;
	}

	languageLevel(): ScriptTarget {
		const [, languageLevel] = this.splittedCombination();
		const level = languageLevel && Object.keys(ScriptTarget).find(t => t.toLowerCase() === languageLevel);
		return level ? ScriptTarget[level] : undefined;
	}

	languageLevelOrDefault(defaultLanguageLevel: ScriptTarget = ScriptTarget.ES2016) {
		const languageLevel = this.languageLevel();
		return languageLevel ? languageLevel : defaultLanguageLevel;
	}

	private splittedCombination() {
		return this.combination.toLowerCase().split("@");
	}
}
