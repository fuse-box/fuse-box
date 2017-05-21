export interface IOptimisedPluginParms {
    target?: string;
}
export class OptimisedPluginOptions {

    private optsTarget: string = "browser";

    constructor(opts: IOptimisedPluginParms) {
        opts = opts || {};
        if (opts.target) {
            this.optsTarget = opts.target;
        }
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