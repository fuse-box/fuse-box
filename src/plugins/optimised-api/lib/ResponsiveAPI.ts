import * as path from "path";
import { jsCommentTemplate } from "../../../Utils";
import { Config } from "../../../Config";
export class ResponsiveAPI {
    private computedStatements = false;
    private hashes = false;
    constructor(public target: string = "universal") {

    }

    public addComputedRequireStatetements() {
        this.computedStatements = true;
        this.hashes = true;
    }
    public render() {
        const options = {
            browser: this.target === "browser",
            universal: this.target === "universal",
            server: this.target === "server",
            computedStatements: this.computedStatements,
            hashes: this.hashes
        }
        return jsCommentTemplate(path.join(Config.FUSEBOX_MODULES, "fuse-box-responsive-api/index.js"), options)
    }
}