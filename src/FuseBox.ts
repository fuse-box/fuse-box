import { Arithmetic, BundleData } from "./Arithmetic";
import { ModuleWrapper } from "./ModuleWrapper";
import { Module } from "./Module";
import { ModuleCollection } from "./ModuleCollection";
import * as path from "path";
import * as fs from "fs";
import { each, chain, Chainable } from "realm-utils";
const appRoot = require("app-root-path");

const ansi = require("ansi");
const cursor = ansi(process.stdout);
const prettysize = require("prettysize");

export class FuseBoxDump {
    public modules = {};
    public log(moduleName: string, file: string, contents: string) {
        if (!this.modules[moduleName]) {
            this.modules[moduleName] = [];
        }

        let byteAmount = Buffer.byteLength(contents, 'utf8');
        this.modules[moduleName].push({
            name: file,
            bytes: byteAmount
        });
    }

    public printLog() {
        let total = 0;
        for (let name in this.modules) {
            if (this.modules.hasOwnProperty(name)) {
                cursor.green().write(name).write("\n").reset();
                for (let i = 0; i < this.modules[name].length; i++) {
                    let item = this.modules[name][i];
                    total += item.bytes;
                    cursor.grey().write(`  ${item.name} (${prettysize(item.bytes)})`).write("\n").reset();
                }
            }
        }
        cursor.white().write("-------------").write("\n").reset();
        cursor.white().write(`Total: ${prettysize(total)}`).write("\n").reset();
        console.log("");
    }
}
export class FuseBox {
    public homeDir: string;

    public dump: FuseBoxDump = new FuseBoxDump();

    constructor(public opts: any) {
        opts = opts || {};
        if (!opts.homeDir) {
            this.homeDir = appRoot.path;
        } else {
            this.homeDir = path.isAbsolute(opts.homeDir) ? opts.homeDir : path.join(appRoot.path, opts.homeDir);
        }
    }

    public bundle(str: string, standalone?: boolean) {
        let parser = Arithmetic.parse(str);
        return Arithmetic.getFiles(parser, this.homeDir).then(data => {
            return this.process(data, standalone);
        }).catch(e => {
            console.log(e.stack || e);
        });
    }

    public process(bundleData: BundleData, standalone?: boolean) {
        let bundleCollection = new ModuleCollection("default");
        let self = this;
        return bundleCollection.collectBundle(bundleData).then(module => {
            return chain(class extends Chainable {
                public entry: Module;
                public defaultCollection: ModuleCollection;
                public nodeModules: Map<string, ModuleCollection>;
                public defaultContents: string;
                public globalContents = [];

                public setDefaultCollection() {
                    let defaultCollection = new ModuleCollection("default", module);
                    return defaultCollection;
                }
                public addDefaultContents() {
                    return self.getCollectionSource(this.defaultCollection, true).then(cnt => {
                        this.globalContents.push(cnt);
                    });
                }
                public setNodeModules() {
                    return self.collectNodeModules(bundleCollection).then(nodeModules => {
                        return each(nodeModules, (collection, name) => {
                            return self.getCollectionSource(collection).then(cnt => {
                                this.globalContents.push(cnt);
                            });
                        });
                    });
                }
                public format() {
                    return {
                        contents: this.globalContents
                    }
                }

            }).then(result => {
                this.dump.printLog();
                return ModuleWrapper.wrapFinal(result.contents, bundleData.entry, standalone);

            });
        })
    }

    public getCollectionSource(collection: ModuleCollection, depsOnly?: boolean, entryPoint?: string): Promise<string> {
        let entry: Module = collection.entry;

        if (!entry) {
            return new Promise((resolve, reject) => {
                return resolve(ModuleWrapper.wrapModule(collection.name, "", collection.name));
            });
        }
        //this.dump

        let visited: any = {};
        let cnt = [];
        let collectionResources = (module: Module, projectPath?: string) => {

            return new Promise((resolve, reject) => {
                if (!module) {
                    return resolve();
                }
                let rpath = module.getProjectPath(entry, entry.dir);

                if (!visited[rpath]) {
                    visited[rpath] = true;
                    let content = ModuleWrapper.wrapGeneric(rpath, module.contents);
                    this.dump.log(collection.name, rpath, content);
                    cnt.push(content);
                    return each(module.dependencies, dep => {
                        return collectionResources(dep);
                    }).then(resolve).catch(reject);
                }
                return resolve();
            });
        };

        if (depsOnly) { // bundle might not have an entry point. Instead we just process dependencies
            return each(entry.dependencies, dep => {
                return collectionResources(dep, entry.dir);
            }).then(result => {
                return ModuleWrapper.wrapModule(collection.name, cnt.join("\n"), entryPoint);
            });
        }
        return collectionResources(entry).then(result => {
            return ModuleWrapper.wrapModule(collection.name, cnt.join("\n"), entry.getProjectPath());
        });
    }


    public collectNodeModules(defaultCollection: ModuleCollection): Promise<Map<string, ModuleCollection>> {
        let modules: Map<string, ModuleCollection> = new Map();
        let collect = (nodeModules: Map<string, ModuleCollection>) => {
            return each(nodeModules, (collection, name) => {
                if (!modules.has(name)) {
                    modules.set(name, collection);
                    if (collection.nodeModules.size > 0) {
                        return new Promise((resolve, reject) => {
                            process.nextTick(() => {
                                return resolve(collect(collection.nodeModules));
                            });
                        });
                    }
                }
            });
        };
        return collect(defaultCollection.nodeModules).then(x => modules);
    }
}
