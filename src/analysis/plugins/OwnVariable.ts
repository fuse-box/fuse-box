import { AnalysisPlugin, FileAnalysis } from './../FileAnalysis';
import { File } from "../../core/File";

/**
 * If we have an uglified bundle we will still have $fuse$ variable
 * that will help us wrapping
 */
export class OwnVariable implements AnalysisPlugin {
    constructor(public file: File, public analysis: FileAnalysis) { }

    public onNode(node: any, parent: any) {
        if (node.type === "Identifier") {
            if (node.name === "$fuse$") {
                this.analysis.fuseBoxVariable = parent.object.name;
            }
        }
    }

    public onEnd() { }
}