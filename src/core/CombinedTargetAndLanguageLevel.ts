import { ScriptTarget } from './File';

export class CombinedTargetAndLanguageLevel {

	constructor(private combination: string) {
		this.combination = this.combination || "browser";
	}

	public getTarget(): string {
		const [target,] = this.splitCombination();
		return target;
	}

	public getLanguageLevel(): ScriptTarget {
		const [, languageLevel] = this.splitCombination();
		const level = languageLevel && Object.keys(ScriptTarget).find(t => t.toLowerCase() === languageLevel);
		return level ? ScriptTarget[level] : undefined;
	}

	public getLanguageLevelOrDefault(defaultLanguageLevel: ScriptTarget = ScriptTarget.ES2016) {
		const languageLevel = this.getLanguageLevel();
		return languageLevel ? languageLevel : defaultLanguageLevel;
	}

	private splitCombination() {
		return this.combination.toLowerCase().split("@");
	}
}
