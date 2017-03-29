import { ModuleCollection } from "./core/ModuleCollection";
import { WorkFlowContext } from "./core/WorkflowContext";

const ansi = require("ansi");
const cursor = ansi(process.stdout);
const prettysize = require("prettysize");
const prettyTime = require("pretty-time");

export class Log {
    private timeStart = process.hrtime();
    private totalSize = 0;
    private printLog = true;

    constructor(public context: WorkFlowContext) {
        this.printLog = context.doLog;
    }

    public echoWith(str: string, opt: string) {
        if (this.printLog) {
            cursor.write(` `)[opt]().write(str);
            cursor.write("\n");
            cursor.reset();
        }
    }

    public echoHeader(str: string) {
        if (this.printLog) {
            cursor.write(` `).yellow().write(str);
            cursor.write("\n");
            cursor.reset();
        }
    }

    public echo(str: string) {
        if (this.printLog) {
            let data = new Date();
            let hour: any = data.getHours();
            let min: any = data.getMinutes();
            let sec: any = data.getSeconds();

            hour = hour < 10 ? `0${hour}` : hour;
            min = min < 10 ? `0${min}` : min;
            sec = sec < 10 ? `0${sec}` : sec;

            cursor.write("\n");
            cursor.yellow().write(`${hour}:${min}:${sec} : `)
                .green().write(str);
            cursor.write("\n");
            cursor.reset();
        }
    }

    public echoStatus(str: string) {
        if (this.printLog) {
            cursor.write(`  → `)
                .cyan().write(str);
            cursor.write("\n");
            cursor.reset();
        }
    }

    public echoWarning(str: string) {
        cursor.red().write(`  → WARNING `)
            .write(str);
        cursor.write("\n");
        cursor.reset();
    }

    public echoDefaultCollection(collection: ModuleCollection, contents: string) {
        if (!this.printLog) {
            return;
        }
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;
        cursor.reset().write(`└──`)
            .green().write(` ${collection.cachedName || collection.name}`)
            .yellow().write(` (${collection.dependencies.size} files,  ${size})`);

        cursor.write("\n");
        collection.dependencies.forEach(file => {
            if (!file.info.isRemoteFile) {
                cursor.reset().write(`      ${file.info.fuseBoxPath}`).write("\n");
            }
        });
        cursor.reset();
    }

    public echoCollection(collection: ModuleCollection, contents: string) {
        if (!this.printLog) {
            return;
        }
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;
        cursor.reset().write(`└──`)
            .green().write(` ${collection.cachedName || collection.name}`)
            .reset().write(` (${collection.dependencies.size} files)`)
            .yellow().write(` ${size}`)
            .write("\n").reset();
    }

    public end(header?: string) {
        let took = process.hrtime(this.timeStart) as [number, number];
        this.echoBundleStats(header || "Bundle", this.totalSize, took);
    }

    public echoBundleStats(header: string, size: number, took: [number, number]) {
        if (!this.printLog) {
            return;
        }
        cursor.write("\n")
            .green().write(`    ${header}\n`)
            .yellow().write(`    Size: ${prettysize(size)} \n`)
            .yellow().write(`    Time: ${prettyTime(took, "ms")}`)
            .write("\n").reset();
    }
}
