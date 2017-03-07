import { ensurePublicExtension, Concat, ensureUserPath } from "./Utils";
import { ModuleCollection } from "./core/ModuleCollection";
import { WorkFlowContext } from "./core/WorkflowContext";
import { BundleData } from "./arithmetic/Arithmetic";
import { File } from "./core/File";
import { Config } from "./Config";
import * as path from "path";
import * as fs from "fs";

/**
 *
 *
 * @export
 * @class BundleSource
 */
export class BundleSource {
    /**
     *
     *
     *
     * @memberOf BundleSource
     */
    public standalone = false;
    /**
     *
     *
     * @private
     * @type {*}
     * @memberOf BundleSource
     */
    private concat: Concat;

    private collectionSource: any;


    /**
     * Creates an instance of BundleSource.
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf BundleSource
     */
    constructor(public context: WorkFlowContext) {
        this.concat = new Concat(true, "", "\n");
    }

    /**
     *
     *
     * @memberOf BundleSource
     */
    public init() {
        this.concat.add(null, "(function(FuseBox){FuseBox.$fuse$=FuseBox;");
    }

    /**
     *
     *
     * @param {ModuleCollection} collection
     *
     * @memberOf BundleSource
     */
    public createCollection(collection: ModuleCollection) {
        this.collectionSource = new Concat(true, collection.name, "\n");
    }

    public addContentToCurrentCollection(data: string) {
        if (this.collectionSource) {
            this.collectionSource.add(null, data);
        }
    }

    public startCollection(collection: ModuleCollection) {
        let conflicting = {};
        if (collection.conflictingVersions) {
            collection.conflictingVersions.forEach((version, name) => {
                conflicting[name] = version;
            });
        }
        this.collectionSource.add(null, `FuseBox.pkg("${collection.name}", ${JSON.stringify(
            conflicting)}, function(___scope___){`);
    }

    /**
     *
     *
     * @param {ModuleCollection} collection
     *
     * @memberOf BundleSource
     */
    public endCollection(collection: ModuleCollection) {
        let entry = collection.entryFile ? collection.entryFile.info.fuseBoxPath : "";

        if (entry) {
            this.collectionSource.add(null, `return ___scope___.entry = "${entry}";`);
        }
        this.collectionSource.add(null, "});");

        let key = collection.info ? `${collection.info.name}@${collection.info.version}` : "default";
        this.concat.add(`packages/${key}`,
            this.collectionSource.content, key !== undefined ? this.collectionSource.sourceMap : undefined);
        return this.collectionSource.content.toString();
    }

    /**
     *
     *
     * @param {string} data
     *
     * @memberOf BundleSource
     */
    public addContent(data: string) {
        this.concat.add(null, data);
    }

    /**
     *
     *
     * @param {File} file
     *
     * @memberOf BundleSource
     */
    public addFile(file: File) {
        if (file.info.isRemoteFile || file.notFound
            || file.collection && file.collection.acceptFiles === false) {
            return;
        }

        this.collectionSource.add(null,
            `___scope___.file("${file.info.fuseBoxPath}", function(exports, require, module, __filename, __dirname){
${file.headerContent ? file.headerContent.join("\n") : ""}`);
        this.collectionSource.add(null, file.alternativeContent !== undefined ? file.alternativeContent : file.contents, file.sourceMap);

        this.collectionSource.add(null, "});");
    }

    /**
     *
     *
     * @param {BundleData} bundleData
     *
     * @memberOf BundleSource
     */
    public finalize(bundleData: BundleData) {
        let entry = bundleData.entry;
        const context = this.context;
        if (entry) {
            entry = ensurePublicExtension(entry);
        }
        let mainEntry;

        // handle server bundle

        if (context.serverBundle) {
            this.concat.add(null, `FuseBox.isServer = true;`);
        }

        // Handle globals
        if (context.globals) {
            let data = [];
            for (let key in context.globals) {
                if (context.globals.hasOwnProperty(key)) {
                    let alias = context.globals[key];
                    let item : any = {};
                    item.alias = alias;
                    item.pkg = key;
                    if (key === context.defaultPackageName && entry) {
                        mainEntry = item.pkg = `${key}/${entry}`;
                        entry = undefined;
                    }
                    data.push(item);
                }
            }
            this.concat.add(null, `FuseBox.expose(${JSON.stringify(data)});`);
        }

        if (entry) {
            mainEntry = `${context.defaultPackageName}/${entry}`;
            this.concat.add(null, `\nFuseBox.import("${mainEntry}");`);
        }
        if (mainEntry) {
            this.concat.add(null, `FuseBox.main("${mainEntry}");`);
        }
        if (context.defaultPackageName !== "default") {
            this.concat.add(null, `FuseBox.defaultPackageName = ${JSON.stringify(context.defaultPackageName)};`);
        }

        this.concat.add(null, "})");

        if (context.standaloneBundle) {
            let fuseboxLibFile = path.join(Config.FUSEBOX_MODULES, "fuse-box-loader-api", "fusebox.min.js");
            if (this.context.customAPIFile) {
                fuseboxLibFile = ensureUserPath(this.context.customAPIFile);
            }
            let wrapper = fs.readFileSync(fuseboxLibFile).toString();
            this.concat.add(null, `(${wrapper})`);
        } else {
            this.concat.add(null, "(FuseBox)");
        }

        if (this.context.sourceMapConfig) {
            if (this.context.sourceMapConfig.bundleReference) {
                this.concat.add(null, `//# sourceMappingURL=${this.context.sourceMapConfig.bundleReference}`);
            }
        }
    }

    /**
     *
     *
     * @returns
     *
     * @memberOf BundleSource
     */
    public getResult() {
        return this.concat;
    }
}
