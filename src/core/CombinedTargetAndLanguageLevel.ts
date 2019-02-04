import { ScriptTarget } from "./File";
import { getScriptLevelNumber } from "./TypescriptConfig";

export class CombinedTargetAndLanguageLevel {
	constructor(private combination: string) {
		this.combination = this.combination || "browser";
	}

	public getTarget(): string {
		const [target] = this.splitCombination();
		return target;
	}

	public getLanguageLevel(): ScriptTarget & number {
		const [, languageLevel] = this.splitCombination();

		return getScriptLevelNumber(languageLevel);
	}

	public getLanguageLevelOrDefault(defaultLanguageLevel: ScriptTarget = ScriptTarget.ES2018) {
		const languageLevel = this.getLanguageLevel();
		return languageLevel ? languageLevel : defaultLanguageLevel;
	}

	private splitCombination() {
		return this.combination.toLowerCase().split("@");
	}
}
