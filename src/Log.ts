import { ModuleCollection } from './core/ModuleCollection'
import { WorkFlowContext } from './core/WorkflowContext'
import * as log from 'fliplog'
import * as prettysize from 'prettysize'
import * as prettyTime from 'pretty-time'
import * as zlib from 'zlib'

const chalk = log.chalk()
const { yellow, green, blue, dim, underline, italic } = chalk

export type seconds = number
export type nanoseconds = number
export type StrNum = string | number | any
export type StrNums = StrNum[] | StrNum
export type hrtimes = [seconds, nanoseconds]
export type ContentSize = string | number | Buffer | any
export type Obj = Object | any
export type anys = any | [any, any] | [any] | [any, any, any]
export type Filter = string | Function | boolean | null | undefined | any

// should name them so we can do groups later
export class Stats {
    public totalSize: number = 0

    public handle(contents: StrNum): StrNum {
        const [bytes, size] = Stats.prettyBytes(contents)
        this.totalSize += bytes
        return size
    }
    public reset(): Stats {
        this.totalSize = 0
        return this
    }

    // --- getters

    public [Symbol.toPrimitive](hint: string): any {
        if (hint === 'number') return this.totalSize
        return this.totalSize + ''
    }

    // --- utils

    public static gzip(size: ContentSize): StrNums {
        const gzipped = zlib.gzipSync(size, { level: 9 }).length
        const gzippedSize = prettysize(gzipped) + ' (gzipped)'
        const compressedSize = prettysize(size.length)
        return [compressedSize, gzippedSize]
    }
    public static pretty(content: StrNum): StrNum {
        return Stats.prettyBytes(content).pop()
    }
    public static prettyBytes(content: StrNum): StrNums {
        const bytes = typeof content === 'string'
            ? Stats.byteLength(content)
            : content
        const pretty = prettysize(bytes)
        return [bytes, pretty]
    }
    public static byteLength(content: StrNum): number {
        return Buffer.byteLength(content, 'utf8')
    }
}

export class Timer {
    public times: Obj = {}
    public current: Obj = { diff: 0 }
    public index: StrNum = 0

    constructor() {
        this.start('fusebox')
    }
    public reset(): Timer {
        this.times = {}
        this.current = { diff: 0 }
        return this
    }
    public delete(name: StrNum): Timer {
        this.times[name] = {}
        return this
    }

    // @TODO when needed add back lap
    public start(name?: StrNum): Timer {
        if (!name) {
            this.index = this.index + 1
            name = this.index
        }

        this.times[name] = {}
        this.times[name].start = process.hrtime()
        this.current = this.times[name]
        return this
    }
    public stop(name?: StrNum): Timer {
        if (!name) {
            this.index = this.index + 1
            name = this.index
        }

        if (!this.times[name]) {
            // console.log('had no times for ' + name)
            return this
        }

        this.times[name].end = process.hrtime()
        this.times[name].diff = this.diff(this.times[name].start)

        return this
    }

    // getters

    public pretty(arg: anys) {
        // do a diff
        if (Array.isArray(arg)) {
            return this.diff(arg)
        }
        if (typeof arg === 'string' && arg !== '') {
            // do we have it
            if (this.times[arg]) {
                return this.times[arg].diff
            } else {
                // already formatted
                return arg
            }
        }
        return this.toString()
    }

    // @TODO: checks for arrays... should just parse...
    public diff(start: StrNums, end?: StrNums): string {
        let diff = start
        if (!!end) diff = end

        let took: any = process.hrtime(start) // as [number, number];
        return prettyTime(took, 'ms')
    }
    public toString(): string {
        return this[Symbol.toPrimitive]('string')
    }
    public [Symbol.toPrimitive](hint: string): StrNums {
        let pretty = this.current || this.times.fusebox
        if (pretty && pretty.start && !pretty.diff) {
            pretty = this.diff(pretty.start)
        }

        if (hint === 'number') {
            if (!pretty) return 0
            const matches = pretty.match(/\d+/)
            if (Array.isArray(matches)) {
                return matches.shift()
            } else {
                return Infinity
            }
        }

        return pretty || ''
    }
}

