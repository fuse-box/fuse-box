import * as appRoot from "app-root-path";
import * as fs from "fs";
import * as fsExtra from "fs-extra";
import * as path from "path";
import * as ts from "typescript";
import { FuseBox } from "../src";
import { getScriptLevelNumber, getScriptLevelString } from "../src/core/TypescriptConfig";

const getTempDir = () => {
	const name = `test-tsconfig-${new Date().getTime()}`;
	let tmpFolder = path.join(appRoot.path, ".fusebox", "tests", name);
	fsExtra.ensureDirSync(tmpFolder);
	return tmpFolder;
};

describe("TypescriptConfigTest", () => {
	it("Should get number language level (level: 'es5' -> 1)", () => {
		expect(getScriptLevelNumber("Es5")).toEqual(ts.ScriptTarget.ES5);
	});
	it("Should get number language level (level: 1 -> 1)", () => {
		expect(getScriptLevelNumber(ts.ScriptTarget.ES5)).toEqual(ts.ScriptTarget.ES5);
	});
	it("Should get number language level (level: 'esnext' -> 6)", () => {
		expect(getScriptLevelNumber("esnext")).toEqual(ts.ScriptTarget.ESNext);
	});
	it("Should get number language level (level: 6 -> 6)", () => {
		expect(getScriptLevelNumber(ts.ScriptTarget.ESNext)).toEqual(ts.ScriptTarget.ESNext);
	});
	it("Should get number language level (level: 'json' -> undefined)", () => {
		expect(getScriptLevelNumber(ts.ScriptTarget.JSON)).toEqual(undefined);
	});
	it("Should get number language level (level: unknown -> undefined)", () => {
		expect(getScriptLevelNumber("asd")).toEqual(undefined);
	});
	it("Should get string language level (level: 1 -> 'ES5')", () => {
		expect(getScriptLevelString(ts.ScriptTarget.ES5)).toEqual("ES5");
	});
	it("Should get string language level (level: 6 -> 'ESNext')", () => {
		expect(getScriptLevelString(ts.ScriptTarget.ESNext)).toEqual("ESNext");
	});
	it("Should get string language level (level: 100 [JSON] -> undefined)", () => {
		expect(getScriptLevelString(ts.ScriptTarget.JSON)).toEqual(undefined);
	});

	it("Should generate recommended tsconfig.json file", () => {
		const testDir = getTempDir();
		const fuse = FuseBox.init({ homeDir: testDir, log: false });
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));
		const tsconfigFileName = path.resolve(testDir, "tsconfig.json");

		expect(fs.existsSync(tsconfigFileName)).toBeTruthy();
		expect(JSON.parse(fs.readFileSync(tsconfigFileName).toString())).toEqual({
			compilerOptions: {
				module: "CommonJS",
				target: "ES2018",
				jsx: "react",
				baseUrl: ".",
				importHelpers: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true,
			},
		});
		expect(config).toEqual({
			compilerOptions: {
				module: ts.ModuleKind.CommonJS,
				target: ts.ScriptTarget.ES2018,
				jsx: ts.JsxEmit.React,
				baseUrl: ".",
				importHelpers: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true,
			},
			errors: [],
		});
	});
	it("Should generate recommended tsconfig.json file (with source maps)", () => {
		const testDir = getTempDir();
		const fuse = FuseBox.init({
			homeDir: testDir,
			sourceMaps: true,
			log: false,
		});
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));
		const tsconfigFileName = path.resolve(testDir, "tsconfig.json");

		expect(fs.existsSync(tsconfigFileName)).toBeTruthy();
		expect(JSON.parse(fs.readFileSync(tsconfigFileName).toString())).toEqual({
			compilerOptions: {
				module: "CommonJS",
				target: "ES2018",
				jsx: "react",
				baseUrl: ".",
				importHelpers: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true,
				sourceMap: true,
				inlineSources: true,
			},
		});
		expect(config).toEqual({
			compilerOptions: {
				module: ts.ModuleKind.CommonJS,
				target: ts.ScriptTarget.ES2018,
				jsx: ts.JsxEmit.React,
				baseUrl: ".",
				importHelpers: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true,
				sourceMap: true,
				inlineSources: true,
			},
			errors: [],
		});
	});
	it("Should generate recommended tsconfig.json file (with forced language level: esnext)", () => {
		const testDir = getTempDir();
		const fuse = FuseBox.init({
			target: "browser@esnext",
			homeDir: testDir,
			sourceMaps: true,
			log: false,
		});
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));
		const tsconfigFileName = path.resolve(testDir, "tsconfig.json");

		expect(fs.existsSync(tsconfigFileName)).toBeTruthy();
		expect(JSON.parse(fs.readFileSync(tsconfigFileName).toString())).toEqual({
			compilerOptions: {
				module: "CommonJS",
				target: "ESNext",
				jsx: "react",
				baseUrl: ".",
				importHelpers: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true,
				sourceMap: true,
				inlineSources: true,
			},
		});
		expect(config).toEqual({
			compilerOptions: {
				module: ts.ModuleKind.CommonJS,
				target: ts.ScriptTarget.ESNext,
				jsx: ts.JsxEmit.React,
				baseUrl: ".",
				importHelpers: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true,
				sourceMap: true,
				inlineSources: true,
			},
			errors: [],
		});
	});
	it("Should generate recommended tsconfig.json file (with forced language level: es2015)", () => {
		const testDir = getTempDir();
		const fuse = FuseBox.init({
			target: "browser@es2015",
			homeDir: testDir,
			sourceMaps: true,
			log: false,
		});
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));
		const tsconfigFileName = path.resolve(testDir, "tsconfig.json");

		expect(fs.existsSync(tsconfigFileName)).toBeTruthy();
		expect(JSON.parse(fs.readFileSync(tsconfigFileName).toString())).toEqual({
			compilerOptions: {
				module: "CommonJS",
				target: "ES2015",
				jsx: "react",
				baseUrl: ".",
				importHelpers: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true,
				sourceMap: true,
				inlineSources: true,
			},
		});
		expect(config).toEqual({
			compilerOptions: {
				module: ts.ModuleKind.CommonJS,
				target: ts.ScriptTarget.ES2015,
				jsx: ts.JsxEmit.React,
				baseUrl: ".",
				importHelpers: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true,
				sourceMap: true,
				inlineSources: true,
			},
			errors: [],
		});
	});
	it("Should generate recommended tsconfig.json file (with forced language level: 2)", () => {
		const testDir = getTempDir();
		const fuse = FuseBox.init({
			target: "browser@2",
			homeDir: testDir,
			sourceMaps: true,
			log: false,
		});
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));
		const tsconfigFileName = path.resolve(testDir, "tsconfig.json");

		expect(fs.existsSync(tsconfigFileName)).toBeTruthy();
		expect(JSON.parse(fs.readFileSync(tsconfigFileName).toString())).toEqual({
			compilerOptions: {
				module: "CommonJS",
				target: "ES2015",
				jsx: "react",
				baseUrl: ".",
				importHelpers: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true,
				sourceMap: true,
				inlineSources: true,
			},
		});
		expect(config).toEqual({
			compilerOptions: {
				module: ts.ModuleKind.CommonJS,
				target: ts.ScriptTarget.ES2015,
				jsx: ts.JsxEmit.React,
				baseUrl: ".",
				importHelpers: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true,
				sourceMap: true,
				inlineSources: true,
			},
			errors: [],
		});
	});
	it("Should load tsconfig file with extends", () => {
		const testDir = getTempDir();
		const tsconfig1 = JSON.stringify({
			compilerOptions: {},
			extends: "./tsconfig2.json",
		});
		const tsconfig2 = JSON.stringify({
			compilerOptions: {
				target: "es3",
			},
		});

		fs.writeFileSync(path.resolve(testDir, "tsconfig1.json"), tsconfig1);
		fs.writeFileSync(path.resolve(testDir, "tsconfig2.json"), tsconfig2);

		const fuse = FuseBox.init({
			homeDir: testDir,
			sourceMaps: true,
			tsConfig: path.resolve(testDir, "tsconfig1.json"),
			log: false,
		});
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));

		delete config.wildcardDirectories;

		expect(config).toEqual({
			compilerOptions: {
				target: ts.ScriptTarget.ES3,
				module: ts.ModuleKind.CommonJS,
				sourceMap: true,
				inlineSources: true,
			},
			errors: [],
			compileOnSave: false,
			raw: {
				compilerOptions: {},
				extends: "./tsconfig2.json",
			},
			typeAcquisition: {
				enable: false,
				include: [],
				exclude: [],
			},
		});
	});
	it("Should load jsconfig file (set allowJs to true)", () => {
		const testDir = getTempDir();
		const jsconfig = JSON.stringify({
			compilerOptions: {},
		});

		fs.writeFileSync(path.resolve(testDir, "jsconfig.json"), jsconfig);

		const fuse = FuseBox.init({
			homeDir: testDir,
			sourceMaps: true,
			tsConfig: path.resolve(testDir, "jsconfig.json"),
			log: false,
		});
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));

		delete config.wildcardDirectories;

		expect(config).toEqual({
			compilerOptions: {
				target: ts.ScriptTarget.ES2018,
				module: ts.ModuleKind.CommonJS,
				sourceMap: true,
				inlineSources: true,
				allowJs: true,
			},
			errors: [],
			compileOnSave: false,
			raw: {
				compilerOptions: {},
			},
			typeAcquisition: {
				enable: false,
				include: [],
				exclude: [],
			},
		});
	});
	it("Should error when tsconfig doesn't exist", () => {
		const testDir = getTempDir();
		const fuse = FuseBox.init({
			homeDir: testDir,
			sourceMaps: true,
			ensureTsConfig: false,
			tsConfig: path.resolve(testDir, "tsconfig.json"),
			log: false,
		});

		const config = fuse.context.tsConfig.readJsonConfigFile();
		expect(config.errors.length).toEqual(1);
		expect(config.errors[0].category).toEqual(ts.DiagnosticCategory.Error);
		expect(config.errors[0].code).toEqual(5058 /** The specified path does not exist */);
	});
	it("Should error when tsconfig contains syntax errors", () => {
		const testDir = getTempDir();
		const tsconfig = `
			{
				compilerOptions: {
					target: "es5 // comments
			}
		`;

		fs.writeFileSync(path.resolve(testDir, "tsconfig.json"), tsconfig);

		const fuse = FuseBox.init({ homeDir: testDir, log: false });
		const config = fuse.context.tsConfig.readJsonConfigFile();
		expect(config.errors.length).toEqual(1);
		expect(config.errors[0].category).toEqual(ts.DiagnosticCategory.Error);
		expect(config.errors[0].code).toEqual(1002 /** Unterminated string literal */);
	});
	it("Should error when tsconfig contains invalid options", () => {
		const testDir = getTempDir();
		const tsconfig = JSON.stringify({
			compilerOptions: {
				target: "es3000",
				jsx: "inferno",
			},
		});

		fs.writeFileSync(path.resolve(testDir, "tsconfig.json"), tsconfig);

		const fuse = FuseBox.init({ homeDir: testDir, log: false });
		const config = fuse.context.tsConfig.readJsonConfigFile();
		expect(config.errors.length).toEqual(2);
		expect(config.errors[0].category).toEqual(ts.DiagnosticCategory.Error);
		expect(config.errors[1].category).toEqual(ts.DiagnosticCategory.Error);
		expect(config.errors[0].messageText).toContain("--target");
		expect(config.errors[1].messageText).toContain("--jsx");
	});
});
