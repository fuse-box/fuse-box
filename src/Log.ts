import { ModuleCollection } from "./core/ModuleCollection";
import { WorkFlowContext } from "./core/WorkflowContext";
const log = require("fliplog");
const prettysize = require("prettysize");
const prettyTime = require("pretty-time");

export class Log {
    public timeStart = process.hrtime();
    public printLog = true;
    private totalSize = 0;

    constructor(public context: WorkFlowContext) {
        this.printLog = context.doLog;
        log.filter((arg) => {
            if (this.printLog === false) return false
            return null
        })
    }

    public reset(): Log {
        this.timeStart = process.hrtime();
        this.totalSize = 0;
        return this
    }

    // @TODO add spinners here
    // @TODO combine logs here, output when needed
    // @TODO combine this and subBundleStart
    public bundleStart(name: string) {
        log.bold(`${name} ->`).echo()
    }

    public printOptions(title: string, obj: any) {
        log.bold().yellow(`  → ${title}`).echo()

        for (let i in obj) {
            log.green(`      ${i} : ${obj[i]}`).echo();
        }
    }
    public subBundleStart(name: string, parent: string) {
        log.bold(`${name} (child of ${parent}) ->`).echo()
    }

    public bundleEnd(name: string, collection: ModuleCollection) {
        let took = process.hrtime(this.timeStart) as [number, number];

        log
            .ansi()
            .write(`-> Finished`)
            .green(collection.cachedName || collection.name)
            .yellow(`took: ${prettyTime(took, "ms")}`)
            .echo()
    }

    public echoHeader(str: string) {
        log.yellow(` ${str}`).echo()
    }

    public echo(str: string) {
        log.time(true).green(str).echo()
    }

    public echoStatus(str: string) {
        log.title(`→`).cyan(`${str}`).echo()
    }

    public echoInfo(str: string) {
        log.preset('info').green(`  → ${str}`).echo()
    }

    public echoBreak() {
        log.green(`\n  -------------- \n`).echo()
    }

    public echoWarning(str: string) {
        log.red(`  → WARNING ${str}`).echo()
    }

    public echoDefaultCollection(collection: ModuleCollection, contents: string) {
        if (this.printLog === false) return;
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;

        log
            .ansi()
            .write(`└──`)
            .yellow(` (${collection.dependencies.size} files,  ${size})`)
            .green(collection.cachedName || collection.name)
            .echo()

        // @TODO auto indent as with ansi
        collection.dependencies.forEach(file => {
            if (file.info.isRemoteFile) return
            log.title(`     `).dim(`${file.info.fuseBoxPath}`).echo()
        });
    }

    public echoCollection(collection: ModuleCollection, contents: string) {
        if (this.printLog === false) return;
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;

        log
            .ansi()
            .write(`└──`)
            .green(collection.cachedName || collection.name)
            .yellow(size)
            .write(`(${collection.dependencies.size} files)`)
            .echo()
    }

    public end(header?: string) {
        let took = process.hrtime(this.timeStart) as [number, number];
        this.echoBundleStats(header || "Bundle", this.totalSize, took);
    }

    public echoBundleStats(header: string, size: number, took: [number, number]) {
        const sized = log.chalk().yellow(`Size: ${prettysize(size)}`)
        log.text(`${sized} in ${prettyTime(took, "ms")}`).echo()
    }
}
