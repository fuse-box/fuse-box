"use strict";
const Config_1 = require("./Config");
const path = require("path");
const fs = require("fs");
const Concat = require("concat-with-sourcemaps");
class BundleSource {
    constructor(context) {
        this.context = context;
        this.standalone = false;
        this.currentCollection = [];
        this.concat = new Concat(true, "", "\n");
        this.concat.add(null, "(function(){");
        if (context.standaloneBundle) {
            let fuseboxLibFile = path.join(Config_1.Config.ASSETS_DIR, "fusebox.min.js");
            let wrapper = fs.readFileSync(fuseboxLibFile).toString();
            this.concat.add(null, wrapper);
        }
    }
    startCollection(collection) {
        this.collectionSource = new Concat(true, collection.name, "\n");
        this.collectionSource.add(null, `FuseBox.module("${collection.name}", ${JSON.stringify(collection.conflictingVersions)}, function(___scope___){`);
    }
    endCollection(collection) {
        let entry = collection.entryFile ? collection.entryFile.info.fuseBoxPath : "";
        if (entry) {
            this.collectionSource.add(null, `return ___scope___.entry("${entry}");`);
        }
        this.collectionSource.add(null, "});");
        this.concat.add(collection.name, this.collectionSource.content, this.collectionSource.sourceMap);
        return this.collectionSource.content.toString();
    }
    addContent(data) {
        this.concat.add(null, data);
    }
    addFile(file) {
        if (file.info.isRemoteFile) {
            return;
        }
        this.collectionSource.add(null, `___scope___.file("${file.info.fuseBoxPath}", function(exports, require, module, __filename, __dirname){ 
${file.headerContent ? file.headerContent.join("\n") : ""}`);
        this.collectionSource.add(null, file.contents, file.sourceMap);
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
        if (context.globals.length > 0) {
            let data = [];
            context.globals.forEach(name => {
                if (name === "default" && entry) {
                    data.push(`default/` + entry);
                    entry = undefined;
                }
                else {
                    data.push(name);
                }
            });
            this.concat.add(null, `FuseBox.expose(${JSON.stringify(data)})`);
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
    getResult() {
        return this.concat;
    }
}
exports.BundleSource = BundleSource;
