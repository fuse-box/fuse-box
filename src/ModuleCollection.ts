import { Module } from "./Module";
import * as path from "path";
import * as fs from "fs";
import { each } from "realm-utils";
import { BundleData, IBundleInformation } from "./Arithmetic";

const MODULE_CACHE = {};

const appRoot = require("app-root-path");
const NODE_MODULES_DIR = path.join(appRoot.path, "node_modules");
const LOCAL_LIBS = path.join(__dirname, "../../assets/libs");

export class ModuleCollection {
    public nodeModules: Map<string, ModuleCollection> = new Map();
    public dependencies: Map<string, Module> = new Map();
    public bundle: BundleData;
    constructor(public name: string, public entry?: Module) {

    }
    public collect() {
        return this.resolve(this.entry);
    }

    public collectBundle(data: BundleData): Promise<Module> {
        this.bundle = data;
        // faking entry point
        let module = new Module();
        module.setDir(data.homeDir); // setting a home directory for a module (even though it does not have a file)

        return each(data.including, (withDeps, modulePath) => {
            return this.processModule(module, modulePath);
        }).then(x => {
            return module;
        });
    }

    public resolve(module: Module) {
        let shouldIgnoreDeps = false;
        if (this.bundle) {
            if (this.bundle.excluding.has(module.absPath)) {
                return;
            }
            shouldIgnoreDeps = this.bundle.shouldIgnoreNodeModules(module.absPath);
        }

        let requires = module.digest();
        return each(requires, options => {
            return this.processModule(module, options.name, shouldIgnoreDeps);
        });
    }
    public processModule(module: Module, name: string, shouldIgnoreDeps?: boolean) {

        let nodeModule = this.getNodeModuleName(name);
        if (nodeModule) {

            if (shouldIgnoreDeps) {
                return;
            }
            if (this.bundle) { // is a bundle defined we need to check for configuration
                if (this.bundle.shouldIgnore(nodeModule)) {
                    return;
                }
            }
            // just collecting node modules names
            if (!this.nodeModules.has(nodeModule)) {
                let targetEntryFile = this.getNodeModuleMainFile(nodeModule);
                let depCollection;

                if (targetEntryFile) {
                    let targetEntry = new Module(targetEntryFile);

                    depCollection = new ModuleCollection(nodeModule, targetEntry);
                    this.nodeModules.set(nodeModule, depCollection);
                    return depCollection.collect();
                } else {
                    depCollection = new ModuleCollection(name);
                    this.nodeModules.set(nodeModule, depCollection);
                }
            }
        } else {
            let modulePath = module.getAbsolutePathOfModule(name);

            if (this.bundle) {
                if (this.bundle.shouldIgnore(modulePath)) { // make sure we ignore if bundle is set
                    return;
                }
            }
            if (MODULE_CACHE[modulePath]) {
                module.addDependency(MODULE_CACHE[modulePath]);
            } else {
                let dependency = new Module(modulePath);
                MODULE_CACHE[modulePath] = dependency;
                module.addDependency(dependency);

                return this.resolve(dependency);
            }
        }
    }

    /**
     * getNodeModuleName
     * GEtting a real module name
     * Sometimes a require statement might contain
     * require(lodash/map)
     * In this case we interested only in "lodash" part
     *
     * @param {string} name
     * @returns {string}
     *
     * @memberOf ModuleCollection
     */
    public getNodeModuleName(name: string): string {
        if (!name) {
            return;
        }
        let matched = name.match(/^([a-z].*)$/);
        if (matched) {
            return name.split("/")[0];
        }
    }

    /**
     *
     * Trying to get main file of a module
     * We check for local folder first (custom libraries like pth )
     * @private
     * @param {string} name
     * @returns
     *
     * @memberOf ModuleCollection
     */
    private getNodeModuleMainFile(name: string) {
        let localLib = path.join(LOCAL_LIBS, name);
        let modulePath = path.join(NODE_MODULES_DIR, name);
        let readMainFile = (folder) => {
            // package.json path
            let packageJSONPath = path.join(folder, "package.json");
            if (fs.existsSync(packageJSONPath)) {
                // read contents
                let json: any = JSON.parse(fs.readFileSync(packageJSONPath).toString());
                // Getting an entry point
                if (json.main) {
                    let entryFile = path.join(folder, json.main);
                    return entryFile;
                } else {
                    return path.join(folder, "index.js");
                }
            } else {
                return path.join(folder, "index.js");
            }
        };
        if (fs.existsSync(localLib)) {
            return readMainFile(localLib);
        } else {
            return readMainFile(modulePath);
        }
    }

}