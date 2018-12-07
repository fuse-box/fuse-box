import { each } from "realm-utils";
import { Bundle } from "../../core/Bundle";
import { BundleProducer } from "../../core/BundleProducer";
import { File } from "../../core/File";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { Log } from "../../Log";
import { string2RegExp } from "../../Utils";
import { BundleAbstraction } from "../core/BundleAbstraction";
import { CSSCollection } from "../core/CSSCollection";
import { FileAbstraction } from "../core/FileAbstraction";
import { RequireStatement } from "../core/nodes/RequireStatement";
import { PackageAbstraction } from "../core/PackageAbstraction";
import { ProducerAbstraction } from "../core/ProducerAbstraction";
import { QuantumTask } from "../core/QuantumTask";
import { BundleWriter } from "./BundleWriter";
import { ComputedStatementRule } from "./ComputerStatementRule";
import { FlatFileGenerator } from "./FlatFileGenerator";
import { Hoisting } from "./Hoisting";
import { CSSModifications } from "./modifications/CSSModifications";
import { DynamicImportStatementsModifications } from "./modifications/DynamicImportStatements";
import { EnvironmentConditionModification } from "./modifications/EnvironmentConditionModification";
import { GlobalProcessReplacement } from "./modifications/GlobalProcessReplacement";
import { GlobalProcessVersionReplacement } from "./modifications/GlobalProcessVersionReplacement";
import { InteropModifications } from "./modifications/InteropModifications";
import { IPerformable } from "./modifications/IPerformable";
import { ProcessEnvModification } from "./modifications/ProcessEnvModification";
import { StatementModification } from "./modifications/StatementModifaction";
import { TypeOfModifications } from "./modifications/TypeOfModifications";
import { UseStrictModification } from "./modifications/UseStrictModification";
import { QuantumBit } from "./QuantumBit";
import { QuantumOptions } from "./QuantumOptions";
import { ResponsiveAPI } from "./ResponsiveAPI";
import { TreeShake } from "./TreeShake";

export interface QuantumStatementMapping {
	statement: RequireStatement;
	core: QuantumCore;
}
export class QuantumCore {
	public producerAbstraction: ProducerAbstraction;
	public api: ResponsiveAPI;
	public index = 0;
	public postTasks: QuantumTask;
	public log: Log;
	public opts: QuantumOptions;
	public cssCollection: Map<string, CSSCollection>;
	public writer: BundleWriter;
	public context: WorkFlowContext;
	public requiredMappings: Set<RegExp>;
	public quantumBits: Map<string, QuantumBit>;
	public customStatementSolutions: Set<RegExp>;
	public computedStatementRules: Map<string, ComputedStatementRule>;
	public splitFiles: Set<FileAbstraction>;
	public originalFiles: Map<string, File>;

	constructor(public producer: BundleProducer, opts: QuantumOptions) {
		this.opts = opts;
		this.cssCollection = new Map<string, CSSCollection>();
		this.writer = new BundleWriter(this);
		this.postTasks = new QuantumTask(this);
		this.api = new ResponsiveAPI(this);
		this.originalFiles = new Map<string, File>();
		this.customStatementSolutions = new Set<RegExp>();
		this.computedStatementRules = new Map<string, ComputedStatementRule>();
		this.requiredMappings = new Set<RegExp>();
		this.splitFiles = new Set<FileAbstraction>();
		this.quantumBits = new Map<string, QuantumBit>();

		this.log = producer.fuse.context.log;
		this.log.echoBreak();
		this.log.groupHeader("Launching quantum core");
		if (this.opts.apiCallback) {
			this.opts.apiCallback(this);
		}
		this.context = this.producer.fuse.context;

		if (producer) {
			producer.defaultCollection.dependencies.forEach(item => {
				this.originalFiles.set(item.getUniquePath(), item);
			});
		}
	}

	public solveComputed(
		path: string,
		rules?: { mapping: string; fn: { (statement: RequireStatement, core: QuantumCore): void } },
	) {
		this.customStatementSolutions.add(string2RegExp(path));
		if (rules && rules.mapping) {
			this.requiredMappings.add(string2RegExp(rules.mapping));
		}
		this.computedStatementRules.set(path, new ComputedStatementRule(path, rules));
	}

	public getCustomSolution(file: FileAbstraction): ComputedStatementRule {
		let fullPath = file.getFuseBoxFullPath();
		let computedRule = this.computedStatementRules.get(fullPath);
		if (computedRule) {
			return computedRule;
		}
	}

