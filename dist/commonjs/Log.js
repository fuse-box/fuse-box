"use strict";
const ansi = require("ansi");
const cursor = ansi(process.stdout);
const prettysize = require("prettysize");
const prettyTime = require("pretty-time");
class Log {
    constructor(printLog) {
        this.printLog = printLog;
        this.timeStart = process.hrtime();
        this.totalSize = 0;
    }
    echoDefaultCollection(collection, contents, printFiles) {
        if (!this.printLog) {
            return;
        }
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;
        cursor.brightBlack().write(`└──`)
            .green().write(` ${collection.cachedName || collection.name}`)
            .yellow().write(` (${collection.dependencies.size} files,  ${size})`);
        cursor.write("\n");
        collection.dependencies.forEach(file => {
            if (!file.info.isRemoteFile) {
                cursor.brightBlack().write(`      ${file.info.fuseBoxPath}`).write("\n");
            }
        });
        cursor.reset();
    }
    echoCollection(collection, contents, printFiles) {
        if (!this.printLog) {
            return;
        }
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;
        cursor.brightBlack().write(`└──`)
            .green().write(` ${collection.cachedName || collection.name}`)
            .brightBlack().write(` (${collection.dependencies.size} files)`)
            .yellow().write(` ${size}`)
            .write("\n").reset();
    }
    end() {
        if (!this.printLog) {
            return;
        }
        let took = process.hrtime(this.timeStart);
        cursor.write("\n")
            .brightBlack().write(`    --------------\n`)
            .yellow().write(`    Size: ${prettysize(this.totalSize)} \n`)
            .yellow().write(`    Time: ${prettyTime(took, "ms")}`)
            .write("\n")
            .brightBlack().write(`    --------------\n`)
            .write("\n").reset();
    }
}
exports.Log = Log;
