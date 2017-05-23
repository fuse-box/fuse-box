export interface IOptimisedPluginParms {
    target?: string;
    uglify?: any;
    removeExportsInterop?: boolean;
    removeUseStrict?: boolean;
}
export class OptimisedPluginOptions {

    private optsTarget: string = "browser";
    private uglify: any;
    private removeExportsInterop = true;
    private removeUseStrict = true;
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
    }

    public shouldRemoveUseStrict() {
        return this.removeUseStrict;
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