"use strict";
const Utils_1 = require('./Utils');
const fs = require("fs");
const path = require("path");
class File {
    constructor(context, info) {
        this.context = context;
        this.info = info;
        this.isLoaded = false;
        this.isNodeModuleEntry = false;
        this.absPath = info.absPath;
    }
    consume() {
        if (!this.absPath) {
            return [];
        }
        if (!fs.existsSync(this.info.absDir)) {
            this.context.dump.error(this.info.fuseBoxPath, this.absPath, "Not found");
            this.contents = "";
            return [];
        }
        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;
        if (this.absPath.match(/\.json$/)) {
            this.contents = "module.exports = " + this.contents;
        }
        if (this.absPath.match(/\.js$/)) {
            let reqs = Utils_1.extractRequires(this.contents, path.join(this.absPath));
            return reqs;
        }
        return [];
    }
}
exports.File = File;
