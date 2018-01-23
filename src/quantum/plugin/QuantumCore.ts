import { FlatFileGenerator } from "./FlatFileGenerator";
import { each } from "realm-utils";
import { StatementModification } from "./modifications/StatementModifaction";
import { EnvironmentConditionModification } from "./modifications/EnvironmentConditionModification";
import { BundleWriter } from "./BundleWriter";
import { IPerformable } from "./modifications/IPerformable";
import { InteropModifications } from "./modifications/InteropModifications";
import { UseStrictModification } from "./modifications/UseStrictModification";
import { ProducerAbstraction } from "../core/ProducerAbstraction";
import { BundleProducer } from "../../core/BundleProducer";
import { BundleAbstraction } from "../core/BundleAbstraction";
import { PackageAbstraction } from "../core/PackageAbstraction";
import { FileAbstraction } from "../core/FileAbstraction";
import { ResponsiveAPI } from "./ResponsiveAPI";
import { Log } from "../../Log";
import { TypeOfModifications } from "./modifications/TypeOfModifications";
import { TreeShake } from "./TreeShake";
import { QuantumOptions } from "./QuantumOptions";

import { ProcessEnvModification } from "./modifications/ProcessEnvModification";
import { string2RegExp } from "../../Utils";
import { ComputedStatementRule } from "./ComputerStatementRule";
import { RequireStatement } from "../core/nodes/RequireStatement";
import { WorkFlowContext } from "../../core/WorkflowContext";

import { Bundle } from "../../core/Bundle";
import { DynamicImportStatementsModifications } from "./modifications/DynamicImportStatements";
import { Hoisting } from "./Hoisting";
import { QuantumBit } from "./QuantumBit";
import { CSSModifications } from './modifications/CSSModifications';
import { CSSCollection } from '../core/CSSCollection';
import { QuantumTask } from '../core/QuantumTask';


export interface QuantumStatementMapping {
    statement: RequireStatement,
    core: QuantumCore;
}
export class QuantumCore {
    public producerAbstraction: ProducerAbstraction;
    public api: ResponsiveAPI;
    public index = 0;
    public postTasks = new QuantumTask(this);
    public log: Log;
    public opts: QuantumOptions;
    public cssCollection = new CSSCollection(this);
    public writer = new BundleWriter(this);
    public context: WorkFlowContext;
    public requiredMappings = new Set<RegExp>();
    public quantumBits = new Map<string, QuantumBit>();
    public customStatementSolutions = new Set<RegExp>();
    public computedStatementRules = new Map<string, ComputedStatementRule>();
    public splitFiles = new Set<FileAbstraction>();

    constructor(public producer: BundleProducer, opts: QuantumOptions) {
        this.opts = opts;


        this.api = new ResponsiveAPI(this);
        this.log = producer.fuse.context.log;
        this.log.echoBreak();
        this.log.groupHeader("Launching quantum core");
        if (this.opts.apiCallback) {
            this.opts.apiCallback(this);
        }
        this.context = this.producer.fuse.context;
    }

