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

    public isUniveral() {
        return this.optsTarget === "universal";
    }

    public isServer() {
        return this.optsTarget === "server";
    }

    public isBrowser() {
        return this.optsTarget === "browser";
    }
}