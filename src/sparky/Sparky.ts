import { SparkTask } from "./SparkTask";
import { SparkFlow } from "./SparkFlow";
import { SparkyFilePatternOptions } from "./SparkyFilePattern";
import { each } from "realm-utils";
import { WorkFlowContext } from "../core/WorkflowContext";
import { Log } from "../Log";
import { SparkyContext, SparkyContextClass, getSparkyContext } from './SparkyContext';
import { FuseBoxOptions } from '../index';
import { FuseBox } from '../core/FuseBox';

const context = new WorkFlowContext();
context.doLog = process.env.SPARKY_LOG !== 'false';
export const log = new Log(context);

export class Sparky {
    static launch = false;
    static testMode = false;
    static tasks = new Map<string, SparkTask>();

    public static flush() {
        this.tasks = new Map<string, SparkTask>();
    }

    /** Create a new task */
    public static task(name: string, ...args): Sparky {
        let callback: any;
        let dependencies: string[] = [];
        let secondArgument = arguments[1];

        if (Array.isArray(secondArgument) || typeof secondArgument === "string") {
            dependencies = [].concat(secondArgument);
            callback = arguments[2];
        } else {
            callback = arguments[1];
        }
        this.tasks.set(name, new SparkTask(name, dependencies, callback));
        // launching the task on next tick
        if (this.launch === false && this.testMode === false) {
            this.launch = true;
            process.nextTick(async () => {
                await this.start()
            });
        }
        return this;
    }

    public static context(target:
        () => { [key: string]: any } |
            (new () => any) |
            { [key: string]: any }): SparkyContextClass {
        return SparkyContext(target);
    }

    public static src(glob: string | string[], opts?: SparkyFilePatternOptions): SparkFlow {
        const flow = new SparkFlow();
        let globs = Array.isArray(glob) ? glob : [glob]
        return flow.glob(globs, opts);
    }

    public static watch(glob: string | string[], opts?: SparkyFilePatternOptions) {
        const flow = new SparkFlow();
        let globs = Array.isArray(glob) ? glob : [glob]
        return flow.watch(globs, opts);
    }

    public static fuse(fn: (context: any) => FuseBoxOptions) {
        process.nextTick(() => {
            const sparkyContext = getSparkyContext();
            sparkyContext._getFuseBoxOptions = () => FuseBox.init(fn(sparkyContext))
            Object.defineProperty(sparkyContext, 'fuse', {
                get: () => {
                    if (!sparkyContext._fuseInstance) {
                        sparkyContext._fuseInstance = sparkyContext._getFuseBoxOptions();
                    }
                    return sparkyContext._fuseInstance;
                }
            });
            return sparkyContext._fuseInstance;
        });
    }

    public static init(paths: string[]) {
        const flow = new SparkFlow();
        flow.createFiles(paths);
        return flow;
    }

    public static async exec(...args: Array<string | (() => any)>) {
        for (const task of args) {
            if (typeof task === "string") {
                await this.resolve(task)
            } else {
                await task();
            }
        }
    }

    public static async start(tname?: string): Promise<any> {
        let start = process.hrtime();
        const taskName = tname || process.argv[2] || "default";
        if (!this.tasks.get(taskName)) {
            log.echoWarning(`Task with such name ${taskName} was not found!`);
            return Promise.reject("Task not found");
        }
        log.echoSparkyTaskStart(taskName)

        const task = this.tasks.get(taskName);
        await Promise.all([
            // resolve parallel dependencies
            Promise.all(task.parallelDependencies.map(name => this.resolve(name))),
            // resolve waterfal dependencies
            each(task.waterfallDependencies, name => this.resolve(name))
        ])
        let res;
        if( typeof task.fn === 'function'){
            res = await this.execute(task.fn(getSparkyContext()))
        }
        log.echoSparkyTaskEnd(taskName, process.hrtime(start));
        return res;
    }

    private static execute(result: any) {
        if (result instanceof SparkFlow) {
            return result.exec();
        }
        return result;
    }

    private static async resolve(name: string) {
        if (!this.tasks.get(name)) {
            return log.echoWarning(`Task with such name ${name} was not found!`);
        }
        return await this.start(name);
    }

}
