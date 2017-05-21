import { ProducerAbstraction } from "../../../bundle-abstraction/ProducerAbstraction";
import { FlatFileGenerator } from "./FlatFileGenerator";
import { BundleProducer } from "../../../core/BundleProducer";
import { each } from "realm-utils";
import { BundleAbstraction } from "../../../bundle-abstraction/BundleAbstraction";
import { fastHash } from "../../../Utils";
import { FileAbstraction } from "../../../bundle-abstraction/FileAbstraction";
import { ResponsiveAPI } from "./ResponsiveAPI";
import { Bundle } from "../../../core/Bundle";
import { OptimisedPluginOptions } from "./OptimisedPluginOptions";
import { StatementModification } from "./modifications/StatementModifaction";
import { PackageAbstraction } from "../../../bundle-abstraction/PackageAbstraction";
import { EnvironmentConditionModification } from "./modifications/EnvironmentConditionModification";

export class OptimisedCore {
    public producerAbstraction: ProducerAbstraction;
    public api = new ResponsiveAPI();
    public index = 0;
    constructor(public producer: BundleProducer, public opts: OptimisedPluginOptions​​) {

    }
    public consume() {

        return this.producer.generateAbstraction().then(abstraction => {
            this.producerAbstraction = abstraction;
            // con/sole.log(abstraction.bundleAbstractions);
            return each(abstraction.bundleAbstractions, (bundleAbstraction: BundleAbstraction​​) => {
                return this.modifyBundle(bundleAbstraction)
            });
        }).then(() => {
            this.compriseAPI()
            return this.writeBundles();
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
        this.setFileIds(bundleAbstraction);
        const generator = new FlatFileGenerator();
        generator.init();
        return each(bundleAbstraction.packageAbstractions, (packageAbstraction: PackageAbstraction) => {
            return each(packageAbstraction.fileAbstractions, (fileAbstraction: FileAbstraction) => {
                return this.generateFile(generator, fileAbstraction);
            })
        }).then(() => {
            const bundleCode = generator.render();
            // set generated code to bundles
            this.producer.bundles.get(bundleAbstraction.name).generatedCode = new Buffer(bundleCode);
        });
    }

    public generateFile(generator: FlatFileGenerator, file: FileAbstraction) {
        const modifications = [
            // require statements firsr
            () => StatementModification.perform(this, generator, file),
            () => EnvironmentConditionModification.perform(this, generator, file)
        ];
        return each(modifications, mod => mod())
            .then(() => generator.addFile(file));

    }

    public writeBundles() {
        // create api bundle
        let bundle = new Bundle("api.js", this.producer.fuse, this.producer);

        bundle.generatedCode = new Buffer(this.api.render());
        // api.js has to come first, therefore we need to re-initialise the map
        let newMap = new Map<string, Bundle>();
        newMap.set(bundle.name, bundle)

        this.producer.bundles.forEach(bundle => {
            newMap.set(bundle.name, bundle)
        });
        this.producer.bundles = newMap;

        return each(this.producer.bundles, (bundle: Bundle) => {
            return bundle.context.output.writeCurrent(bundle.generatedCode);
        });
    }

}