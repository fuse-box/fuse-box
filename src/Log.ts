import { ModuleCollection } from "./core/ModuleCollection";
import { WorkFlowContext } from "./core/WorkflowContext";
import * as log from "fliplog";
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

    public bundleStart(name: string) {
        log.cyan().bold("\n" + name + " -> \n\n").echo()
    }
    public subBundleStart(name: string, parent: string) {
        log.cyan().bold("\n" + name + ` (child of ${parent}) -> \n\n`).echo()
    }

    public bundleEnd(name: string, collection: ModuleCollection) {
        let took = process.hrtime(this.timeStart) as [number, number];

        const named = log
          .chalk()
          .green(` ${collection.cachedName || collection.name}`)

        log
          .text(`-> Finished `).echo()
          .yellow(`${named} took: ${prettyTime(took, "ms")}`).echo()
    }

    public echoHeader(str: string) {
      log.yellow(` ${str}`).echo()
    }

    public echo(str: string) {
        log.time(true).green(str).echo()
    }

    public echoStatus(str: string) {
      log
        .title(`→ \n `).cyan(`${str} \n`).echo()
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
        if (!this.printLog) {
            return;
        }
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;

        const chalk = log.chalk()
        const yellowSize = chalk.yellow(` (${collection.dependencies.size} files,  ${size})`)
        const greenName = chalk.green(` ${collection.cachedName || collection.name} `)

        log
          .title(`└──`)
          .text(`${greenName} ${yellowSize}`)
          .echo()

        collection.dependencies.forEach(file => {
            if (!file.info.isRemoteFile) {
              // should auto indent
              log.text(`      ${file.info.fuseBoxPath}\n`).echo()
            }
        });
    }

    public echoCollection(collection: ModuleCollection, contents: string) {
        if (!this.printLog) {
            return;
        }
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;

        log
          .text(`└──`).echo()
          .green(` ${collection.cachedName || collection.name}`).echo()
          .text(` (${collection.dependencies.size} files)`).echo()
          .yellow(` ${size} `).echo()
    }

    public end(header?: string) {
        let took = process.hrtime(this.timeStart) as [number, number];
        this.echoBundleStats(header || "Bundle", this.totalSize, took);
    }

    public echoBundleStats(header: string, size: number, took: [number, number]) {
      const sized = log.chalk().yellow(`Size: ${prettysize(size)} `)
      log.text(`${sized} in ${prettyTime(took, "ms")}` ).echo()
    }
}
