import { WebIndexPluginClass } from "../../plugins/WebIndexPlugin";
export interface IQuantumExtensionParams {
    target?: string;
    uglify?: any;
    removeExportsInterop?: boolean;
    removeUseStrict?: boolean;
    replaceProcessEnv?: boolean;
    webIndexPlugin?: WebIndexPluginClass;
    ensureES5?: boolean;
    treeshake?: boolean;
}
export class QuantumOptions {

    private optsTarget: string = "browser";
    private uglify: any;
    private removeExportsInterop = true;
    private removeUseStrict = true;
    private ensureES5 = true;
    private replaceProcessEnv = true;
    public treeshake = true;
    public webIndexPlugin: WebIndexPluginClass;
    constructor(opts: IQuantumExtensionParams) {
        opts = opts || {};
        if (opts.target) {
            this.optsTarget = opts.target;
        }
        if (opts.uglify) {
            this.uglify = opts.uglify;
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
        if (opts.ensureES5 !== undefined) {
            this.ensureES5 = opts.ensureES5;
        }
        if (opts.treeshake !== undefined) {
            this.treeshake = opts.treeshake;
        }
    }

    public shouldRemoveUseStrict() {
        return this.removeUseStrict;
    }
    public shouldEnsureES5() {
        return this.ensureES5;
    }
    public shouldUglify() {
        return this.uglify;
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