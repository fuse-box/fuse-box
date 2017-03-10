"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
const Config_1 = require("./Config");
const path = require("path");
const fs = require("fs");
class BundleSource {
    constructor(context) {
        this.context = context;
        this.standalone = false;
        this.concat = new Utils_1.Concat(true, "", "\n");
    }
    init() {
        this.concat.add(null, "(function(FuseBox){FuseBox.$fuse$=FuseBox;");
    }
    annotate(comment) {
        if (this.context.rollupOptions) {
            this.collectionSource.add(null, comment);
        }
    }
    createCollection(collection) {
        this.collectionSource = new Utils_1.Concat(true, collection.name, "\n");
    }
    addContentToCurrentCollection(data) {
        if (this.collectionSource) {
            this.collectionSource.add(null, data);
        }
    }
    startCollection(collection) {
        let conflicting = {};
        if (collection.conflictingVersions) {
            collection.conflictingVersions.forEach((version, name) => {
                conflicting[name] = version;
            });
        }
        this.collectionSource.add(null, `FuseBox.pkg("${collection.name}", ${JSON.stringify(conflicting)}, function(___scope___){`);
        this.annotate(`/* fuse:start-collection "${collection.name}"*/`);
    }
    endCollection(collection) {
        let entry = collection.entryFile ? collection.entryFile.info.fuseBoxPath : "";
        if (entry) {
            this.collectionSource.add(null, `return ___scope___.entry = "${entry}";`);
        }
        this.collectionSource.add(null, "});");
        this.annotate(`/* fuse:end-collection "${collection.name}"*/`);
        let key = collection.info ? `${collection.info.name}@${collection.info.version}` : "default";
        this.concat.add(`packages/${key}`, this.collectionSource.content, key !== undefined ? this.collectionSource.sourceMap : undefined);
        return this.collectionSource.content.toString();
    }
    addContent(data) {
        this.concat.add(null, data);
    }
    addFile(file) {
        if (file.info.isRemoteFile || file.notFound
            || file.collection && file.collection.acceptFiles === false) {
            return;
        }
        this.collectionSource.add(null, `___scope___.file("${file.info.fuseBoxPath}", function(exports, require, module, __filename, __dirname){
${file.headerContent ? file.headerContent.join("\n") : ""}`);
        this.annotate(`/* fuse:start-file "${file.info.fuseBoxPath}"*/`);
        this.collectionSource.add(null, file.alternativeContent !== undefined ? file.alternativeContent : file.contents, file.sourceMap);
        this.annotate(`/* fuse:end-file "${file.info.fuseBoxPath}"*/`);
        this.collectionSource.add(null, "});");
    }
    finalize(bundleData) {
        let entry = bundleData.entry;
        const context = this.context;
        if (entry) {
            entry = Utils_1.ensurePublicExtension(entry);
        }
        let mainEntry;
        if (context.serverBundle) {
            this.concat.add(null, `FuseBox.isServer = true;`);
        }
        if (context.globals) {
            let data = [];
            for (let key in context.globals) {
                if (context.globals.hasOwnProperty(key)) {
                    let alias = context.globals[key];
                    let item = {};
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
            let fuseboxLibFile = path.join(Config_1.Config.FUSEBOX_MODULES, "fuse-box-loader-api", "fusebox.min.js");
            if (this.context.customAPIFile) {
                fuseboxLibFile = Utils_1.ensureUserPath(this.context.customAPIFile);
            }
            let wrapper = fs.readFileSync(fuseboxLibFile).toString();
            this.concat.add(null, `(${wrapper})`);
        }
        else {
            this.concat.add(null, "(FuseBox)");
        }
        if (this.context.sourceMapConfig) {
            if (this.context.sourceMapConfig.bundleReference) {
                this.concat.add(null, `//# sourceMappingURL=${this.context.sourceMapConfig.bundleReference}`);
            }
        }
    }
    getResult() {
        return this.concat;
    }
}
exports.BundleSource = BundleSource;
