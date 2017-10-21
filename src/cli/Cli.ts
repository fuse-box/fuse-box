import * as yargs from "yargs";
import { Sparky } from "../sparky/Sparky";

export interface Task {
    name: string;
    desc: string;
    active: boolean;
};
export type Tasks = {[name: string]: Task};
export type Option = object;
export type Options = {[name: string]: Option};
export type TaskDescriptions = {[name: string]: string};

export interface Settings {
    taskDescriptions?: TaskDescriptions;
    options?: Options;
};

export class FuseBoxCLI {
    private static initialized: boolean = false;
    private _tasks: Tasks = {};
    private optionValues: {[name:string]: any} = {}; // The parsed options will land here

    constructor(settings: Settings = {}) {
        if (FuseBoxCLI.initialized) {
            throw new Error("CLI was already initialized! Use .shutdown() first");
        }
        FuseBoxCLI.initialized = true;

        this.initYargs();
        this.initTaskRegisterer();
        this.initRunners();

        this.addOptions(settings.options);
        this.addTaskDescriptions(settings.taskDescriptions);
    }

    public addOption(name: string , option: Option) {
        option["global"] = false; // Make the option be resetted correctly
        this.optionValues[name] = yargs.option(name, option).argv[name];

        return this;
    }

    public addOptions(options: Options = {}) {
        Object.keys(options).forEach(name => {
            this.addOption(name, options[name]);
        });

        return this;
    }

    public addTaskDescription(name: string, desc: string) {
        this._tasks[name] = {
            active: false, // Default is, not active
            ...this._tasks[name],
            name,
            desc
        };

        return this;
    }

    public addTaskDescriptions(descriptions: TaskDescriptions = {}) {
        Object.keys(descriptions).forEach(name => {
            this.addTaskDescription(name, descriptions[name]);
        });

        return this;
    }

    public addTask(name: string) {
        this._tasks[name] = {
            ...this._tasks[name],
            name,
            active: true
        };

        return this;
    }

    public showHelp(exitProcess = false) {
        yargs.getUsageInstance().getCommands().splice(0); // Clean up the current commands

        Object.keys(this._tasks).forEach(name => {
            const task = this._tasks[name];
            if (!task.active) return; // The task is not active
            let taskName = task.name;
            let taskDesc = task.desc || "";

            if (task.name === "default") {
                taskName = "\b\b* default\0\0";
                taskDesc = taskDesc || "The default task";
            }

            yargs.command(taskName+"\0", "\b"+taskDesc);
        });

        yargs.showHelp("log");
        if (exitProcess) process.exit(0);

        return this;
    }

    public run() {
        if (!yargs.argv.help) return;
    
        this.shutDown(); // Lets shutdown
        this.showHelp(true); // Show the last help

        return this;
    }

    public parse(argv = process.argv) {
        yargs.parse(argv);

        Object.keys(this.optionValues).forEach(name => {
            this.optionValues[name] = yargs.argv[name];
        });

        return this;
    }

    public shutDown() {
        FuseBoxCLI.initialized = false;
        Sparky.start = Sparky["$start"] || Sparky.start;
        Sparky.task = Sparky["$task"] || Sparky.task;
        delete Sparky["$start"];
        delete Sparky["$task"];
        process.removeAllListeners("exit");

        return this;
    }

    private initYargs() {
        yargs
            .reset()
            .usage("Usage: $0 <task> [options]")
            .updateStrings({ "Commands:": "Tasks:" })
            .help(false)
            .version(false)
            .option("help", {
                alias: "h",
                desc: "Show help",
                type: "boolean",
                global: false
            });
    }

    private initRunners() {
        const self = this;
        process.on("exit", () => this.run());

        Sparky["$start"] = Sparky.start;
        Sparky.start = function() {
            self.run();
            return Sparky["$start"].apply(this, arguments);
        };
    }

    private initTaskRegisterer() {
        const self = this;
        
        Sparky["$task"] = Sparky.task;
        Sparky.task = function(name) {
            self.addTask(name);

            return Sparky["$task"].apply(this, arguments);
        };
    }

    // Getter / Setter
    public get tasks() { return this._tasks; }
    public get options() { return this.optionValues; }
    public get $yargs() { return yargs; } // Open our insides. Let people be able to hack :)
}

export function CLI(settings?: Settings) {
    return new FuseBoxCLI(settings);
}
