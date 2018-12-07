import * as escodegen from "escodegen";
import * as path from "path";
import { acornParse } from "../../analysis/FileAnalysis";
import { ASTTraverse } from "../../ASTTraverse";
import { File } from "../../core/File";
import { Concat, ensureFuseBoxPath, transpileToEs5 } from "../../Utils";
import { QuantumBit } from "../plugin/QuantumBit";
import { QuantumCore } from "../plugin/QuantumCore";
import {
	compareStatement,
	isExportComputed,
	isExportMisused,
	isTrueRequireFunction,
	matcheObjectDefineProperty,
	matchesAssignmentExpression,
	matchesDefinedExpression,
	matchesDoubleMemberExpression,
	matchesEcmaScript6,
	matchesGlobalVariable,
	matchesGlobalVariableReference,
	matchesIfStatementFuseBoxIsEnvironment,
	matchesIfStatementProcessEnv,
	matchesLiteralStringExpression,
	matchesNodeEnv,
	matchesSingleFunction,
	matchesTypeOf,
	matchesVariableDeclarator,
	matchNamedExport,
	matchRequireIdentifier,
	trackRequireMember,
	matchesExportReference,
} from "./AstUtils";
import { ExportsInterop } from "./nodes/ExportsInterop";
import { GenericAst } from "./nodes/GenericAst";
import { NamedExport } from "./nodes/NamedExport";
import { ReplaceableBlock } from "./nodes/ReplaceableBlock";
import { RequireStatement } from "./nodes/RequireStatement";
import { TypeOfExportsKeyword } from "./nodes/TypeOfExportsKeyword";
import { TypeOfModuleKeyword } from "./nodes/TypeOfModuleKeyword";
import { TypeOfWindowKeyword } from "./nodes/TypeOfWindowKeyword";
import { UseStrict } from "./nodes/UseStrict";
import { PackageAbstraction } from "./PackageAbstraction";
import { QuantumSourceMap } from "./QuantumSourceMap";

const globalNames = new Set<string>(["__filename", "__dirname", "exports", "module"]);

const SystemVars = new Set<string>(["module", "exports", "require", "window", "global"]);

export class FileAbstraction {
	public dependents = new Set<FileAbstraction>();
	public ast: any;
	public fuseBoxDir;

	public referencedRequireStatements: Set<RequireStatement>;
	public namedRequireStatements: Map<string, RequireStatement>;
	public requireStatements: Set<RequireStatement>;
	public dynamicImportStatements: Set<RequireStatement>;
	public fuseboxIsEnvConditions: Set<ReplaceableBlock>;
	public definedLocally: Set<string>;
	public exportsInterop: Set<ExportsInterop>;
	public useStrict: Set<UseStrict>;
	public typeofExportsKeywords: Set<TypeOfExportsKeyword>;
	public typeofModulesKeywords: Set<TypeOfModuleKeyword>;
	public typeofWindowKeywords: Set<TypeOfWindowKeyword>;
	public typeofGlobalKeywords: Set<GenericAst>;
	public typeofDefineKeywords: Set<GenericAst>;
	public typeofRequireKeywords: Set<GenericAst>;
	public localExportUsageAmount: Map<string, number>;
	private globalVariables: Set<string>;
	private dependencies: Map<FileAbstraction, Set<RequireStatement>>;
	public namedExports: Map<string, NamedExport>;
	public processNodeEnv: Set<ReplaceableBlock>;

	public isEcmaScript6 = false;
	public shakable = false;
	public amountOfReferences = 0;
	public canBeRemoved = false;

	public quantumBitEntry = false;
	public quantumBitBanned = false;
	public quantumDynamic = false;

	public quantumBit: QuantumBit;

	/** FILE CONTENTS */

	public globalProcess: Set<GenericAst>;
	public globalProcessVersion: Set<GenericAst>;
	public processVariableDefined: boolean;
	public core: QuantumCore;

	public isEntryPoint = false;

	public wrapperArguments: string[];

	private id: string;
	private treeShakingRestricted = false;
	private removalRestricted = false;

	public renderedHeaders: string[];

