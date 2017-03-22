import { SparkTask } from "./SparkTask";
import { SparkFlow } from "./SparkFlow";
import { each } from "realm-utils";
import { WorkFlowContext } from "../core/WorkflowContext";
import { Log } from "../Log";
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

        if (arguments.length === 2) {
            callback = arguments[1];
        }
        if (arguments.length === 3) {
            dependencies = [].concat(arguments[1]);
            callback = arguments[2];
        }
        this.tasks.set(name, new SparkTask(name, dependencies, callback));
        // launching the task on next tick
        if (this.launch === false && this.testMode === false) {
            this.launch = true;
            process.nextTick(() => this.start());
        }
        return this;
    }

    public static src(str: string): SparkFlow {
        const flow = new SparkFlow();
        return flow.glob(str);
    }

    public static watch(glob: string, opts: any) {
        const flow = new SparkFlow();
        return flow.watch(glob, opts);
    }
    public static start(tname?: string): Promise<any> {
        const taskName = tname || process.argv[2] || "default";
        if (!this.tasks.get(taskName)) {
            log.echoWarning(`Task with such name ${taskName} was not found!`);
            return Promise.reject("Task not found");
        }

        const task = this.tasks.get(taskName);
        log.echoHeader(`Launch "${taskName}"`);

        return Promise.all([
            // resolve parallel dependencies
            Promise.all(task.parallelDependencies.map(name => this.resolve(name))),
            // resolve waterfal dependencies
            each(task.waterfallDependencies, name => this.resolve(name))
        ]).then(() => {
            return this.execute(task.fn());
        });
    }

    private static execute(result: any) {
        if (result instanceof SparkFlow) {
            return result.exec();
        }
        return result;
    }

    private static resolve(name: string) {
        if (!this.tasks.get(name)) {
            return log.echoWarning(`Task with such name ${name} was not found!`);
        }
        log.echoHeader(` Resolve "${name}"`);
        return this.execute(this.tasks.get(name).fn());
    }

}
