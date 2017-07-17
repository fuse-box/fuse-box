import { ModuleCollection } from "./core/ModuleCollection";
import { WorkFlowContext } from "./core/WorkflowContext";
import * as log from "fliplog";
import * as prettysize from "prettysize";
import * as  prettyTime from "pretty-time";
import * as zlib from "zlib";

// @TODO: I've moved this into fliplog in v1, migrate to that
export class Indenter {
    public store: Map<string, any> = new Map()
    constructor() {
        this.set('indent', 0);
    }

    // easy set/set
    public set(key: string, val: any): Indenter {
        this.store.set(key, val)
        return this;
    }
    public get(key: string) {
        return this.store.get(key);
    }
    // back to 0
    public reset(): Indenter {
        return this.set('indent', 0);
    }
    // tap value
    public tap(key: string, cb: Function): Indenter {
        const updated = cb(this.store.get(key));
        return this.set(key, updated);
    }
    // increment
    public indent(level: number): Indenter {
        return this.tap('indent', indent => indent + level);
    }
    // specific number
    public level(level: number): Indenter {
        return this.set('indent', level);
    }
    // string repeat indent
    public toString(): string {
        return ' '.repeat(this.get('indent'))
    }
    public toNumber(): number {
        return this.get('indent');
    }
    public [Symbol.toPrimitive](hint: string) {
        if (hint === 'number') { return this.toNumber(); }
        return this.toString();;
    }
}

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
    public indent: Indenter = new Indenter();
    private totalSize = 0;

    constructor(public context: WorkFlowContext) {
        this.printLog = context.doLog;
        this.debugMode = context.debugMode;

        log.filter((arg) => {
            // conditions for filtering specific tags
            const debug = this.debugMode
            const level = this.printLog
            const hasTag = tag =>
                arg.tags.includes(tag)
            const levelHas = tag =>
                debug || (level && level.includes && level.includes(tag) && !level.includes('!' + tag));


            // when off, silent
            if (level === false) return false;

            // counting this as verbose for now
            if (level === true && debug === true) { return null; }

            if (level == 'error') {
                if (!hasTag('error')) { return false; }
            }
            // could be verbose, reasoning, etc
            if (hasTag('magic')) {
                if (!levelHas('magic')) { return false; }
            }
            if (hasTag('filelist')) {
                if (!levelHas('filelist')) { return false; }
            }

            // if not false and conditions pass, log it
            return null;
        });;
    }

    // --- config ---

    public reset(): Log {
        this.timeStart = process.hrtime();
        this.totalSize = 0;
        this.indent.reset();
        return this;
    }
    public printOptions(title: string, obj: any) {
        let indent = this.indent.level(2) + '';;

        let indent2 = this.indent.level(4) + '';;

        // @TODO: moved this into fliplog v1, migrate
        log.addPreset('min', instance => {
            instance.formatter(data => {
                return log.inspector()(data).split('\n')
                    .map(data => indent2 + data)
                    .map(data => data.replace(/[{},]/, ''))
                    .join('\n');;
            });
        });

        log.bold().yellow(`${indent}→ ${title}\n`).preset('min').data(obj).echo();

        // for (let i in obj) {
        //     indent = this.indent.level(6) + ''
        //     log.green(`${indent}${i} : ${obj[i]}`).echo();
        // }
        // this.indent.indent(-2)
        return this;
    }

    // --- start end ---
    // @TODO add spinners here
    // @TODO combine logs here, output when needed
    // @TODO combine this and subBundleStart
    public bundleStart(name: string) {
        log.gray(``).echo();
        log.gray(`--------------------------`).echo();
        log.magenta(`Bundle "${name}" `).echo();
        log.gray(``).echo();
        return this;
    }
    public subBundleStart(name: string, parent: string) {
        log.bold(`${name} (child of ${parent}) ->`).echo();
        return this;
    }
    public bundleEnd(name: string, collection: ModuleCollection) {
        let took = process.hrtime(this.timeStart) as [number, number];

        log
            .ansi()
            .write(`-> Finished`)
            .green(collection.cachedName || collection.name)
            .yellow(`took: ${prettyTime(took, "ms")}`)
            .echo();
    }

    // --- spinner ---
    public startSpinner(text: string) {
        if (!this.printLog) { return this; }

        // spinner opts
        const indentStr = this.indent.toString();
        const indent = +this.indent;
        const interval = 20;
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(frame => indentStr + frame);
        const spinner = { frames, interval };

        // @TODO @FIXME the spinner needs to be scoped inside of fliplog, has todo to update
        // instantiate
        this.spinner = log.requirePkg('ora')({ text, indent, spinner });
        this.spinner.start();
        this.spinner.indent = +this.indent;
        this.spinner.succeeded = false;

        // safety for if errors happen so it does not keep spinning
        setTimeout(() => {
            if (this.spinner.succeeded === false && this.spinner.fail) {
                this.spinner.fail();;
            }
        }, 1000);

        return this;
    }
    public stopSpinner(text?: string) {
        if (!this.printLog) { return this; }
        // safety, mark as success
        if (this.spinner && this.spinner.succeeded === false) {
            this.spinner.succeeded = true;
            const reference = this.spinner;
            const indent = this.indent.level(this.spinner.indent).toString();

            // @override success to indent
            // reference.succeed()
            const success = log.chalk().green(`${indent}✔ `);
            text = text || reference.text;
            reference.stopAndPersist({ symbol: success, text });

            // it's too fast!
            // setTimeout(() => reference.succeed(), 1)
        }
        return this;
    }

    // --- collection stats ---

    // @TODO: list vendor files as filter
    public echoDefaultCollection(collection: ModuleCollection, contents: string) {
        if (this.printLog === false) return this;
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;

        const indent = this.indent.reset().indent(+1).toString();

        // @example └──  (5 files, 7.6 kB) default
        // @TODO auto indent as with ansi
        collection.dependencies.forEach(file => {
            if (file.info.isRemoteFile) { return; }
            const indent = this.indent.level(4).toString()
            log
                // .tags('filelist')
                .white(`${indent}${file.info.fuseBoxPath}`)
                .echo()
        });

        log
            .ansi()
            .write(`└──`)
            .yellow(`${indent}(${collection.dependencies.size} files,  ${size})`)
            .green(collection.cachedName || collection.name)
            .echo();

        this.indent.level(0);
        return this;
    }

    // @example
    // └── fuse-box-css 1.5 kB (1 files)
    // └── lodash 14.2 kB (12 files)
    public echoCollection(collection: ModuleCollection, contents: string) {
        if (this.printLog === false) { return this; }
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;
        const indent = this.indent.toString(); // reset

        const name = (collection.cachedName || collection.name).trim();

        log
            .ansi()
            .write(`${indent}└──`)
            .green(name)
            .yellow(size)
            .write(`(${collection.dependencies.size} files)`)
            .echo();

        return this;
    }

    public end(header?: string) {
        let took = process.hrtime(this.timeStart) as [number, number];
        this.echoBundleStats(header || "Bundle", this.totalSize, took);
        return this;
    }

    /**
     * @TODO
     *  - [ ] ensure header will not conflict if it is used in echoBundleStats
     *
     * string | number | Buffer
     */
    public echoGzip(size: any, msg: string | any = '') {
        if (!size) return this;
        const yellow = log.chalk().yellow;
        const gzipped = zlib.gzipSync(size, { level: 9 }).length;
        const gzippedSize = prettysize(gzipped) + ' (gzipped)';
        const compressedSize = prettysize(size.length);
        const prettyGzip = yellow(`${compressedSize}, ${gzippedSize}`);
        log
            .title(this.indent + '')
            .when(msg,
            () => log.text(msg),
            () => log.bold('size: '))
            .data(prettyGzip)
            .echo();
        return this;
    }

    /**
     * @TODO @FIXME
     * - [ ] bundle stats are wrong because they use accumulated size,
     *       not the uglified end result size
     *       use uglified and QuantumPlugin output
     */
    public echoBundleStats(header: string, size: number, took: [number, number]) {
        this.indent.reset();
        const yellow = log.chalk().yellow;
        const sized = yellow(`${prettysize(size)}`);
        log.text(`size: ${sized} in ${prettyTime(took, "ms")}`).echo();
        return this;
    }

    // --- bundle specifics ---

    public echoHeader(str: string) {
        this.indent.level(1);
        log.yellow(`${this.indent}${str}`).echo();
        return this;
    }
    public echoStatus(str: string) {
        log.title(`→`).cyan(`${str}`).echo();
        return this;
    }

    // --- generalized ---
    public groupHeader(str: string) {
        log.color('bold.underline').text(`${str}`).echo();
        return this;
    }
    public echoInfo(str: string) {
        const indent = this.indent.level(2);
        log.preset('info').green(`${indent}→ ${str}`).echo();
        return this;
    }
    public error(error: Error) {
        // @TODO: finish forking notifier & dep chain
        // if (this.printLog.includes('notify')) {
        //     log.factory().notify({title: error.message, message: error.stack}).echo()
        // }

        log.tags('error').data(error).echo();
        return this;
    }

    // @NOTE: later this will be used with preset tags
    public magicReason(str: string, metadata: any = false) {
        if (metadata) {
            log.data(metadata);
        }
        log.tags('magic').magenta(str).echo();
        return this;
    }


    // -----------
    // simplified shorthands for external formatting
    // @TODO: anything using these should be fomatted inside of the logger
    // -----------
    public echo(str: string) {
        log.time(true).green(str).echo();
        return this;
    }
    public echoBoldRed(msg) {
        log.red().bold(msg).echo();
        return this;
    }
    public echoRed(msg) {
        log.red(msg).echo();
        return this;
    }
    public echoBreak() {
        log.green(`\n  -------------- \n`).echo();
        return this;
    }
    public echoWarning(str: string) {
        log.yellow(`  → WARNING ${str}`).echo();
        return this;
    }
    public echoYellow(str: string) {
        log.yellow(str).echo();
        return this;
    }
    public echoGray(str: string) {
        log.gray(str).echo();
        return this;
    }
}
