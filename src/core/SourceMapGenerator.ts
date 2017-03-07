import { File } from "./File";
import * as acorn from "acorn";
import * as SourceMap from "source-map";

export class SourceMapGenerator {
    public static generate(file: File, tokens: any[]) {
        const fileContent = file.contents;
        const filePath = file.info.fuseBoxPath;
        const smGenerator = new SourceMap.SourceMapGenerator({ file: `packages/${file.collection.name}/${filePath}` });

        tokens.some(token => {
            if (token.type.label === "eof") return true;

            const lineInfo = acorn.getLineInfo(fileContent, token.start);
            const mapping = {
                original: lineInfo,
                generated: lineInfo,
                source: filePath,
                name: false,
            };

            if (token.type.label === "name") mapping.name = token.value;

            smGenerator.addMapping(mapping);
        });

        smGenerator.setSourceContent(filePath, fileContent);
        file.sourceMap = JSON.stringify(smGenerator.toJSON());
    }
}
