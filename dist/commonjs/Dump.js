"use strict";
const prettyTime = require("pretty-time");
const ansi = require("ansi");
const cursor = ansi(process.stdout);
const prettysize = require("prettysize");
class FuseBoxDump {
    constructor() {
        this.modules = {};
    }
    log(moduleName, file, contents) {
        if (!this.modules[moduleName]) {
            this.modules[moduleName] = [];
        }
        let byteAmount = Buffer.byteLength(contents, "utf8");
        this.modules[moduleName].push({
            name: file,
            bytes: byteAmount,
        });
    }
    error(moduleName, file, error) {
        if (!this.modules[moduleName]) {
            this.modules[moduleName] = [];
        }
        this.modules[moduleName].push({
            name: file,
            error: error
        });
    }
    warn(moduleName, warning) {
        if (!this.modules[moduleName]) {
            this.modules[moduleName] = [];
        }
        this.modules[moduleName].push({
            warning: warning
        });
    }
    printLog(endTime) {
        let total = 0;
        for (let name in this.modules) {
            if (this.modules.hasOwnProperty(name)) {
                cursor.green().write(name).write("\n").reset();
                for (let i = 0; i < this.modules[name].length; i++) {
                    let item = this.modules[name][i];
                    if (item.warning) {
                        cursor.yellow().write(`  ${item.warning}`).write("\n").reset();
                    }
                    else if (item.error) {
                        cursor.red().write(`  ${item.name} - ${item.error}`).write("\n").reset();
                    }
                    else {
                        total += item.bytes;
                        cursor.grey().write(`  ${item.name} (${prettysize(item.bytes)})`).write("\n").reset();
                    }
                }
            }
        }
        cursor.white().write("-------------").write("\n").reset();
        cursor.white()
            .write(`Total: ${prettysize(total)} in ${prettyTime(process.hrtime(endTime))}`).write("\n").reset();
        console.log("");
    }
}
exports.FuseBoxDump = FuseBoxDump;
