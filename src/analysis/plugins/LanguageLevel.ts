import { File, ScriptTarget } from "../../core/File";

export class LanguageLevel {
	public static onNode(file: File, node: any, parent: any) {
		if (node.async === true) {
			file.setLanguageLevel(ScriptTarget.ES2017);
		} else if (node.kind === "const") {
			file.setLanguageLevel(ScriptTarget.ES2017);
		} else if (node.kind === "let") {
			file.setLanguageLevel(ScriptTarget.ES2015);
		} else if (node.type === "ArrowFunctionExpression") {
			file.setLanguageLevel(ScriptTarget.ES2015);
		} else if (node.type === "TemplateLiteral") {
			file.setLanguageLevel(ScriptTarget.ES2015);
		} else if (node.type === "ClassDeclaration") {
			file.setLanguageLevel(ScriptTarget.ES2015);
		}
	}
	public static onEnd(file: File) {
		// In case no target is explicitly specified in fuse.js, file.context.languageLevel defaults to ScriptTarget.ES2016
		// and no transpilation will be done, regardless of what is specified in tsConfig. This must be wrong?
		// I believe something like this is necessary.
		if (file.languageLevel > file.context.languageLevel) {
			file.analysis.requiresTranspilation = true;
		}
	}
}
