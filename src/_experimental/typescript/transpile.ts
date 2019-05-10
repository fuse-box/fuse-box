import * as ts from "typescript";

const cwd = process.cwd();

export const options: ts.CompilerOptions = ts.convertCompilerOptionsFromJson(
	{
		isolatedModules: true,
		suppressOutputPathCheck: true,
		allowNonTsExtensions: true,
		noLib: true,
		lib: ["dom", "es2015", "es2016", "es2017", "es2018", "esnext"], //undefined,
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
		noResolve: false, //true,
		sourceMap: false,
		inlineSources: true,
		moduleResolution: ts.ModuleResolutionKind.NodeJs,
		module: ts.ModuleKind.CommonJS,
		target: ts.ScriptTarget.ESNext,
	},
	".",
).options;
const defaultLibName = ts.getDefaultLibFilePath(options);
const documentRegistry = ts.createDocumentRegistry();

export function transpile(fileName: string, input: string) {
	let version = 0;
	let content = input;
	let snapshot = ts.ScriptSnapshot.fromString(content);

	const service = ts.createLanguageService(
		{
			getScriptFileNames: () => [fileName],
			getScriptVersion: () => version.toString(),
			getScriptSnapshot: () => snapshot,
			getCurrentDirectory: () => cwd,
			getCompilationSettings: () => options,
			getDefaultLibFileName: () => defaultLibName,
		},
		documentRegistry,
	);

	const emit = () => {
		return service.getEmitOutput(fileName, false);
	};

	const dispose = () => {
		service.dispose();
	};

	const update = (newInput: string) => {
		content = newInput;
		snapshot = ts.ScriptSnapshot.fromString(newInput);
		version = (version + 1) | 0;
	};

	const getSuggestions = () => {
		return service.getSuggestionDiagnostics(fileName);
	};

	const getDiagnostics = () => {
		return ts.sortAndDeduplicateDiagnostics(
			[].concat(service.getSemanticDiagnostics(fileName), service.getSyntacticDiagnostics(fileName)),
		);
	};

	return {
		emit,
		dispose,
		update,
		service,
		getSuggestions,
		getDiagnostics,
	};
}

// const testCode = `
// 	import * as fs from 'fs'

// 	const n: number = ''

// 	console.log(a, fs)
// `; //ts.sys.readFile('./_test.txt');
// const file = transpile("module.ts", testCode);

// console.time("Custom transpile Module");
// console.dir(file.getDiagnostics(), { depth: 1 });
// console.timeEnd("Custom transpile Module");
// console.time("Custom transpile Module");
// console.dir(file.getSuggestions(), { depth: 1 });
// console.timeEnd("Custom transpile Module");
