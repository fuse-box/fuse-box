import { File } from "../../core/File";
import { Blender } from "sourcemap-blender";
import { acornParse } from "../../analysis/FileAnalysis";
import * as SourceMap from "source-map";
import * as acorn from "acorn";

export class QuantumSourceMap {
	public static async generateOriginalSourceMap(file: File, generatedCode: string) {
		const blender = new Blender({
			parse: source => acornParse(source),
			originalMap: file.sourceMap,
			sourceName: file.getSourceMapPath(),
			originalAST: file.analysis.ast,
			modifiedCode: generatedCode,
		});
		const data = await blender.blend();
		return data.map;
	}

	public static generateSourceMap(code, name) {
		const tokens = [];
		acornParse(code, {
			onToken: token => tokens.push(token),
		});

		const smGenerator = new SourceMap.SourceMapGenerator({ file: name });

		tokens.some(token => {
			if (token.type.label === "eof") return true;

			const lineInfo = acorn.getLineInfo(code, token.start);
			const mapping: SourceMap.Mapping = {
				original: lineInfo,
				generated: lineInfo,
				source: name,
			};

			if (token.type.label === "name") mapping.name = token.value;

			smGenerator.addMapping(mapping);
		});

		smGenerator.setSourceContent(name, code);
		return smGenerator.toString();
	}
}
