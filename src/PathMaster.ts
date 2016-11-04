import { WorkFlowContext } from "./WorkflowContext";
import * as path from "path";
import * as fs from "fs";
const NODE_MODULE = /^([a-z].*)$/;
export interface INodeModuleRequire {
    name: string;
    target?: string;
}

export interface PathInformation {
    isNodeModule: boolean;
    nodeModuleName?: string;
    nodeModulePartialOriginal?: string;
    absPath?: string;

}
/**
 * PathMaster
 */
export class PathMaster {
    constructor(public context: WorkFlowContext, public moduleRoot?: string) { }


    public resolve(name: string, root: string): PathInformation {
        let data = <PathInformation>{};
        data.isNodeModule = NODE_MODULE.test(name);
        if (data.isNodeModule) {
            let info = this.getNodeModuleInfo(name);
            data.nodeModuleName = info.name;
            data.nodeModulePartialOriginal = info.target;
        } else {
            if (root) {
                let url = this.ensureFolderAndExtensions(name, root);

                url = path.resolve(root, url);

                data.absPath = url;
            }
        }
        return data;
    }


    private ensureFolderAndExtensions(name : string, root : string) {
        if (!name.match(/.js$/)) {

            let folderDir = path.join(path.dirname(root), name, "index.js");
            if (fs.existsSync(folderDir)) {
                let startsWithDot = name[0] === "."; // After transformation we need to bring the dot back
                name = path.join(name, "/", "index.js"); // detecting a real relative path
                if (startsWithDot) {
                    // making sure we are not modifying it and converting to
                    // what can be take for node_module
                    // For example: ./foo if a folder, becomes "foo/index.js",
                    // whereas foo can be interpreted as node_module
                    name = `./${name}`;
                }
            } else {
                name = name + ".js";
            }
        }
        return name;
    }
    private getNodeModuleInfo(name: string): INodeModuleRequire {
        let data = name.split(/\/(.+)?/);
        return {
            name: data[0],
            target: data[1],
        };
    }
}
