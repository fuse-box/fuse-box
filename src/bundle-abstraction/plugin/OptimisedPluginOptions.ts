import { WebIndexPluginClass } from "../../plugins/WebIndexPlugin";
export interface IOptimisedPluginParms {
    target?: string;
    uglify?: any;
    removeExportsInterop?: boolean;
    removeUseStrict?: boolean;
    webIndexPlugin?: WebIndexPluginClass;
    ensureES5?: boolean;
}
export class OptimisedPluginOptions {

    private optsTarget: string = "browser";
    private uglify: any;
    private removeExportsInterop = true;
    private removeUseStrict = true;
    private ensureES5 = true;
    public webIndexPlugin: WebIndexPluginClass;
    constructor(opts: IOptimisedPluginParms) {
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
        if (opts.removeUseStrict !== undefined) {
            this.removeUseStrict = opts.removeUseStrict;
        }
        if (opts.webIndexPlugin) {
            this.webIndexPlugin = opts.webIndexPlugin;
        }
        if (opts.ensureES5 !== undefined) {
            this.ensureES5 = opts.ensureES5;
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

    public shouldRemoveExportsInterop() {
        return this.removeExportsInterop;
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