import * as ts from "typescript";
import * as path from "path";

// const cwd = process.cwd();

export const options: ts.CompilerOptions = {
	isolatedModules: true,
	suppressOutputPathCheck: true,
	allowNonTsExtensions: true,
	noLib: true,
	lib: undefined,
	types: undefined,
	noEmit: undefined,
	noEmitOnError: undefined,
	paths: undefined,
	rootDirs: undefined,
	declaration: undefined,
	composite: undefined,
	declarationDir: undefined,
	out: undefined,
	outFile: undefined,
	noResolve: true,
	sourceMap: true,
	inlineSources: false,
	moduleResolution: ts.ModuleResolutionKind.NodeJs,
	module: ts.ModuleKind.CommonJS,
	target: ts.ScriptTarget.Latest,

	emitBOM: false,
	experimentalDecorators: true,
	esModuleInterop: true,
};
const newLineChar = ts.sys.newLine;

export function createSourceFile(filename: string, input: string): ts.SourceFile {
	const sourceFile = ts.createSourceFile("module.ts", input, options.target, true, ts.ScriptKind.JS);
	return sourceFile;
}

let currentProgram;
export function transpileModules(sourceFile: ts.SourceFile) {
	let output;
	let sourceMap;

	const program = ts.createProgram(
		[sourceFile.fileName],
		options,
		{
			getSourceFile: () => sourceFile,
			getDefaultLibFileName: () => "lib.d.ts",
			useCaseSensitiveFileNames: () => false,
			getCanonicalFileName: fileName => fileName,
			getCurrentDirectory: () => "",
			getNewLine: () => newLineChar,
			fileExists: () => true,
			readFile: () => "",
			directoryExists: () => true,
			getDirectories: () => [],
			writeFile: (name, text) => {
				if (path.extname(name) === ".map") {
					sourceMap = text;
				} else {
					output = text;
				}
			},
		},
		currentProgram,
	);

	currentProgram = program;

	program.emit();

	return { output, sourceMap };
}

// const testCode = ts.sys.readFile("./_test.txt");
// // const testCode = ts.sys.readFile('./transpileModule.ts');
// const source = createSourceFile("a.ts", testCode);

// // ts.transpileModule(testCode, { compilerOptions: options });

// console.time("Custom transpile Module");
// const out = transpileModules(source);
// console.timeEnd("Custom transpile Module");

// const src = ts.createSourceFile(
// 	"example.js",
// 	`
// 	const n: number = 123
// `,
// 	options.target,
// 	true,
// 	ts.ScriptKind.JS,
// );

// // ts.transform(src, [(ctx) =>])

// console.dir(src.getText())
