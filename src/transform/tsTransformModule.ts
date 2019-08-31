import * as ts from 'typescript';

export const tsTransformModule = (
  input: string,
  fileName: string,
  compilerOptions: ts.CompilerOptions,
  beforeTransformers: (ts.TransformerFactory<ts.SourceFile> | ts.CustomTransformerFactory)[],
  afterTransformers: (ts.TransformerFactory<ts.SourceFile> | ts.CustomTransformerFactory)[],
  customTransformers: ts.CustomTransformers,
) => {
  if (!customTransformers) {
    customTransformers = {};
  }

  return ts.transpileModule(input, {
    fileName,
    compilerOptions,
    transformers: {
      before: [].concat(beforeTransformers || [], customTransformers.before || []),
      after: [].concat(afterTransformers || [], customTransformers.after || []),
      afterDeclarations: customTransformers.afterDeclarations || [],
    },
  });
};
