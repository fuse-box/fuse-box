import { resolveCname } from 'dns';
import { Hello } from './../test/fixtures/cases/ts/Hello';
import { BundleData } from './Arithmetic';
import { ModuleCollection } from "./ModuleCollection";
import { WorkFlowContext } from "./WorkFlowContext";
import { Config } from "./Config";
import { File } from "./File";
import * as path from "path";
import * as fs from "fs";

const Concat = require("concat-with-sourcemaps");

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
    private concat: any;

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
        this.concat.add(null, "(function(){");
        if (context.standaloneBundle) {
            let fuseboxLibFile = path.join(Config.ASSETS_DIR, "fusebox.min.js");
            let wrapper = fs.readFileSync(fuseboxLibFile).toString();
            this.concat.add(null, wrapper);
        }
    }

    /**
     * 
     * 
     * @param {ModuleCollection} collection
     * 
     * @memberOf BundleSource
     */
    public startCollection(collection: ModuleCollection) {
        this.collectionSource = new Concat(true, collection.name, "\n");
        let conflicting = {};
        if (collection.conflictingVersions) {
            collection.conflictingVersions.forEach((version, name) => {
                conflicting[name] = version;
            });
        }

        this.collectionSource.add(null, `FuseBox.module("${collection.name}", ${JSON.stringify(
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
            this.collectionSource.add(null, `return ___scope___.entry("${entry}");`);
        }
        this.collectionSource.add(null, "});");

        let key = collection.info ? `${collection.info.name}@${collection.info.version}` : "default";
        this.concat.add(`packages/${key}`,
            this.collectionSource.content, key === "default" ? this.collectionSource.sourceMap : undefined);
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
        if (file.info.isRemoteFile) {
            return;
        }
        this.collectionSource.add(null,
            `___scope___.file("${file.info.fuseBoxPath}", function(exports, require, module, __filename, __dirname){ 
${file.headerContent ? file.headerContent.join("\n") : ""}`);
        this.collectionSource.add(null, file.contents, file.sourceMap);
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
        let context = this.context;
        if (entry) {
            if (this.context.tsMode) {
                entry = this.context.convert2typescript(entry);
            }
        }

        // Handle globals
        if (context.globals.length > 0) {
            let data = [];
            context.globals.forEach(name => {
                if (name === "default" && entry) {
                    data.push(`default/` + entry);
                    entry = undefined;
                } else {
                    data.push(name);
                }
            });
            this.concat.add(null, `FuseBox.expose(${JSON.stringify(data)})`)
        }

        if (entry) {
            this.concat.add(null, `\nFuseBox.import("${entry}")`);
        }
        this.concat.add(null, "})();");
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
