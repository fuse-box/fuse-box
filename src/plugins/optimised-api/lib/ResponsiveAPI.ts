import * as path from "path";
import { jsCommentTemplate } from "../../../Utils";
import { Config } from "../../../Config";
export class ResponsiveAPI {
    private computedStatements = false;
    private hashes = false;
    private isServerFunction = false;
    private isBrowserFunction = false;
    constructor(public target: string = "universal") {

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
            browser: this.target === "browser",
            universal: this.target === "universal",
            server: this.target === "server",
            isServerFunction: this.isServerFunction,
            isBrowserFunction: this.isBrowserFunction,
            computedStatements: this.computedStatements,
            hashes: this.hashes
        }
        return jsCommentTemplate(path.join(Config.FUSEBOX_MODULES, "fuse-box-responsive-api/index.js"), options)
    }
}