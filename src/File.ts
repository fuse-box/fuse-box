import { RequireOptions, extractRequires} from './Utils';
import { WorkFlowContext } from "./WorkflowContext";
import { IPathInformation } from "./PathMaster";
import * as fs from "fs";
import * as path from "path";
export class File {
    public absPath : string;
    public contents : string;
    public isLoaded  = false;
    public isNodeModuleEntry = false;
    constructor( public context : WorkFlowContext, public info : IPathInformation) {
        this.absPath = info.absPath;
    }

    public consume(): string[] {
        if (!this.absPath) {
            return [];
        }

        if (!fs.existsSync(this.info.absDir)) {
            this.context.dump.error(this.info.fuseBoxPath, this.absPath, "Not found");
            this.contents = "";
            return [];
        }

        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;
        // if it's a json
        if (this.absPath.match(/\.json$/)) {
            // Modify contents so they exports the json
            this.contents = "module.exports = " + this.contents;
        }
        // extract dependencies in case of a javascript file
        if (this.absPath.match(/\.js$/)) {
            let reqs = extractRequires(this.contents, path.join(this.absPath));
            return reqs;
        }
        return [];
    }
}