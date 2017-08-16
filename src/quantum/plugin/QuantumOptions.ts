import { WebIndexPluginClass } from "../../plugins/WebIndexPlugin";
import { QuantumCore } from "./QuantumCore";
import { readFuseBoxModule } from "../../Utils";
import { FileAbstraction } from "../core/FileAbstraction";
export interface ITreeShakeOptions {
    shouldRemove: { (file: FileAbstraction): void }
}
export interface IQuantumExtensionParams {
    target?: string;
    uglify?: any;
    removeExportsInterop?: boolean;
    removeUseStrict?: boolean
    replaceTypeOf?: boolean;
    replaceProcessEnv?: boolean;
    webIndexPlugin?: WebIndexPluginClass;
    ensureES5?: boolean;
    treeshake?: boolean | ITreeShakeOptions;
    api?: { (core: QuantumCore): void }
    warnings?: boolean;
    bakeApiIntoBundle?: string;
    extendServerImport?: boolean;
    polyfills?: string[];
    processPolyfill?: boolean;
    hoisting?: boolean | { names: string[] };
    containedAPI?: boolean,
    manifest?: boolean | string,
}

export class QuantumOptions {
    private uglify: any;
    private removeExportsInterop = false;
    private removeUseStrict = true;
    private ensureES5 = true;
    private replaceProcessEnv = true;
    private containedAPI = false;
    private processPolyfill = false;
    private bakeApiIntoBundle: string;
    private replaceTypeOf: boolean = true;

    private showWarnings = true;
    private treeshakeOptions: ITreeShakeOptions;
    private hoisting = false;
    private polyfills: string[];
    private hoistedNames: string[];
    private extendServerImport = false;
    private manifestFile: string;
    public apiCallback: { (core: QuantumCore): void }
    public optsTarget: string = "browser";
    public treeshake = false;
    public webIndexPlugin: WebIndexPluginClass;

    constructor(opts: IQuantumExtensionParams) {
        opts = opts || {};
        if (opts.target) {
            this.optsTarget = opts.target;
        }
        if (opts.api) {
            this.apiCallback = opts.api;
        }

        if (opts.manifest !== undefined) {
            if (typeof opts.manifest === "string") {
                this.manifestFile = opts.manifest;
            }
            if (opts.manifest === true) {
                this.manifestFile = "manifest.json";
            }
        }
        if (opts.uglify) {
            this.uglify = opts.uglify;
        }

        if (opts.processPolyfill !== undefined) {
            this.processPolyfill = opts.processPolyfill;
        }
        if (opts.warnings !== undefined) {
            this.showWarnings = opts.warnings;
        }
        if (opts.replaceTypeOf !== undefined) {
            this.replaceTypeOf = opts.replaceTypeOf;
        }
        if (opts.containedAPI !== undefined) {
            this.containedAPI = opts.containedAPI;
        }

        if (Array.isArray(opts.polyfills)) {
            this.polyfills = opts.polyfills;
        }
        // stupid exports.__esModule = true;
        if (opts.removeExportsInterop !== undefined) {
            this.removeExportsInterop = opts.removeExportsInterop;
        }
        if (opts.replaceProcessEnv !== undefined) {
            this.replaceProcessEnv = this.replaceProcessEnv;
        }
        if (opts.removeUseStrict !== undefined) {
            this.removeUseStrict = opts.removeUseStrict;
        }
        if (opts.webIndexPlugin) {
            this.webIndexPlugin = opts.webIndexPlugin;
        }

        if (opts.hoisting !== undefined) {
            if (typeof opts.hoisting === "boolean") {
                this.hoisting = opts.hoisting as boolean;
            } else {
                this.hoisting = true;
                const hoistingOptions = opts.hoisting as { names: string[] };
                this.hoistedNames = hoistingOptions.names;
            }
        }

        if (opts.bakeApiIntoBundle) {
            this.bakeApiIntoBundle = opts.bakeApiIntoBundle;
        }

        if (opts.extendServerImport !== undefined) {
            this.extendServerImport = opts.extendServerImport;
        }
        if (opts.ensureES5 !== undefined) {
            this.ensureES5 = opts.ensureES5;
        }
        if (opts.treeshake !== undefined) {
            if (typeof opts.treeshake === "boolean") {
                this.treeshake = opts.treeshake;
            } else {
                this.treeshake = true;
                this.treeshakeOptions = opts.treeshake as ITreeShakeOptions;
            }
        }
    }
    public shouldBundleProcessPolyfill() {
        return this.processPolyfill === true;
    }

    public enableContainedAPI() {
        return this.containedAPI = true;
    }

    public shouldReplaceTypeOf() {
        return this.replaceTypeOf;
    }

    public getPromisePolyfill() {
        if (this.polyfills && this.polyfills.indexOf("Promise") > -1) {
            return readFuseBoxModule("fuse-box-responsive-api/promise-polyfill.js");
        }
    }

    public getManifestFilePath(): string {
        return this.manifestFile;
    }

    public canBeRemovedByTreeShaking(file: FileAbstraction) {
        if (this.treeshakeOptions) {
            if (this.treeshakeOptions.shouldRemove) {
                return this.treeshakeOptions.shouldRemove(file);
            }
        }
        return true;
    }

    public isContained() {
        return this.containedAPI;
    }

    public throwContainedAPIError() {
        throw new Error(`
           - Can't use contained api with more than 1 bundle
           - Use only 1 bundle and bake the API e.g {bakeApiIntoBundle : "app"}
           - Make sure code splitting is not in use 
        `);
    }

    public shouldRemoveUseStrict() {
        return this.removeUseStrict;
    }
    public shouldEnsureES5() {
        return this.ensureES5;
    }

    public shouldDoHoisting() {
        return this.hoisting;
    }

    public getHoistedNames(): string[] {
        return this.hoistedNames;
    }

    public isHoistingAllowed(name: string) {

        if (this.hoistedNames) {
            return this.hoistedNames.indexOf(name) > -1;
        }
        return true;
    }

    public shouldExtendServerImport() {
        return this.extendServerImport;
    }

    public shouldShowWarnings() {
        return this.showWarnings;
    }

    public shouldUglify() {
        return this.uglify;
    }

    public shouldBakeApiIntoBundle() {
        return this.bakeApiIntoBundle;
    }

    public shouldTreeShake() {
        return this.treeshake;
    }
    public shouldRemoveExportsInterop() {
        return this.removeExportsInterop;
    }

    public shouldReplaceProcessEnv() {
        return this.replaceProcessEnv;
    }

    public getTarget() {
        return this.optsTarget;
    }

    public isTargetElectron() {
        return this.optsTarget === "electron";
    }
    public isTargetUniveral() {
        return this.optsTarget === "universal" || this.optsTarget === "npm";
    }
    public isTargetNpm() {
        return this.optsTarget === "npm";
    }

    public isTargetServer() {
        return this.optsTarget === "server" || this.optsTarget === "electron";
    }

    public isTargetBrowser() {
        return this.optsTarget === "browser";
    }
}