	constructor(public fuseBoxPath: string, public packageAbstraction: PackageAbstraction) {
		this.referencedRequireStatements = new Set<RequireStatement>();
		this.namedRequireStatements = new Map<string, RequireStatement>();
		this.requireStatements = new Set<RequireStatement>();
		this.dynamicImportStatements = new Set<RequireStatement>();
		this.fuseboxIsEnvConditions = new Set<ReplaceableBlock>();
		this.definedLocally = new Set<string>();
		this.exportsInterop = new Set<ExportsInterop>();
		this.useStrict = new Set<UseStrict>();
		this.typeofExportsKeywords = new Set<TypeOfExportsKeyword>();
		this.typeofModulesKeywords = new Set<TypeOfModuleKeyword>();
		this.typeofWindowKeywords = new Set<TypeOfWindowKeyword>();
		this.typeofGlobalKeywords = new Set<GenericAst>();
		this.typeofDefineKeywords = new Set<GenericAst>();
		this.typeofRequireKeywords = new Set<GenericAst>();
		this.localExportUsageAmount = new Map<string, number>();
		this.globalVariables = new Set<string>();
		this.dependencies = new Map<FileAbstraction, Set<RequireStatement>>();
		this.namedExports = new Map<string, NamedExport>();
		this.processNodeEnv = new Set<ReplaceableBlock>();

		this.fuseBoxDir = ensureFuseBoxPath(path.dirname(fuseBoxPath));
		this.setID(fuseBoxPath);
		this.globalProcess = new Set();
		this.renderedHeaders = [];
		this.globalProcessVersion = new Set();
		this.processVariableDefined = false;
		packageAbstraction.registerFileAbstraction(this);
		this.core = this.packageAbstraction.bundleAbstraction.producerAbstraction.quantumCore;

		// removing process polyfill if not required
		// techincally this is not necessary when tree shaking is enable. Because of:
		// StatementModification.ts lines:
		// if (resolvedFile.isProcessPolyfill() && !core.opts.shouldBundleProcessPolyfill()) {
		//   return statement.removeWithIdentifier();
		// }
		// Which doesn't add the references
		if (this.core && !this.core.opts.shouldBundleProcessPolyfill() && this.isProcessPolyfill()) {
			this.markForRemoval();
		}
	}

	public isProcessPolyfill() {
		return this.getFuseBoxFullPath() === "process/index.js";
	}

	public registerHoistedIdentifiers(identifier: string, statement: RequireStatement, resolvedFile: FileAbstraction) {
		const bundle = this.packageAbstraction.bundleAbstraction;
		bundle.registerHoistedIdentifiers(identifier, statement, resolvedFile);
	}

	public getFuseBoxFullPath() {
		return `${this.packageAbstraction.name}/${this.fuseBoxPath}`;
	}

	public isNotUsedAnywhere() {
		let entryPointForQuantumBit = false;
		if (this.quantumBit) {
			if (this.quantumBit.entry.getFuseBoxFullPath() === this.getFuseBoxFullPath()) {
				entryPointForQuantumBit = true;
			}
		}
		return (
			this.getID().toString() !== "0" && this.dependents.size === 0 && !entryPointForQuantumBit && !this.isEntryPoint
		);
	}

	public releaseDependent(file: FileAbstraction) {
		this.dependents.delete(file);
	}
	public markForRemoval() {
		this.canBeRemoved = true;
	}
	/**
	 * Initiates an abstraction from string
	 */
	public loadString(contents: string) {
		this.ast = acornParse(contents);
		this.analyse();
	}

	public setID(id: any) {
		this.id = id;
	}

	public belongsToProject() {
		return this.core.context.defaultPackageName === this.packageAbstraction.name;
	}

	public belongsToExternalModule() {
		return !this.belongsToProject();
	}
	public getID() {
		return this.id;
	}

	public isTreeShakingAllowed() {
		return this.treeShakingRestricted === false && this.shakable;
	}

	public restrictRemoval() {
		this.removalRestricted = true;
	}

	public isRemovalAllowed() {
		return this.removalRestricted === false;
	}

	public restrictTreeShaking() {
		this.treeShakingRestricted = true;
	}

	public addDependency(file: FileAbstraction, statement: RequireStatement) {
		let list: Set<RequireStatement>;
		if (this.dependencies.has(file)) {
			list = this.dependencies.get(file);
		} else {
			list = new Set<RequireStatement>();
			this.dependencies.set(file, list);
		}
		list.add(statement);
	}

	public getDependencies() {
		return this.dependencies;
	}
	/**
	 * Initiates with AST
	 */
	public loadAst(ast: any) {
		// fix the initial node
		ast.type = "Program";
		this.ast = ast;
		this.analyse();
	}