    public solveComputed(path: string, rules?: { mapping: string, fn: { (statement: RequireStatement, core: QuantumCore): void } }) {
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
            customComputedStatementPaths: this.customStatementSolutions
        })
        abstraction.quantumCore = this;
        this.producerAbstraction = abstraction;
        this.log.echoInfo("Abstraction generated");

        await each(abstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction​​) => {
            return this.prepareFiles(bundleAbstraction);
        });

        await each(abstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction​​) => {
            return this.processBundle(bundleAbstraction);
        });

        await this.postTasks.execute();

        await this.prepareQuantumBits();
        await this.treeShake();
        await this.render();
        this.compriseAPI();
        await this.writer.process();

        this.printStat();

    }

    private ensureBitBundle(bit: QuantumBit) {
        let bundle: Bundle;
        if (!this.producer.bundles.get(bit.name)) {
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
        this.quantumBits.forEach(bit => { bit.resolve() })

        await each(this.quantumBits, async (bit: QuantumBit, key: string) => {
            bit.populate();
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
        // let apiStyle = "Optimised numbers (Best performance)";
        // if (this.api.hashesUsed()) {
        //     apiStyle = "Hashes (Might cause issues)";
        // }
        // this.log.printOptions("Stats", {
        //     warnings: this.producerAbstraction.warnings.size,
        //     apiStyle: apiStyle,
        //     target: this.opts.optsTarget,
        //     uglify: this.opts.shouldUglify(),
        //     removeExportsInterop: this.opts.shouldRemoveExportsInterop(),
        //     removeUseStrict: this.opts.shouldRemoveUseStrict(),
        //     replaceProcessEnv: this.opts.shouldReplaceProcessEnv(),
        //     ensureES5: this.opts.shouldEnsureES5(),
        //     treeshake: this.opts.shouldTreeShake(),
        // });
        if (this.opts.shouldShowWarnings()) {
            this.producerAbstraction.warnings.forEach(warning => {
                this.log.echoBreak();
                this.log.echoYellow("Warnings:");
                this.log.echoYellow("Your quantum bundle might not work");
                this.log.echoYellow(`  - ${warning.msg}`);
                this.log.echoGray("");
                this.log.echoGray("  * Set { warnings : false } if you want to hide these messages");
                this.log.echoGray("  * Read up on the subject http://fuse-box.org/page/quantum#computed-statement-resolution");
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
        // set ids first
        let entryId;
        if (this.producer.entryPackageFile && this.producer.entryPackageName) {
            entryId = `${this.producer.entryPackageName}/${this.producer.entryPackageFile}`;
        }

        // define globals
        const globals = this.producer.fuse.context.globals;
        let globalsName;
        if (globals) {
            for (let i in globals) { globalsName = globals[i]; }
        }
        bundleAbstraction.packageAbstractions.forEach(packageAbstraction => {
            packageAbstraction.fileAbstractions.forEach((fileAbstraction, key: string) => {
                let fileId = fileAbstraction.getFuseBoxFullPath();
                const id = this.index;
                this.handleMappings(fileId, id);
                this.index++;
                if (fileId === entryId) {
                    fileAbstraction.setEnryPoint(globalsName);
                }
                fileAbstraction.setID(id);
            });
        });
    }

    public async processBundle(bundleAbstraction: BundleAbstraction) {
        this.log.echoInfo(`Process bundle ${bundleAbstraction.name}`);
        await  each(bundleAbstraction.packageAbstractions, (packageAbstraction: PackageAbstraction) => {
            const fileSize = packageAbstraction.fileAbstractions.size;
            this.log.echoInfo(`Process package ${packageAbstraction.name} `);
            this.log.echoInfo(`  Files: ${fileSize} `);
            return each(packageAbstraction.fileAbstractions, (fileAbstraction: FileAbstraction) => {
                return this.modify(fileAbstraction);
            });
        });

        await this.hoist();
    }

    public treeShake() {
        if (this.opts.shouldTreeShake()) {
            const shaker = new TreeShake(this);
            return shaker.shake();
        }
    }
    public render() {
        return each(this.producerAbstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction​​) => {

            const generator = new FlatFileGenerator(this, bundleAbstraction);
            generator.init();
            return each(bundleAbstraction.packageAbstractions, (packageAbstraction: PackageAbstraction) => {
                return each(packageAbstraction.fileAbstractions, (fileAbstraction: FileAbstraction) => {
                    return generator.addFile(fileAbstraction, this.opts.shouldEnsureES5());
                });

            }).then(() => {
                this.log.echoInfo(`Render bundle ${bundleAbstraction.name}`);
                const bundleCode = generator.render();
                this.producer.bundles.get(bundleAbstraction.name).generatedCode = new Buffer(bundleCode);
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
            // CSS
            CSSModifications,

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
        ];
        return each(modifications, (modification: IPerformable) => modification.perform(this, file));
    }
}
