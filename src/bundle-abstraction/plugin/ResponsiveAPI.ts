import * as path from "path";
import { OptimisedCore } from "./OptimisedCore";
import { jsCommentTemplate } from "../../Utils";
import { Config } from "../../Config";
export class ResponsiveAPI {
    private computedStatements = false;
    private hashes = false;
    private isServerFunction = false;
    private isBrowserFunction = false;
    constructor(public core: OptimisedCore) {

    }

    public addComputedRequireStatetements() {
        this.computedStatements = true;
        this.hashes = true;
    }

    public addIsServerFunction() {
        this.isServerFunction = true;
    }

    public addIsBrowserFunction() {
        this.isBrowserFunction = true;
    }

    public render() {
        const options = {
            browser: this.core.opts.isTargetBrowser(),
            universal: this.core.opts.isTargetUniveral(),
            server: this.core.opts.isTargetServer(),
            isServerFunction: this.isServerFunction,
            isBrowserFunction: this.isBrowserFunction,
            computedStatements: this.computedStatements,
            hashes: this.hashes
        }
        return jsCommentTemplate(path.join(Config.FUSEBOX_MODULES, "fuse-box-responsive-api/index.js"), options)
    }
}