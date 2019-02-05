import { should } from "fuse-test-runner";
import * as path from "path";
import * as fs from "fs";
import { FuseBox } from "../index";
import { getScriptLevelNumber, getScriptLevelString } from "../core/TypescriptConfig";
import * as appRoot from "app-root-path";
import * as fsExtra from "fs-extra";
import * as ts from "typescript";

const getTempDir = () => {
	const name = `test-tsconfig-${new Date().getTime()}`;
	let tmpFolder = path.join(appRoot.path, ".fusebox", "tests", name);
	fsExtra.ensureDirSync(tmpFolder);
	return tmpFolder;
};

export class TypescriptConfigTest {
	"Should get number language level (level: 'es5' -> 1)"() {
		should(getScriptLevelNumber("Es5")).equal(ts.ScriptTarget.ES5);
	}
	"Should get number language level (level: 1 -> 1)"() {
		should(getScriptLevelNumber(ts.ScriptTarget.ES5)).equal(ts.ScriptTarget.ES5);
	}
	"Should get number language level (level: 'esnext' -> 6)"() {
		should(getScriptLevelNumber("esnext")).equal(ts.ScriptTarget.ESNext);
	}
	"Should get number language level (level: 6 -> 6)"() {
		should(getScriptLevelNumber(ts.ScriptTarget.ESNext)).equal(ts.ScriptTarget.ESNext);
	}
	"Should get number language level (level: 'json' -> undefined)"() {
		should(getScriptLevelNumber(ts.ScriptTarget.JSON)).equal(undefined);
	}
	"Should get number language level (level: unknown -> undefined)"() {
		should(getScriptLevelNumber("asd")).equal(undefined);
	}
	"Should get string language level (level: 1 -> 'ES5')"() {
		should(getScriptLevelString(ts.ScriptTarget.ES5)).equal("ES5");
	}
	"Should get string language level (level: 6 -> 'ESNext')"() {
		should(getScriptLevelString(ts.ScriptTarget.ESNext)).equal("ESNext");
	}
	"Should get string language level (level: 100 [JSON] -> undefined)"() {
		should(getScriptLevelString(ts.ScriptTarget.JSON)).equal(undefined);
	}

	"Should generate recommended tsconfig.json file"() {
		const testDir = getTempDir();
		const fuse = FuseBox.init({ homeDir: testDir, log: false });
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));
		const tsconfigFileName = path.resolve(testDir, "tsconfig.json");

		should(fs.existsSync(tsconfigFileName)).beTrue();
		should(JSON.parse(fs.readFileSync(tsconfigFileName).toString())).deepEqual({
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
		should(config).deepEqual({
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
	}
	"Should generate recommended tsconfig.json file (with source maps)"() {
		const testDir = getTempDir();
		const fuse = FuseBox.init({
			homeDir: testDir,
			sourceMaps: true,
			log: false,
		});
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));
		const tsconfigFileName = path.resolve(testDir, "tsconfig.json");

		should(fs.existsSync(tsconfigFileName)).beTrue();
		should(JSON.parse(fs.readFileSync(tsconfigFileName).toString())).deepEqual({
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
		should(config).deepEqual({
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
	}
	"Should generate recommended tsconfig.json file (with forced language level: esnext)"() {
		const testDir = getTempDir();
		const fuse = FuseBox.init({
			target: "browser@esnext",
			homeDir: testDir,
			sourceMaps: true,
			log: false,
		});
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));
		const tsconfigFileName = path.resolve(testDir, "tsconfig.json");

		should(fs.existsSync(tsconfigFileName)).beTrue();
		should(JSON.parse(fs.readFileSync(tsconfigFileName).toString())).deepEqual({
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
		should(config).deepEqual({
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
	}
	"Should generate recommended tsconfig.json file (with forced language level: es2015)"() {
		const testDir = getTempDir();
		const fuse = FuseBox.init({
			target: "browser@es2015",
			homeDir: testDir,
			sourceMaps: true,
			log: false,
		});
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));
		const tsconfigFileName = path.resolve(testDir, "tsconfig.json");

		should(fs.existsSync(tsconfigFileName)).beTrue();
		should(JSON.parse(fs.readFileSync(tsconfigFileName).toString())).deepEqual({
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
		should(config).deepEqual({
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
	}
	"Should generate recommended tsconfig.json file (with forced language level: 2)"() {
		const testDir = getTempDir();
		const fuse = FuseBox.init({
			target: "browser@2",
			homeDir: testDir,
			sourceMaps: true,
			log: false,
		});
		const config = JSON.parse(JSON.stringify(fuse.context.tsConfig.getConfig()));
		const tsconfigFileName = path.resolve(testDir, "tsconfig.json");

		should(fs.existsSync(tsconfigFileName)).beTrue();
		should(JSON.parse(fs.readFileSync(tsconfigFileName).toString())).deepEqual({
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
		should(config).deepEqual({
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
	}
	"Should load tsconfig file with extends"() {
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

		should(config).deepEqual({
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
	}
	"Should load jsconfig file (set allowJs to true)"() {
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

		should(config).deepEqual({
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
	}
	"Should error when tsconfig doesn't exist"() {
		const testDir = getTempDir();
		const fuse = FuseBox.init({
			homeDir: testDir,
			sourceMaps: true,
			ensureTsConfig: false,
			tsConfig: path.resolve(testDir, "tsconfig.json"),
			log: false,
		});

		const config = fuse.context.tsConfig.readJsonConfigFile();
		should(config.errors.length).equal(1);
		should(config.errors[0].category).equal(ts.DiagnosticCategory.Error);
		should(config.errors[0].code).equal(5058 /** The specified path does not exist */);
	}
	"Should error when tsconfig contains syntax errors"() {
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
		should(config.errors.length).equal(1);
		should(config.errors[0].category).equal(ts.DiagnosticCategory.Error);
		should(config.errors[0].code).equal(1002 /** Unterminated string literal */);
	}
	"Should error when tsconfig contains invalid options"() {
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
		should(config.errors.length).equal(2);
		should(config.errors[0].category).equal(ts.DiagnosticCategory.Error);
		should(config.errors[1].category).equal(ts.DiagnosticCategory.Error);
		should(config.errors[0].messageText).findString("--target");
		should(config.errors[1].messageText).findString("--jsx");
	}
}