	public async consume() {
		this.log.echoInfo("Generating abstraction, this may take a while");
		const abstraction = await this.producer.generateAbstraction({
			quantumCore: this,
			customComputedStatementPaths: this.customStatementSolutions,
		});
		abstraction.quantumCore = this;
		this.producerAbstraction = abstraction;
		this.log.echoInfo("Abstraction generated");
		await each(abstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction) => {
			return this.prepareFiles(bundleAbstraction);
		});

		await each(abstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction) => {
			return this.processBundle(bundleAbstraction);
		});

		await this.postTasks.execute();

		await this.prepareQuantumBits();
		await this.treeShake();
		await this.processCSS();
		// make sure additional tasks are executed after the css is removed
		await this.postTasks.execute();

		await this.render();
		this.compriseAPI();
		await this.writer.process();

		this.printStat();
	}

	private ensureBitBundle(bit: QuantumBit) {
		let bundle: Bundle = this.producer.bundles.get(bit.name);
		if (!bundle) {
			this.log.echoInfo(`Create split bundle ${bit.name} with entry point ${bit.entry.getFuseBoxFullPath()}`);
			const fusebox = this.context.fuse.copy();
			bundle = new Bundle(bit.getBundleName(), fusebox, this.producer);
			bundle.quantumBit = bit;

			//bundle.context = this.producer.fuse.context;
			this.producer.bundles.set(bit.name, bundle);
			// don't allow WebIndexPlugin to include it to script tags
			bundle.webIndexed = false;
			// set the reference
			//bundle.quantumItem = quantumItem;
			// bundle abtraction needs to be created to have an isolated scope for hoisting
			const bnd = new BundleAbstraction(bit.name);
			bnd.splitAbstraction = true;

			let pkg = new PackageAbstraction(bit.entry.packageAbstraction.name, bnd);
			this.producerAbstraction.registerBundleAbstraction(bnd);
			bundle.bundleAbstraction = bnd;
			bundle.packageAbstraction = pkg;
		} else {
			bundle = this.producer.bundles.get(bit.name);
		}
		return bundle;
	}

	private async prepareQuantumBits() {
		this.context.quantumBits = this.quantumBits;
		this.quantumBits.forEach(bit => {
			bit.resolve();
		});

		await each(this.quantumBits, async (bit: QuantumBit, key: string) => {
			bit.populate();
			// check if there is an entry point which was banned
			bit.files.forEach(file => {
				if (file.quantumBitEntry && file.quantumBitBanned) {
					bit.banned = true;
				}
			});
			if (bit.banned) {
				this.log.echoInfo(`QuantumBit: Ignoring import of ${bit.entry.getFuseBoxFullPath()}`);
				return;
			}

			let bundle = this.ensureBitBundle(bit);
			bit.files.forEach(file => {
				this.log.echoInfo(`QuantumBit: Adding ${file.getFuseBoxFullPath()} to ${bit.name}`);
				// removing the file from the current package
				file.packageAbstraction.fileAbstractions.delete(file.fuseBoxPath);

				bundle.packageAbstraction.registerFileAbstraction(file);
				// add it to an additional list
				// we need to modify it later on, cuz of the loop we are in
				file.packageAbstraction = bundle.packageAbstraction;
			});

			bit.modules.forEach(pkg => {
				this.log.echoInfo(`QuantumBit: Moving module ${pkg.name} from ${pkg.bundleAbstraction.name} to ${bit.name}`);
				const bundleAbstraction = bundle.bundleAbstraction;
				pkg.assignBundle(bundleAbstraction);
			});
		});
	}
	private printStat() {
		if (this.opts.shouldShowWarnings()) {
			this.producerAbstraction.warnings.forEach(warning => {
				this.log.echoBreak();
				this.log.echoYellow("Warnings:");
				this.log.echoYellow("Your quantum bundle might not work");
				this.log.echoYellow(`  - ${warning.msg}`);
				this.log.echoGray("");
				this.log.echoGray("  * Set { warnings : false } if you want to hide these messages");
				this.log.echoGray(
					"  * Read up on the subject https://fuse-box.org/docs/production-builds/quantum-configuration#computed-statement-resolution",
				);
			});
		}
	}

	public compriseAPI() {
		if (this.producerAbstraction.useComputedRequireStatements) {
			this.api.addComputedRequireStatetements();
		}
	}

	public handleMappings(fuseBoxFullPath: string, id: any) {
		this.requiredMappings.forEach(regexp => {
			if (regexp.test(fuseBoxFullPath)) {
				this.api.addMapping(fuseBoxFullPath, id);
			}
		});
	}

	public prepareFiles(bundleAbstraction: BundleAbstraction) {
		bundleAbstraction.packageAbstractions.forEach(packageAbstraction => {
			let entryId = `${this.producer.entryPackageName}/${packageAbstraction.entryFile}`;
			packageAbstraction.fileAbstractions.forEach((fileAbstraction, key: string) => {
				let fileId = fileAbstraction.getFuseBoxFullPath();
				const id = this.index;
				this.handleMappings(fileId, id);
				this.index++;
				if (fileId === entryId) {
					fileAbstraction.setEntryPoint();
				}
				fileAbstraction.setID(id);
			});
		});
	}
	public async processBundle(bundleAbstraction: BundleAbstraction) {
		this.log.echoInfo(`Process bundle ${bundleAbstraction.name}`);
		await each(bundleAbstraction.packageAbstractions, (packageAbstraction: PackageAbstraction) => {
			const fileSize = packageAbstraction.fileAbstractions.size;
			this.log.echoInfo(`Process package ${packageAbstraction.name} `);
			this.log.echoInfo(`  Files: ${fileSize} `);
			return each(packageAbstraction.fileAbstractions, (fileAbstraction: FileAbstraction) => {
				return this.modify(fileAbstraction);
			});
		});

		await this.hoist();
	}

	private async processCSS() {
		if (!this.opts.shouldGenerateCSS()) {
			return;
		}
		await each(this.producerAbstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction) => {
			return each(bundleAbstraction.packageAbstractions, (packageAbstraction: PackageAbstraction) => {
				return each(packageAbstraction.fileAbstractions, (fileAbstraction: FileAbstraction) => {
					// make sure that the files that were removed
					// during treeshake aren't grouped and processed
					if (!fileAbstraction.canBeRemoved) {
						return CSSModifications.perform(this, fileAbstraction);
					}
				});
			});
		});
	}

	public treeShake() {
		if (this.opts.shouldTreeShake()) {
			const shaker = new TreeShake(this);
			return shaker.shake();
		}
	}
	public render() {
		return each(this.producerAbstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction) => {
			const globals = this.producer.fuse.context.globals;
			const globalFileMap = {};
			const generator = new FlatFileGenerator(this, bundleAbstraction);
			generator.init();
			return each(bundleAbstraction.packageAbstractions, (packageAbstraction: PackageAbstraction) => {
				return each(packageAbstraction.fileAbstractions, (fileAbstraction: FileAbstraction) => {
					if (
						fileAbstraction.fuseBoxPath == packageAbstraction.entryFile &&
						globals &&
						Object.keys(globals).indexOf(packageAbstraction.name) != -1
					) {
						globalFileMap[packageAbstraction.name] = fileAbstraction.getID();
					}
					return generator.addFile(fileAbstraction, this.opts.shouldEnsureES5());
				});
			}).then(() => {
				if (globals) {
					Object.keys(globals).forEach(globalPackageName => {
						if (globalFileMap[globalPackageName] !== undefined) {
							generator.setGlobals(globals[globalPackageName], globalFileMap[globalPackageName]);
						}
					});
				}
				this.log.echoInfo(`Render bundle ${bundleAbstraction.name}`);
				const targetBundle = this.producer.bundles.get(bundleAbstraction.name);

				const bundleCode = generator.render(targetBundle);

				targetBundle.generatedCode = new Buffer(bundleCode.content);
				targetBundle.generatedSourceMapsPath = generator.sourceMapsPath;
				targetBundle.generatedSourceMaps = generator.contents.sourceMap;
			});
		});
	}

	public hoist() {
		if (!this.api.hashesUsed() && this.opts.shouldDoHoisting()) {
			let hoisting = new Hoisting(this);
			return hoisting.start();
		}
	}

	public modify(file: FileAbstraction) {
		const modifications = [
			// modify require statements: require -> $fsx.r
			StatementModification,

			// modify dynamic statements
			DynamicImportStatementsModifications,

			// modify FuseBox.isServer and FuseBox.isBrowser
			EnvironmentConditionModification,
			// remove exports.__esModule = true
			InteropModifications,
			// removes "use strict" if required
			UseStrictModification,
			// replace typeof module, typeof exports, typeof window
			TypeOfModifications,
			// process.env removal
			ProcessEnvModification,
			// process global replacement with "undefined"
			GlobalProcessReplacement,
			// process.version global replacement with ""
			GlobalProcessVersionReplacement,
		];
		return each(modifications, (modification: IPerformable) => modification.perform(this, file));
	}
}
