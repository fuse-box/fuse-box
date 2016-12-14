"use strict";
const Config_1 = require("./Config");
const path = require("path");
const fs = require("fs");
const Concat = require("concat-with-sourcemaps");
class BundleSource {
    constructor(context) {
        this.context = context;
        this.standalone = false;
        this.concat = new Concat(true, "", "\n");
        this.concat.add(null, "(function(FuseBox){");
    }
    createCollection(collection) {
        this.collectionSource = new Concat(true, collection.name, "\n");
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
    }
    endCollection(collection) {
        let entry = collection.entryFile ? collection.entryFile.info.fuseBoxPath : "";
        if (entry) {
            this.collectionSource.add(null, `return ___scope___.entry = "${entry}";`);
        }
        this.collectionSource.add(null, "});");
        let key = collection.info ? `${collection.info.name}@${collection.info.version}` : "default";
        this.concat.add(`packages/${key}`, this.collectionSource.content, key === "default" ? this.collectionSource.sourceMap : undefined);
        return this.collectionSource.content.toString();
    }
    addContent(data) {
        this.concat.add(null, data);
    }
    addFile(file) {
        if (file.info.isRemoteFile || file.notFound) {
            return;
        }
        this.collectionSource.add(null, `___scope___.file("${file.info.fuseBoxPath}", function(exports, require, module, __filename, __dirname){ 
${file.headerContent ? file.headerContent.join("\n") : ""}`);
        this.collectionSource.add(null, file.alternativeContent || file.contents, file.sourceMap);
        this.collectionSource.add(null, "});");
    }
    finalize(bundleData) {
        let entry = bundleData.entry;
        let context = this.context;
        if (entry) {
            if (this.context.tsMode) {
                entry = this.context.convert2typescript(entry);
            }
        }
        let mainEntry;
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
        this.concat.add(null, "})");
        if (context.standaloneBundle) {
            let fuseboxLibFile = path.join(Config_1.Config.ASSETS_DIR, "frontend", "fusebox.min.js");
            let wrapper = fs.readFileSync(fuseboxLibFile).toString();
            this.concat.add(null, `(${wrapper})`);
        }
        else {
            this.concat.add(null, "()");
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
