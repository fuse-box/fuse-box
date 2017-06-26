import { WebIndexPluginClass } from "../../plugins/WebIndexPlugin";
import { QuantumCore } from "./QuantumCore";

export interface IQuantumExtensionParams {
    target?: string;
    uglify?: any;
    removeExportsInterop?: boolean;
    removeUseStrict?: boolean;
    replaceProcessEnv?: boolean;
    webIndexPlugin?: WebIndexPluginClass;
    ensureES5?: boolean;
    treeshake?: boolean;
    api?: { (core: QuantumCore): void }
    warnings?: boolean;
    bakeApiIntoBundle?: string;
    extendServerImport?: boolean;
    hoisting?: boolean;
    containedAPI?: boolean
}

export class QuantumOptions {
    private uglify: any;
    private removeExportsInterop = true;
    private removeUseStrict = true;
    private ensureES5 = true;
    private replaceProcessEnv = true;
    private containedAPI = false;
    private bakeApiIntoBundle: string;

    private showWarnings = true;
    private hoisting = true;
    private extendServerImport = false;
    public apiCallback: { (core: QuantumCore): void }
    public optsTarget: string = "browser";
    public treeshake = true;
    public webIndexPlugin: WebIndexPluginClass;

    constructor(opts: IQuantumExtensionParams) {
        opts = opts || {};
        if (opts.target) {
            this.optsTarget = opts.target;
        }
        if (opts.api) {
            this.apiCallback = opts.api;
        }
        if (opts.uglify) {
            this.uglify = opts.uglify;
        }
        if (opts.warnings !== undefined) {
            this.showWarnings = opts.warnings;
        }

        if (opts.containedAPI !== undefined) {
            this.containedAPI = opts.containedAPI;
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
            this.hoisting = opts.hoisting;
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
            this.treeshake = opts.treeshake;
        }
    }

    public enableContainedAPI() {
        return this.containedAPI = true;
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

    public shouldExtendServerImport() {
        return this.extendServerImport;
    }

    public shouldShowWarnings() {
        return this.showWarnings;
    }

    public shouldUglify() {
        return this.uglify === true;
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

    public isTargetUniveral() {
        return this.optsTarget === "universal";
    }

    public isTargetServer() {
        return this.optsTarget === "server";
    }

    public isTargetBrowser() {
        return this.optsTarget === "browser";
    }
}
