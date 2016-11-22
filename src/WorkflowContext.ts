import * as path from 'path';
import * as fs from 'fs';
import { BundleSource } from "./BundleSource";
import { File } from "./File";
import { Log } from "./Log";
import { IPackageInformation, AllowedExtenstions } from "./PathMaster";
import { ModuleCollection } from "./ModuleCollection";
import { ModuleCache } from "./ModuleCache";
const appRoot = require("app-root-path");


export interface Plugin {
    test?: RegExp;
    dependencies?: string[];
    init: { (context: WorkFlowContext) };
    transform: { (file: File, ast?: any) };
}

/**
 * WorkFlowContext
 */
export class WorkFlowContext {


    public nodeModules: Map<string, ModuleCollection> = new Map();
    public libPaths: Map<string, IPackageInformation> = new Map();
    public homeDir: string;
    public printLogs = true;
    public plugins: Plugin[];
    public useCache = true;
    public doLog = true;
    public cache = new ModuleCache(this);
    public tsConfig: any;
    public customModulesFolder: string;
    public tsMode = false;
    public globals: string[] = [];
    public standaloneBundle: boolean = true;
    public source: BundleSource;
    public sourceMapConfig: any;
    public outFile: string;

    public log: Log;

    public reset() {
        this.log = new Log(this.doLog);
        this.source = new BundleSource(this);
        this.nodeModules = new Map();
        this.libPaths = new Map();
    }

    public allowExtension(ext: string) {
        AllowedExtenstions.add(ext);
    }
    public setHomeDir(dir: string) {
        this.homeDir = dir;
    }

    public setLibInfo(name: string, version: string, info: IPackageInformation) {
        let key = `${name}@${version}`;
        if (!this.libPaths.has(key)) {
            return this.libPaths.set(key, info);
        }
    }

    public convert2typescript(name: string) {
        return name.replace(/\.ts$/, ".js");
    }
    public getLibInfo(name: string, version: string): IPackageInformation {
        let key = `${name}@${version}`;
        if (this.libPaths.has(key)) {
            return this.libPaths.get(key);
        }
    }

    public setPrintLogs(printLogs) {
        this.printLogs = printLogs;
    }

    public setUseCache(useCache: boolean) {
        this.useCache = useCache;
    }

    public hasNodeModule(name: string) {
        return this.nodeModules.has(name);
    }

    public addNodeModule(name: string, collection: ModuleCollection) {
        this.nodeModules.set(name, collection);
    }

    public getTypeScriptConfig() {
        if (this.tsConfig) {
            return this.tsConfig;
        }
        let url = path.join(this.homeDir, "tsconfig.json");
        if (fs.existsSync(url)) {
            this.tsConfig = require(url);
        } else {
            this.tsConfig = {
                compilerOptions: {}
            };
        }
        this.tsConfig.compilerOptions.module = "commonjs";
        if (this.sourceMapConfig) {
            this.tsConfig.compilerOptions.sourceMap = true;
            this.tsConfig.compilerOptions.inlineSources = true;
        }
        return this.tsConfig;
    }

    public writeOutput() {
        let res = this.source.getResult();

        // Writing sourcemaps
        if (this.sourceMapConfig && this.sourceMapConfig.outFile) {
            let outFile = this.sourceMapConfig.outFile;
            if (!path.isAbsolute(outFile)) {
                outFile = path.join(appRoot.path, outFile);
            }
            fs.writeFile(outFile, res.sourceMap);
        }

        // writing target
        if (this.outFile) {
            if (!path.isAbsolute(this.outFile)) {
                this.outFile = path.join(appRoot.path, this.outFile);
            }
            fs.writeFile(this.outFile, res.content);
        }
    }

    public getNodeModule(name: string): ModuleCollection {
        return this.nodeModules.get(name);
    }
}