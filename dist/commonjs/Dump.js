"use strict";
const ansi = require("ansi");
const prettyTime = require("pretty-time");
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
    printLog(endTime) {
        let total = 0;
        for (let name in this.modules) {
            if (this.modules.hasOwnProperty(name)) {
                cursor.green().write(name).write("\n").reset();
                for (let i = 0; i < this.modules[name].length; i++) {
                    let item = this.modules[name][i];
                    total += item.bytes;
                    cursor.grey().write(`  ${item.name} (${prettysize(item.bytes)})`).write("\n").reset();
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
