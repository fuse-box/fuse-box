import { ModuleCollection } from './ModuleCollection';
const spinner = require("char-spinner");
const ansi = require("ansi");
const cursor = ansi(process.stdout);
const prettysize = require("prettysize");
const prettyTime = require("pretty-time");

export class Log {
    private spinnerInterval: any;
    private timeStart = process.hrtime();
    private totalSize = 0;
    constructor(public printLog: boolean) { }

    public startSpinning() {
        this.spinnerInterval = spinner({
            string: "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏",
        });
    }

    public stopSpinning() {
        clearInterval(this.spinnerInterval);
    }

    public echoDefaultCollection(collection: ModuleCollection, contents: string, printFiles?: boolean) {
        if (!this.printLog) {
            return;
        }
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;
        cursor.brightBlack().write(`└──`)
            .green().write(` ${collection.cachedName || collection.name}`)
            .yellow().write(` (${collection.dependencies.size} files,  ${size})`)

        cursor.write("\n")
        collection.dependencies.forEach(file => {
            cursor.brightBlack().write(`      ${file.info.fuseBoxPath}`).write("\n")
        });
        cursor.reset();
    }

    public echoCollection(collection: ModuleCollection, contents: string, printFiles?: boolean) {
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

    public end() {
        if (!this.printLog) {
            return;
        }
        let took = process.hrtime(this.timeStart)
        cursor.write("\n")
            .brightBlack().write(`    --------------\n`)
            .yellow().write(`    Size: ${prettysize(this.totalSize)} \n`)
            .yellow().write(`    Time: ${prettyTime(took, 'ms')}`)
            .write("\n")
            .brightBlack().write(`    --------------\n`)
            .write("\n").reset();
    }
}