// let indnt = 0
const indents = num => {
    // indnt = num
    return num === 0 ? '' : ' '.repeat(num)
}

/**
 * @TODO:
 * - [ ] should .tree the files
 * - [ ] fix the →→→→→→→
 */
export class Log {
    public printLog: any = true
    public debugMode: any = false
    public spinner: any
    // public indent: any = log.indenter();
    public stats: Stats = new Stats()
    public timer: Timer = new Timer()

    constructor(public context: WorkFlowContext) {
        this.printLog = context.doLog
        this.debugMode = context.debugMode
        // this.indent.reset = () => this.indent.clear().set('indent', 0).indent(0);
        // this.indent.level = num => this.indent.reset().indent(num);
        /* prettier-ignore */
        log.filter((arg) => {
            // conditions for filtering specific tags
            const debug = this.debugMode
            const level = this.printLog
            const hasTag = tag =>
                arg.tags.includes(tag)
            const levelHas = tag =>
                debug || level === true ||
                (level && level.includes && level.includes(tag) && !level.includes('!' + tag));

            // when off, silent
            if (level === false) return false;

            // counting this as verbose for now
            if (level === true && debug === true) { return true; }

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
            return true;
        });
    }

    // --- config ---

    public reset(): Log {
        this.timer.start()
        this.stats.reset()
        // this.indent.reset();
        return this
    }
    public printOptions(title: string, obj: Obj): Log {
        let indent = indents(2)
        let indent2 = indents(4)

        // @TODO: moved this into fliplog v1, migrate
        const fmt = obj => {
            return (
                indent2 +
                log
                    .inspector()(obj)
                    .split('\n')
                    .map(data => indent2 + data.trim())
                    .map(data => data.replace(/[{},]/, ''))
                    .join('\n')
                    .trim()
            )
        }

        log.bold().yellow(`${indent}→ ${title}`).echo()
        log.text(fmt(obj)).echo()

        return this
    }

    // --- start end ---
    // @TODO add spinners here
    // @TODO combine logs here, output when needed
    // @TODO combine this and subBundleStart
    public bundleStart(name: string) {
        log.bold(`${name}: `).echo()
        return this
    }

    // @TODO subBundleStop???
    public subBundleStart(name: string, parent: string) {
        this.timer.start(name)
        log.bold(`${name} (child of ${parent}) ->`).echo()
        return this
    }
    public bundleEnd(name: string, collection: ModuleCollection) {
        const took = this.timer.stop(name).toString()

        log
            .ansi()
            .write(`-> Finished`)
            .green(collection.cachedName || collection.name)
            .yellow(`took: ${took}`)
            .echo()
    }

    // --- spinner ---
    public startSpinner(text: string) {
        if (!this.printLog) {
            return this
        }

        // spinner opts
        const indentStr = indents(4)
        const indent = 4
        const interval = 20
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(
            frame => indentStr + frame
        )
        const spinner = { frames, interval }

        // @TODO @FIXME the spinner needs to be scoped inside of fliplog,
        // has todo to update
        this.spinner = log.requirePkg('ora')({ text, indent, spinner })
        this.spinner.start()
        this.spinner.indent = indent // +this.indent;
        this.spinner.succeeded = false

        // safety for if errors happen so it does not keep spinning
        setTimeout(() => {
            if (this.spinner.succeeded === false) {
                this.spinner.fail()
            }
        }, 1000)

        return this
    }
    public stopSpinner(text?: string) {
        if (!this.printLog) {
            return this
        }
        // safety, mark as success
        if (this.spinner && this.spinner.succeeded === false) {
            this.spinner.succeeded = true
            const reference = this.spinner
            // const indent = this.indent.level(this.spinner.indent).toString();

            // @override success to indent
            // reference.succeed()✔
            const success = green(`${indents(4)}→ `)
            text = green(text || reference.text)
            reference.stopAndPersist({ symbol: success, text })

            // it's too fast!
            // setTimeout(() => reference.succeed(), 1)
        }
        return this
    }

    // --- collection stats ---

