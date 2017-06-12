import { ModuleCollection } from "./core/ModuleCollection";
import { WorkFlowContext } from "./core/WorkflowContext";
const log = require("fliplog");
const prettysize = require("prettysize");
const prettyTime = require("pretty-time");
const zlib = require("zlib");

/**
 * @TODO:
 * - [ ] should add filters for outputing fs
 * - [ ] should .tree the files
 * - [ ] fix the →→→→→→→
 */
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


    public echoBoldRed(msg) {
        log.red().bold(msg).echo();
    }

    public echoRed(msg) {
        log.red(msg).echo();
    }
    public echoBreak() {
        log.green(`\n  -------------- \n`).echo()
    }

    public echoWarning(str: string) {
        log.yellow(`  → WARNING ${str}`).echo()
    }

    public echoYellow(str: string) {
        log.yellow(str).echo()
    }

    public echoGray(str: string) {
        log.gray(str).echo()
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

    /**
     * @TODO
     *  - [ ] ensure header will not conflict if it is used in echoBundleStats
     */
    public echoGzipSize(size: string | number) {
        const yellow = log.chalk().yellow
        const gzipped = zlib.gzipSync(size, { level: 9 }).length
        const prettyGzip = yellow(prettysize(gzipped))
        log.text(`gzip: ${prettyGzip}`).echo()
    }

    /**
     * @TODO @FIXME
     * - [ ] bundle stats are wrong because they use accumulated size,
     *       not the uglified end result size
     *       use uglified and QuantumPlugin output
     */
    public echoBundleStats(header: string, size: number, took: [number, number]) {
        const yellow = log.chalk().yellow
        const sized = yellow(`${prettysize(size)}`)
        log.text(`size: ${sized} in ${prettyTime(took, "ms")}`).echo()
    }
}
