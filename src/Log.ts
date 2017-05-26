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
        log.filter(() => this.printLog)
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

        log
          .text(`-> Finished `).echo()
          .green(name).echo()
          .green(` ${collection.cachedName || collection.name}`).echo()
          .yellow(`took: ${prettyTime(took, "ms")}`).echo()
    }

    public echoHeader(str: string) {
      log.yellow(` ${str} \n`).echo()
    }

    public echo(str: string) {
        log.time(true).green(str).echo()
    }

    public echoStatus(str: string) {
      log
        .text(`  → `).echo()
        .cyan(str + "\n").echo()
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

        log
          .text(`└──`).echo()
          .green(` ${collection.cachedName || collection.name}`).echo()
          .yellow(` (${collection.dependencies.size} files,  ${size})\n`).echo()

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
          .yellow(` ${size} \n`).echo()
    }

    public end(header?: string) {
        let took = process.hrtime(this.timeStart) as [number, number];
        this.echoBundleStats(header || "Bundle", this.totalSize, took);
    }

    public echoBundleStats(header: string, size: number, took: [number, number]) {
      log
        .text(`\n`).echo()
        .yellow(`    Size: ${prettysize(size)}`).echo()
        .text(` in ${prettyTime(took, "ms")}\n`).echo()
    }
}
