import { FlatFileGenerator } from "./FlatFileGenerator";
import { each } from "realm-utils";
import { OptimisedPluginOptions } from "./OptimisedPluginOptions";
import { StatementModification } from "./modifications/StatementModifaction";
import { EnvironmentConditionModification } from "./modifications/EnvironmentConditionModification";
import { BundleWriter } from "./BundleWriter";
import { IPerformable } from "./modifications/IPerformable";
import { InteropModifications } from "./modifications/InteropModifications";
import { UseStrictModification } from "./modifications/UseStrictModification";
import { ProducerAbstraction } from "../core/ProducerAbstraction";
import { BundleProducer } from "../../core/BundleProducer";
import { BundleAbstraction } from "../core/BundleAbstraction";
import { fastHash } from "../../Utils";
import { PackageAbstraction } from "../core/PackageAbstraction";
import { FileAbstraction } from "../core/FileAbstraction";
import { ResponsiveAPI } from "./ResponsiveAPI";
import { Log } from "../../Log";
import { TypeOfModifications } from "./modifications/TypeOfModifications";


export class OptimisedCore {
    public producerAbstraction: ProducerAbstraction;
    public api: ResponsiveAPI;
    public index = 0;
    public log: Log;
    public opts: OptimisedPluginOptions​​;
    public writer = new BundleWriter(this)
    constructor(public producer: BundleProducer, opts: OptimisedPluginOptions​​) {
        this.opts = opts;
        this.api = new ResponsiveAPI(this);
        this.log = producer.fuse.context.log;
        this.log.echoBreak();
        this.log.echoInfo("Start optimisation");

    }

    public consume() {
        this.log.echoInfo("Generating abstraction, this may take a while");
        return this.producer.generateAbstraction().then(abstraction => {
            this.producerAbstraction = abstraction;
            this.log.echoInfo("Abstraction generated");
            return each(abstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction​​) => {

                return this.modifyBundle(bundleAbstraction)
            });
        }).then(() => {
            this.compriseAPI()
            return this.writer.process();
        });
    }

    public compriseAPI() {
        if (this.producerAbstraction.useComputedRequireStatements) {
            this.api.addComputedRequireStatetements();
        }
    }

    public setFileIds(bundleAbstraction: BundleAbstraction) {
        // set ids first
        let entryId;
        if (this.producer.entryPackageFile && this.producer.entryPackageName) {
            entryId = `${this.producer.entryPackageName}/${this.producer.entryPackageFile}`;
        }
        bundleAbstraction.packageAbstractions.forEach(packageAbstraction => {
            packageAbstraction.fileAbstractions.forEach(fileAbstraction => {
                let fileId = `${packageAbstraction.name}/${fileAbstraction.fuseBoxPath}`;
                let id;
                if (this.producerAbstraction.useNumbers) {
                    id = this.index;
                    this.index++;
                } else {
                    id = fastHash(fileId);
                }
                if (fileId === entryId) {
                    fileAbstraction.setEnryPoint();
                }
                fileAbstraction.setID(id)
            });
        });
    }

    public modifyBundle(bundleAbstraction: BundleAbstraction) {
        this.log.echoInfo(`Process bundle ${bundleAbstraction.name}`);
        this.setFileIds(bundleAbstraction);
        const generator = new FlatFileGenerator();
        generator.init();
        return each(bundleAbstraction.packageAbstractions, (packageAbstraction: PackageAbstraction) => {
            const fileSize = packageAbstraction.fileAbstractions.size;
            this.log.echoInfo(`Process package ${packageAbstraction.name} `);
            this.log.echoInfo(`  Files: ${fileSize} `);
            return each(packageAbstraction.fileAbstractions, (fileAbstraction: FileAbstraction) => {
                return this.generateFile(generator, fileAbstraction);
            })
        }).then(() => {
            this.log.echoInfo(`Render bundle ${bundleAbstraction.name}`);
            const bundleCode = generator.render();
            // set generated code to bundles
            this.producer.bundles.get(bundleAbstraction.name).generatedCode = new Buffer(bundleCode);
        });
    }

    public generateFile(generator: FlatFileGenerator, file: FileAbstraction) {
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
            TypeOfModifications
        ];
        return each(modifications, (modification: IPerformable) => modification.perform(this, generator, file))
            .then(() => generator.addFile(file, this.opts.shouldEnsureES5()));
    }
}