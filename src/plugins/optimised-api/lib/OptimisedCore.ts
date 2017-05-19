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
        bundleAbstraction.packageAbstractions.forEach(packageAbstraction => {
            packageAbstraction.fileAbstractions.forEach(fileAbstraction => {
                let id;
                if (this.producerAbstraction.useNumbers) {
                    id = this.index;
                    this.index++;
                } else {
                    id = fastHash(`${packageAbstraction.name}/${fileAbstraction.fuseBoxPath}`);
                }
                fileAbstraction.setID(id)
            });
        });
    }

    public modifyBundle(bundleAbstraction: BundleAbstraction) {
        this.setFileIds(bundleAbstraction);
        const generator = new FlatFileGenerator();
        generator.init();
        bundleAbstraction.packageAbstractions.forEach(packageAbstraction => {
            packageAbstraction.fileAbstractions.forEach(fileAbstraction => {
                return this.generateFile(generator, fileAbstraction);
            });
        });
        const bundleCode = generator.render();


        // set generated code to bundles
        this.producer.bundles.get(bundleAbstraction.name).generatedCode = new Buffer(bundleCode);
    }

    public generateFile(generator: FlatFileGenerator, file: FileAbstraction) {
        file.requireStatements.forEach(statement => {
            if (statement.isComputed) {
                statement.setFunctionName("$fsx.c")
                statement.bindID(file.getID())
                // file map is requested with computed require statements
                file.addFileMap();
            } else {
                let resolvedFile = statement.resolve();
                if (resolvedFile) {
                    statement.setFunctionName('$fsx.r')
                    statement.setValue(resolvedFile.getID());
                }
            }
        });
        generator.addFile(file);
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