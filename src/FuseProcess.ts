import { Bundle } from "./core/Bundle";
import { ChildProcess, spawn } from "child_process";

export class FuseProcess {
    public node: ChildProcess;
    public filePath: string;
    constructor(public bundle: Bundle) { }

    public setFilePath(filePath: string) {
        this.filePath = filePath;
    }
    /** Kills a process if exists */
    public kill() {
        if (this.node) {
            this.node.kill();
        }
    }
    /** Starts a process (for example express server) */
    public start(): FuseProcess {
        this.kill();
        this.exec();
        return this;
    }

    /** Spawns another proces */
    public exec(): FuseProcess {
        const node = spawn("node", [this.filePath], {
            stdio: "inherit",
        });
        node.on("close", (code) => {
            if (code === 8) {
                console.error("Error detected, waiting for changes...");
            }
        });
        this.node = node;
        return this;
    }
}