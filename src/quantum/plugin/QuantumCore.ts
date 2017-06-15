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
import { fastHash, string2RegExp } from "../../Utils";
import { ComputedStatementRule } from "./ComputerStatementRule";
import { RequireStatement } from "../core/nodes/RequireStatement";
import { WorkFlowContext } from "../../core/WorkflowContext";
import { QuantumItem } from "../../core/QuantumSplit";
import { Bundle } from "../../core/Bundle";


export interface QuantumStatementMapping {
    statement: RequireStatement,
    core: QuantumCore
}
export class QuantumCore {
    public producerAbstraction: ProducerAbstraction;
    public api: ResponsiveAPI;
    public index = 0;
    public log: Log;
    public opts: QuantumOptions;
    public writer = new BundleWriter(this);
    public context: WorkFlowContext;
    public requiredMappings = new Set<RegExp>();
    public customStatementSolutions = new Set<RegExp>();
    public computedStatementRules = new Map<string, ComputedStatementRule>();
    constructor(public producer: BundleProducer, opts: QuantumOptions) {
        this.opts = opts;
        this.api = new ResponsiveAPI(this);
        this.log = producer.fuse.context.log;
        this.log.echoBreak();
        this.log.echoInfo("Launching quantum core");
        if (this.opts.apiCallback) {
            this.opts.apiCallback(this);
        }
        this.context = this.producer.fuse.context;
    }

    public solveComputed(path: string, rules: { mapping: string, fn: { (statement: RequireStatement, core: QuantumCore) } }) {
        this.customStatementSolutions.add(string2RegExp(path));
        this.requiredMappings.add(string2RegExp(rules.mapping));
        this.computedStatementRules.set(path, new ComputedStatementRule(path, rules));
    }

    public getCustomSolution(file: FileAbstraction): ComputedStatementRule {
        let fullPath = file.getFuseBoxFullPath();
        let computedRule = this.computedStatementRules.get(fullPath);
        if (computedRule) {
            return computedRule;
        }
    }

    public consume() {
        this.log.echoInfo("Generating abstraction, this may take a while");
        return this.producer.generateAbstraction({
            customComputedStatementPaths: this.customStatementSolutions
        }).then(abstraction => {
            this.producerAbstraction = abstraction;
            this.log.echoInfo("Abstraction generated");
            return each(abstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction​​) => {
                return this.processBundle(bundleAbstraction);
            });
        })
            .then(() => this.treeShake())
            .then(() => this.render())
            .then(() => {
                this.compriseAPI();
                return this.writer.process();
            }).then(() => {
                this.printStat();
            });
    }
    private printStat() {
        let apiStyle = "Optimised numbers (Best performance)";
        if (this.api.hashesUsed()) {
            apiStyle = "Hashes (Might cause issues)";
        }
        this.log.printOptions("Stats", {
            warnings: this.producerAbstraction.warnings.size,
            apiStyle: apiStyle,
            target: this.opts.optsTarget,
            uglify: this.opts.shouldUglify(),
            removeExportsInterop: this.opts.shouldRemoveExportsInterop(),
            removeUseStrict: this.opts.shouldRemoveUseStrict(),
            replaceProcessEnv: this.opts.shouldReplaceProcessEnv(),
            ensureES5: this.opts.shouldEnsureES5(),
            treeshake: this.opts.shouldTreeShake(),
        });
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
                let id;
                if (this.producerAbstraction.useNumbers) {
                    id = this.index;
                    this.handleMappings(fileId, id);
                    this.index++;
                } else {
                    id = fastHash(fileId);
                }
                if (fileId === entryId) {
                    fileAbstraction.setEnryPoint(globalsName);
                }
                fileAbstraction.setID(id);
                const quantumItem = this.context.requiresQuantumSplitting(fileAbstraction.fuseBoxPath)
                if (quantumItem) {
                    // reference the item
                    // it will be removed from this bundle later
                    fileAbstraction.referenceQuantumSplit(quantumItem);
                }
            });
        });
    }

    public processBundle(bundleAbstraction: BundleAbstraction) {
        this.log.echoInfo(`Process bundle ${bundleAbstraction.name}`);
        this.prepareFiles(bundleAbstraction);
        return each(bundleAbstraction.packageAbstractions, (packageAbstraction: PackageAbstraction) => {
            const fileSize = packageAbstraction.fileAbstractions.size;
            this.log.echoInfo(`Process package ${packageAbstraction.name} `);
            this.log.echoInfo(`  Files: ${fileSize} `);
            return each(packageAbstraction.fileAbstractions, (fileAbstraction: FileAbstraction) =>
                this.modify(fileAbstraction));
        });
    }

    public treeShake() {
        if (this.opts.shouldTreeShake()) {
            const shaker = new TreeShake(this);
            return shaker.shake();
        }
    }
    public render() {
        return each(this.producerAbstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction​​) => {
            const generator = new FlatFileGenerator(this);
            generator.init();
            return each(bundleAbstraction.packageAbstractions, (packageAbstraction: PackageAbstraction) => {
                return each(packageAbstraction.fileAbstractions, (fileAbstraction: FileAbstraction) => {
                    // split references belong to other bundles
                    // which will be created later
                    if (!fileAbstraction.getSplitReference()) {
                        return generator.addFile(fileAbstraction, this.opts.shouldEnsureES5());
                    }
                });

            }).then(() => {
                this.log.echoInfo(`Render bundle ${bundleAbstraction.name}`);
                const bundleCode = generator.render();
                this.producer.bundles.get(bundleAbstraction.name).generatedCode = new Buffer(bundleCode);
            });
        }).then(() => {
            // generate extra bundles required by code splitting
            if (this.context.quantumSplitConfig) {
                this.log.echoInfo(`Dealing with code splitting`);
                const items = this.context.quantumSplitConfig.getItems();
                // every split item contains file abstractions
                return each(items, (item: QuantumItem) => {

                    const files = item.getFiles();
                    this.log.echoInfo(`Code splitting: bundle ${item.name} (files: ${files.size})`);
                    const fusebox = this.context.fuse.copy();
                    const bundle = new Bundle(item.name, fusebox, this.producer);
                    // set the reference
                    bundle.quantumItem = item;
                    this.producer.bundles.set(item.name, bundle);
                    // don't allow WebIndexPlugin to include it to script tags
                    bundle.webIndexed = false;
                    const generator = new FlatFileGenerator(this);
                    generator.init();
                    // register files
                    files.forEach(file => {
                        generator.addFile(file, this.opts.shouldEnsureES5());
                    });
                    bundle.generatedCode = new Buffer(generator.render());
                });
            }

        });
    }



    public modify(file: FileAbstraction) {
        const modifications = [
            // modify require statements: require -> $fsx.r
            StatementModification,
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