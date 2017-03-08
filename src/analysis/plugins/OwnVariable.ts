import { File } from "../../core/File";

/**
 * If we have an uglified bundle we will still have $fuse$ variable
 * that will help us wrapping
 */
export class OwnVariable {

    public static onNode(file: File, node: any, parent: any) {
        const analysis = file.analysis;
        if (node.type === "Identifier") {
            if (node.name === "$fuse$") {
                analysis.fuseBoxVariable = parent.object.name;
            }
        }
    }

    public static onEnd() { }
}