	/**
	 * Finds require statements with given mask
	 */
	public findRequireStatements(exp: RegExp): RequireStatement[] {
		const list: RequireStatement[] = [];
		this.requireStatements.forEach(statement => {
			if (exp.test(statement.value)) {
				list.push(statement);
			}
		});
		return list;
	}

	public wrapWithFunction(args: string[]) {
		this.wrapperArguments = args;
	}

	/**
	 * Return true if there is even a single require statement
	 */
	public isRequireStatementUsed() {
		return this.requireStatements.size > 0;
	}

	public isDynamicStatementUsed() {
		let used = false;
		this.requireStatements.forEach(statement => {
			if (statement.isDynamicImport) {
				used = true;
			}
		});
		return used;
	}

	public isDirnameUsed() {
		return this.globalVariables.has("__dirname");
	}

	public isFilenameUsed() {
		return this.globalVariables.has("__filename");
	}

	public isExportStatementInUse() {
		return this.globalVariables.has("exports");
	}

	public isModuleStatementInUse() {
		return this.globalVariables.has("module");
	}
	public isExportInUse() {
		return this.globalVariables.has("exports") || this.globalVariables.has("module");
	}

	public setEntryPoint() {
		this.isEntryPoint = true;
		this.treeShakingRestricted = true;
	}

	public async getGeneratedCode() {
		const cnt = await this.generate();
		return cnt.content.toString();
	}

	public async generate(ensureEs5: boolean = false): Promise<Concat> {
		const producer = this.core && this.core.producer;
		let sourceMap;
		let originalFile: File;
		const escodegenOpts: any = {};
		if (producer) {
			originalFile = this.core.originalFiles.get(this.getFuseBoxFullPath());
		}
		// dealing not with original file

		let code = escodegen.generate(this.ast, escodegenOpts);
		if (ensureEs5 && this.isEcmaScript6) {
			code = transpileToEs5(code);
		}

		if (this.core && this.core.context.useSourceMaps) {
			if (originalFile && originalFile.sourceMap) {
				this.core.log.echoInfo(`SourceMaps: Blending project file ${originalFile.info.fuseBoxPath}`);
				sourceMap = await QuantumSourceMap.generateOriginalSourceMap(originalFile, code);
			} else {
				if (this.core.opts.shouldGenerateVendorSourceMaps()) {
					const vendorPath = `modules/${this.getFuseBoxFullPath()}`;
					this.core.log.echoInfo(`SourceMaps: Generating ${vendorPath}`);
					sourceMap = QuantumSourceMap.generateSourceMap(code, vendorPath);
				}
			}
		}

		const fn = new Concat(true, this.getFuseBoxFullPath(), "\n");
		fn.add(null, ["function(", this.wrapperArguments ? this.wrapperArguments.join(",") : "", "){"].join(""));

		if (this.isDirnameUsed()) {
			fn.add(null, `var __dirname = ${JSON.stringify(this.fuseBoxDir)};`);
		}
		if (this.renderedHeaders.length) {
			fn.add(null, this.renderedHeaders.join("\n"));
		}
		if (this.isFilenameUsed()) {
			fn.add(null, `var __filename = ${JSON.stringify(this.fuseBoxPath)};`);
		}
		fn.add(null, code, sourceMap);
		fn.add(null, "}");

		return fn;
	}

