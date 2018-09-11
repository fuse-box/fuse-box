import { ScriptTarget } from './File';

export class CombinedTargetAndLanguageLevel {

	constructor(private combination: string) {
		this.combination = this.combination || "browser";
	}

	public target(): string {
		const [target,] = this.splitCombination();
		return target;
	}

	public languageLevel(): ScriptTarget {
		const [, languageLevel] = this.splitCombination();
		const level = languageLevel && Object.keys(ScriptTarget).find(t => t.toLowerCase() === languageLevel);
		return level ? ScriptTarget[level] : undefined;
	}

	public languageLevelOrDefault(defaultLanguageLevel: ScriptTarget = ScriptTarget.ES2016) {
		const languageLevel = this.languageLevel();
		return languageLevel ? languageLevel : defaultLanguageLevel;
	}

	private splitCombination() {
		return this.combination.toLowerCase().split("@");
	}
}
