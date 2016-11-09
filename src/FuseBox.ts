import { PathMaster } from "./PathMaster";
import { WorkFlowContext } from "./WorkflowContext";
import { CollectionSource } from "./CollectionSource";
import { Arithmetic, BundleData } from "./Arithmetic";
import { ModuleWrapper } from "./ModuleWrapper";
import { ModuleCollection } from "./ModuleCollection";
import * as path from "path";
import { each, chain, Chainable } from "realm-utils";
const appRoot = require("app-root-path");

/**
 *
 *
 * @export
 * @class FuseBox
 */
export class FuseBox {

    public virtualFiles: any;
    private collectionSource: CollectionSource;
    private timeStart;
    private context: WorkFlowContext;

    /**
     * Creates an instance of FuseBox.
     *
     * @param {*} opts
     *
     * @memberOf FuseBox
     */
    constructor(public opts: any) {
        this.context = new WorkFlowContext();
        this.timeStart = process.hrtime();
        this.collectionSource = new CollectionSource(this.context);
        opts = opts || {};
        let homeDir = appRoot.path;
        if (opts.homeDir) {
            homeDir = path.isAbsolute(opts.homeDir) ? opts.homeDir : path.join(appRoot.path, opts.homeDir);
        }
        this.context.setHomeDir(homeDir);
        if (opts.logs) {
            this.context.setPrintLogs(opts.logs);
        }
        if (opts.cache !== undefined) {
            this.context.setUseCache(opts.cache);
        }
        // In case of additional resources (or resourses to use with gulp)
        this.virtualFiles = opts.fileCollection;
    }

    public bundle(str: string, standalone?: boolean) {
        let parser = Arithmetic.parse(str);
        let bundle: BundleData;

        return Arithmetic.getFiles(parser, this.virtualFiles, this.context.homeDir).then(data => {
            bundle = data;
            return this.process(data, standalone);
        }).then((contents) => {
            bundle.finalize(); // Clean up temp folder if required

            return contents;
        }).catch(e => {
            console.log(e.stack || e);
        });
    }

    public process(bundleData: BundleData, standalone?: boolean) {
        let bundleCollection = new ModuleCollection(this.context, "default");

        bundleCollection.pm = new PathMaster(this.context, bundleData.homeDir);
        let self = this;
        return bundleCollection.collectBundle(bundleData).then(module => {

            return chain(class extends Chainable {
                public defaultCollection: ModuleCollection;
                public nodeModules: Map<string, ModuleCollection>;
                public defaultContents: string;
                public globalContents = [];
                public setDefaultCollection() {
                    return bundleCollection;
                }

                public addDefaultContents() {
                    return self.collectionSource.get(this.defaultCollection).then(cnt => {
                        this.globalContents.push(cnt);
                    });
                }

                public addNodeModules() {
                    return each(self.context.nodeModules, (collection: ModuleCollection) => {
                        return self.collectionSource.get(collection).then(cnt => {
                            this.globalContents.push(cnt);
                        });
                    });
                }

                public format() {
                    return {
                        contents: this.globalContents,
                    };
                }

            }).then(result => {
                let contents = result.contents.join("\n");
                console.log("");
                if (this.context.printLogs) {
                    self.context.dump.printLog(this.timeStart);
                }
                return ModuleWrapper.wrapFinal(contents, bundleData.entry, standalone);
                // return {
                //     dump: this.dump,
                //     contents: ModuleWrapper.wrapFinal(result.contents, bundleData.entry, standalone)
                // };
            });
        });
    }
}