	/**
	 *
	 * @param node
	 * @param parent
	 * @param prop
	 * @param idx
	 */
	private onNode(node, parent, prop, idx) {
		// process.env

		if (this.core) {
			if (this.core.opts.definedExpressions) {
				const matchedExpression = matchesDefinedExpression(node, this.core.opts.definedExpressions);
				if (matchedExpression) {
					if (matchedExpression.isConditional) {
						const result = compareStatement(node, matchedExpression.value);
						const block = new ReplaceableBlock(node.test, "left", node.test.left);
						this.processNodeEnv.add(block);
						return block.conditionalAnalysis(node, result);
					} else {
						const block = new ReplaceableBlock(parent, prop, node);
						if (block === undefined) {
							block.setUndefinedValue();
						} else {
							block.setValue(matchedExpression.value);
						}
						this.processNodeEnv.add(block);
					}
				}
			}
			const processKeyInIfStatement = matchesIfStatementProcessEnv(node);
			const value = this.core.producer.userEnvVariables[processKeyInIfStatement];
			if (processKeyInIfStatement) {
				const result = compareStatement(node, value);
				const processNode = new ReplaceableBlock(node.test, "left", node.test.left);
				this.processNodeEnv.add(processNode);
				return processNode.conditionalAnalysis(node, result);
			} else {
				const inlineProcessKey = matchesNodeEnv(node);
				if (inlineProcessKey) {
					const value = this.core.producer.userEnvVariables[inlineProcessKey];
					const env = new ReplaceableBlock(parent, prop, node);
					value === undefined ? env.setUndefinedValue() : env.setValue(value);
					this.processNodeEnv.add(env);
				}
			}

			const isEnvName = matchesIfStatementFuseBoxIsEnvironment(node);
			if (isEnvName) {
				let value;
				if (isEnvName === "isServer") {
					value = this.core.opts.isTargetServer();
				}
				if (isEnvName === "isBrowser") {
					value = this.core.opts.isTargetBrowser();
				}

				if (isEnvName === "target") {
					value = this.core.opts.getTarget();
				}
				if (!this.core.opts.isTargetUniveral()) {
					const isEnvNode = new ReplaceableBlock(node, "", node.test);
					isEnvNode.identifier = isEnvName;
					this.fuseboxIsEnvConditions.add(isEnvNode);
					return isEnvNode.conditionalAnalysis(node, value);
				}
			}
			if (matchesDoubleMemberExpression(node, "FuseBox")) {
				let envName = node.property.name;
				if (envName === "isServer" || envName === "isBrowser" || envName === "target") {
					let value;
					if (envName === "isServer") {
						value = this.core.opts.isTargetServer();
					}
					if (envName === "isBrowser") {
						value = this.core.opts.isTargetBrowser();
					}
					if (envName === "target") {
						value = this.core.opts.getTarget();
					}
					const envNode = new ReplaceableBlock(parent, prop, node);
					envNode.identifier = envName;
					envNode.setValue(value);
					this.fuseboxIsEnvConditions.add(envNode);
				}
			}
		}

		if (matchesGlobalVariable(node, "process")) {
			this.globalProcess.add(new GenericAst(parent, prop, node));
		}
		if (matchesGlobalVariableReference(node, "process.version")) {
			this.globalProcessVersion.add(new GenericAst(parent, prop, node));
		}
		if (matchesVariableDeclarator(node, "process")) {
			this.processVariableDefined = true;
		}
		// detecting es6
		if (matchesEcmaScript6(node)) {
			this.isEcmaScript6 = true;
		}
		this.namedRequireStatements.forEach((statement, key) => {
			const importedName = trackRequireMember(node, key);
			if (importedName) {
				statement.localReferences++;
				statement.usedNames.add(importedName);
			}
		});
		// restrict tree shaking if there is even a hint on computed properties
		isExportComputed(node, isComputed => {
			if (isComputed) {
				this.restrictTreeShaking();
			}
		});
		// trying to match a case where an export is misused
		// for example exports.foo.bar.prototype
		// we can't tree shake this exports
		isExportMisused(node, name => {
			const createdExports = this.namedExports.get(name);
			if (createdExports) {
				createdExports.eligibleForTreeShaking = false;
			}
		});

		/**
		 * Matching how many times an export has been used within one file
		 * For example
		 * exports.createAction = () => {
		 *   return exports.createSomething();
		 * }
		 * exports.createSomething = () => {}
		 * The example above creates a conflicting situation if createSomething wasn't used externally
		 */
		const matchesExportIdentifier = matchesExportReference(node);
		if (matchesExportIdentifier) {
			let ref = this.localExportUsageAmount.get(matchesExportIdentifier);
			if (ref === undefined) {
				this.localExportUsageAmount.set(matchesExportIdentifier, 1);
			} else {
				this.localExportUsageAmount.set(matchesExportIdentifier, ++ref);
			}
		}
		matchNamedExport(node, (name, referencedVariableName) => {
			// const namedExport = new NamedExport(parent, prop, node);
			// namedExport.name = name;
			// this.namedExports.set(name, namedExport);

			let namedExport: NamedExport;
			//namedExport.name = name;
			if (!this.namedExports.get(name)) {
				namedExport = new NamedExport();
				namedExport.name = name;
				this.namedExports.set(name, namedExport);
			} else {
				namedExport = this.namedExports.get(name);
			}

			namedExport.addNode(parent, prop, node, referencedVariableName);
		});
		// handles a case where require is being used without arguments
		// e.g const req = require
		// should replace it to:
		// const req = $fsx
		if (isTrueRequireFunction(node)) {
			node.name = this.core.opts.quantumVariableName;
		}
		// require statements
		if (matchesSingleFunction(node, "require")) {
			// adding a require statement
			this.requireStatements.add(new RequireStatement(this, node));
		}
		// Fusebox converts new imports to $fsmp$
		if (matchesSingleFunction(node, "$fsmp$")) {
			const reqStatement = new RequireStatement(this, node);
			reqStatement.isDynamicImport = true;
			// adding a require statement
			this.dynamicImportStatements.add(reqStatement);
		}

		// typeof module
		if (matchesTypeOf(node, "module")) {
			this.typeofModulesKeywords.add(new TypeOfModuleKeyword(parent, prop, node));
		}

		if (matchesTypeOf(node, "require")) {
			this.typeofRequireKeywords.add(new GenericAst(parent, prop, node));
		}

		// Object.defineProperty(exports, '__esModule', { value: true });
		if (matcheObjectDefineProperty(node, "exports")) {
			if (!this.globalVariables.has("exports")) {
				this.globalVariables.add("exports");
			}
			this.exportsInterop.add(new ExportsInterop(parent, prop, node));
		}
		if (matchesAssignmentExpression(node, "exports", "__esModule")) {
			if (!this.globalVariables.has("exports")) {
				this.globalVariables.add("exports");
			}
			this.exportsInterop.add(new ExportsInterop(parent, prop, node));
		}

		if (matchesTypeOf(node, "exports")) {
			this.typeofExportsKeywords.add(new TypeOfExportsKeyword(parent, prop, node));
		}
		if (matchesLiteralStringExpression(node, "use strict")) {
			this.useStrict.add(new UseStrict(parent, prop, node));
		}

		if (matchesTypeOf(node, "global")) {
			this.typeofGlobalKeywords.add(new GenericAst(parent, prop, node));
		}
		if (matchesTypeOf(node, "define")) {
			this.typeofDefineKeywords.add(new GenericAst(parent, prop, node));
		}

		// typeof window
		if (matchesTypeOf(node, "window")) {
			this.typeofWindowKeywords.add(new GenericAst(parent, prop, node));
		}

		/**
		 * Matching
		 * var name = require('module')
		 * Gethering identifiers name to do:
		 * 1) Hoisting
		 * 2) Detect which variables are used in exports to do tree shaking later on
		 */
		const requireIdentifier = matchRequireIdentifier(node);
		if (requireIdentifier) {
			const identifiedRequireStatement = new RequireStatement(this, node.init, node);
			identifiedRequireStatement.identifier = requireIdentifier;
			this.namedRequireStatements.set(requireIdentifier, identifiedRequireStatement);
			this.requireStatements.add(identifiedRequireStatement);
			return false;
		}

		// FuseBox features
		if (matchesDoubleMemberExpression(node, "FuseBox")) {
			if (node.property.name === "import") {
				// replace it right away with require statement
				parent.callee = {
					type: "Identifier",
					name: "require",
				};
				// treat it like any any other require statements
				this.requireStatements.add(new RequireStatement(this, parent, parent.$parent));
			}

			return false;
		}
		// global vars
		if (node && node.type === "Identifier") {
			let globalVariable;
			if (globalNames.has(node.name)) {
				globalVariable = node.name;
			}
			if (node.name === "global") {
				this.packageAbstraction.bundleAbstraction.globalVariableRequired = true;
			}
			this.detectLocallyDefinedSystemVariables(node);

			if (globalVariable) {
				if (!this.globalVariables.has(globalVariable)) {
					this.globalVariables.add(globalVariable);
				}
			}
		}
	}

	private detectLocallyDefinedSystemVariables(node: any) {
		let definedName;
		// detecting if the Indentifer is in SystemVars (module, exports, require e.tc)
		if (SystemVars.has(node.name)) {
			// if it's define within a local function
			if (node.$prop === "params") {
				if (node.$parent && node.$parent.type === "FunctionDeclaration") {
					definedName = node.name;
				}
			}
			// if it's a variable declaration
			// var module = 1;
			if (node.$prop === "id") {
				if (node.$parent && node.$parent.type == "VariableDeclarator") {
					definedName = node.name;
				}
			}
		}

		if (definedName) {
			if (!this.definedLocally.has(definedName)) {
				this.definedLocally.add(definedName);
			}
		}
	}

	public analyse() {
		// console.log(JSON.stringify(this.ast, null, 2));
		ASTTraverse.traverse(this.ast, {
			pre: (node, parent, prop, idx) => this.onNode(node, parent, prop, idx),
		});
	}
}
