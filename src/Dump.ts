
const prettyTime = require("pretty-time");
const ansi = require("ansi");
const cursor = ansi(process.stdout);
const prettysize = require("prettysize");


/**
 *
 *
 * @export
 * @class FuseBoxDump
 */
export class FuseBoxDump {
    /**
     *
     *
     *
     * @memberOf FuseBoxDump
     */
    public modules = {};
    /**
     *
     *
     * @param {string} moduleName
     * @param {string} file
     * @param {string} contents
     *
     * @memberOf FuseBoxDump
     */
    public log(moduleName: string, file: string, contents: string) {
        if (!this.modules[moduleName]) {
            this.modules[moduleName] = [];
        }
        let byteAmount = Buffer.byteLength(contents, "utf8");
        this.modules[moduleName].push({
            name: file,
            bytes: byteAmount,
        });
    }

    public error(moduleName: string, file: string, error: string) {
        if (!this.modules[moduleName]) {
            this.modules[moduleName] = [];
        }

        this.modules[moduleName].push({
            name: file,
            error: error
        });
    }

    public warn(moduleName: string, warning: string) {
        if (!this.modules[moduleName]) {
            this.modules[moduleName] = [];
        }

        this.modules[moduleName].push({
            warning: warning
        });
    }
    /**
     *
     *
     *
     * @memberOf FuseBoxDump
     */
    public printLog(endTime: any) {
        let total = 0;
        for (let name in this.modules) {
            if (this.modules.hasOwnProperty(name)) {
                cursor.green().write(name).write("\n").reset();
                for (let i = 0; i < this.modules[name].length; i++) {
                    let item = this.modules[name][i];
                    if (item.warning) {
                        cursor.yellow().write(`  ${item.warning}`).write("\n").reset();
                    } else if (item.error) {
                        cursor.red().write(`  ${item.name} - ${item.error}`).write("\n").reset();
                    } else {
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