    /* prettier-ignore */
    /**
     * @example └──  (5 files,  7.6 kB) default
     *          └── fuse-box-css 1.5 kB (1 files)
     *          └── lodash 14.2 kB (12 files)
     * @TODO: list vendor files as filter
     */
    public echoDefaultCollection(collection: ModuleCollection, contents: ContentSize) {
        if (this.printLog === false) return this;

        const size = this.stats.handle(contents)
        // const indent = indents(1);

        /**
         * @example └──  (5 files, 7.6 kB) default
         */
        collection.dependencies.forEach(file => {
            if (file.info.isRemoteFile) return
            // const indent = indents(4)
            log
                .tags('filelist')
                .dim(`${indents(4)}${file.info.fuseBoxPath}`)
                .echo()
        });

        const named = (collection.cachedName || collection.name).trim()
        const collectionName = green(`${named}`)
        const sized = yellow(`(${collection.dependencies.size} files, ${size})`)

        log.text(`${indents(2)}└── ${collectionName} ${sized}`).echo()
        // log
        //     .ansi()
        //     .write()
        //     .yellow()
        //     .green(collectionName)
        //     .echo();

        // this.indent.level(0);
        return this;
    }

    /**
     * @example
     * └── fuse-box-css 1.5 kB (1 files)
     * └── lodash 14.2 kB (12 files)
     */
    public echoCollection(collection: ModuleCollection, contents: ContentSize) {
        if (this.printLog === false) return this

        // const indent = indents(2); // reset
        const size = Stats.pretty(contents)

        const name = (collection.cachedName || collection.name).trim()

        const fileLength = collection.dependencies.size
        const files = `(${fileLength} files)`
        let filesHighlight = files
        if (fileLength === 0) filesHighlight = dim(files)
        else filesHighlight = underline(files)

        log.text(`${indents(2)}└── ${green(name)} ${yellow(size)} `).echo()

        return this
    }

    public end(header?: string) {
        const took = this.timer.stop('fusebox').toString()
        this.echoBundleStats(header || 'Bundle', +this.stats, took)
        return this
    }

    /**
     * @TODO
     *  - [ ] ensure header will not conflict if it is used in echoBundleStats
     *
     * string | number | Buffer
     */
    public echoGzip(size: any, str: string | any = ''): Log {
        if (!size) return this

        const [compressedSize, gzippedSize] = Stats.gzip(size)
        const gzip = yellow(`${compressedSize}, ${gzippedSize}`)

        log
            .title(indents(4))
            .when(str, () => log.text(str), () => log.bold('size: '))
            .data(gzip)
            .echo()

        return this
    }

    /* prettier-ignore */
    /**
     * @example size: 23.2 kB in 583ms
     */
    public echoBundleStats(header: string, size: StrNum, took: hrtimes | StrNum): Log {
        // this.indent.reset();
        const sized = yellow(`${Stats.pretty(size)}`);
        const timed = blue(`${this.timer.pretty(took)} `);
        log.text(`\n size: ${sized} in ${timed} \n`).echo();
        return this;
    }

    // --- bundle specifics ---

    // sparky
    public echoTask(str: string, name: string) {
        const indent = indents(0)

        log.text(`${indent}${italic(str)} ${underline(name)}`).echo()
        return this
    }
    public echoHeader(str: string) {
        const indent = indents(2)
        log.yellow(`${indent}${str}`).echo()
        return this
    }
    public echoStatus(str: string) {
        log.title(`→`).cyan(`${indents(2)}${str}`).echo()
        return this
    }

    // --- generalized ---

    // @NOTE: mostly just quantum
    public groupHeader(str: string) {
        log.color('bold.underline').text(`${str}`).echo()
        return this
    }
    public echoInfo(str: string) {
        const indent = indents(2)
        log.preset('info').green(`${indent}→ ${str}`).echo()
        return this
    }
    public error(error: Error) {
        // @TODO: use this - is implemented
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
    public echoBoldRed(str: string) {
        log.red().bold(str).echo()
        return this
    }
    public echoRed(str: string) {
        log.red(str).echo()
        return this
    }
    public echoBreak() {
        log.green(`\n-------------- \n`).echo()
        return this
    }
    public echoWarning(str: string) {
        log.yellow(`\n  → ${underline('WARNING')} ${str}\n`).echo()
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
