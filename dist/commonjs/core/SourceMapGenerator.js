"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acorn = require("acorn");
const SourceMap = require("source-map");
class SourceMapGenerator {
    static generate(file, tokens) {
        const fileContent = file.contents;
        const filePath = file.info.fuseBoxPath;
        const smGenerator = new SourceMap.SourceMapGenerator({ file: `packages/${file.collection.name}/${filePath}` });
        tokens.some(token => {
            if (token.type.label === "eof")
                return true;
            const lineInfo = acorn.getLineInfo(fileContent, token.start);
            const mapping = {
                original: lineInfo,
                generated: lineInfo,
                source: filePath,
                name: false,
            };
            if (token.type.label === "name")
                mapping.name = token.value;
            smGenerator.addMapping(mapping);
        });
        smGenerator.setSourceContent(filePath, fileContent);
        file.sourceMap = JSON.stringify(smGenerator.toJSON());
    }
}
exports.SourceMapGenerator = SourceMapGenerator;
