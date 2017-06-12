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
    public printLog: any = true;
    public debugMode: any = false;
    public spinner: any;
    private totalSize = 0;

    constructor(public context: WorkFlowContext) {
        this.printLog = context.doLog;
        this.debugMode = context.debugMode;

        log.filter((arg) => {
            // conditions for filtering specific tags
            const debug = this.debugMode
            const level = this.printLog

            // when off, silent
            if (level === false) return false

            // counting this as verbose for now
            if (level === true && debug === true) return null

            if (level == 'error') {
                if (!arg.tags.includes('error')) return false
            }
            // could be verbose, reasoning, etc
            if (arg.tags.includes('magic')) {
                if (!debug && !level.includes('magic')) return false
            }

            // if not false and conditions pass, log it
            return null
        })
    }

    // --- config ---

    public reset(): Log {
        this.timeStart = process.hrtime();
        this.totalSize = 0;
        return this
    }
    public printOptions(title: string, obj: any) {
        log.bold().yellow(`  → ${title}`).echo()

        for (let i in obj) {
            log.green(`      ${i} : ${obj[i]}`).echo();
        }
        return this
    }

    // --- start end ---
    // @TODO add spinners here
    // @TODO combine logs here, output when needed
    // @TODO combine this and subBundleStart
    public bundleStart(name: string) {
        log.bold(`${name} ->`).echo()
        return this
    }
    public subBundleStart(name: string, parent: string) {
        log.bold(`${name} (child of ${parent}) ->`).echo()
        return this
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

    // --- spinner ---
    public startSpinner(text: string) {
        this.spinner = log.requirePkg('ora')(text)
        this.spinner.start(text)
        this.spinner.text = text
        return this
    }
    public stopSpinner() {
        if (this.spinner) {
            const reference = this.spinner
            // it's too fast!
            // setTimeout(() => reference.succeed(), 1000)
        }
        return this
    }

    // --- collection stats ---

    public echoDefaultCollection(collection: ModuleCollection, contents: string) {
        if (this.printLog === false) return this;
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
        return this
    }

    public echoCollection(collection: ModuleCollection, contents: string) {
        if (this.printLog === false) return this;
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

        return this
    }

    public end(header?: string) {
        let took = process.hrtime(this.timeStart) as [number, number];
        this.echoBundleStats(header || "Bundle", this.totalSize, took);
        return this
    }

    /**
     * @TODO
     *  - [ ] ensure header will not conflict if it is used in echoBundleStats
     */
    public echoGzip(size: string | number, msg: string | any = '') {
        if (!size) return this
        const yellow = log.chalk().yellow
        const gzipped = zlib.gzipSync(size, { level: 9 }).length
        const prettyGzip = yellow(prettysize(gzipped) + ' (gzipped)')
        log
            .when(msg,
                () => log.text(msg),
                () => log.bold('size: '))
            .data(prettyGzip)
            .echo()
        return this
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
        return this
    }

    // --- bundle specifics ---

    public echoHeader(str: string) {
        log.yellow(` ${str}`).echo()
        return this
    }
    public echoStatus(str: string) {
        log.title(`→`).cyan(`${str}`).echo()
        return this
    }

    // --- generalized ---

    public echoInfo(str: string) {
        log.preset('info').green(`  → ${str}`).echo()
        return this
    }
    public error(error: Error) {
        // @TODO: finish forking notifier & dep chain
        // if (this.printLog.includes('notify')) {
        //     log.factory().notify({title: error.message, message: error.stack}).echo()
        // }

        log.tags('error').data(error).echo()
        return this
    }

    // @NOTE: later this will be used with preset tags
    public magicReason(str: string, metadata: any = false) {
        if (metadata) {
            log.data(metadata)
        }
        log.tags('magic').magenta(str).echo()
        return this
    }


    // -----------
    // simplified shorthands for external formatting
    // @TODO: anything using these should be fomatted inside of the logger
    // -----------
    public echo(str: string) {
        log.time(true).green(str).echo()
        return this
    }
    public echoBoldRed(msg) {
        log.red().bold(msg).echo();
        return this
    }
    public echoRed(msg) {
        log.red(msg).echo();
        return this
    }
    public echoBreak() {
        log.green(`\n  -------------- \n`).echo()
        return this
    }
    public echoWarning(str: string) {
        log.yellow(`  → WARNING ${str}`).echo()
        return this
    }
    public echoYellow(str: string) {
        log.yellow(str).echo()
        return this
    }
    public echoGray(str: string) {
        log.gray(str).echo()
        return this
    }
}
