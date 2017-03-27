import * as path from "path";
import { Config } from "../Config";

export interface SparkyFilePattern {
    isGlob: boolean;
    root: string;
    glob: string;
    filepath: string;

}
export function parse(str: string): SparkyFilePattern {

    const isGlob = /[*{}}]/.test(str);
    const isAbsolutePath = path.isAbsolute(str);
    let root, filepath, glob;
    if (!isGlob) {
        root = isAbsolutePath ? path.dirname(str) : Config.PROJECT_ROOT;
        filepath = isAbsolutePath ? str : path.join(Config.PROJECT_ROOT, str);
    } else {
        if (isAbsolutePath) {
            root = str.split("*")[0]
            glob = str;
        } else {
            glob = path.join(Config.PROJECT_ROOT, str);
            root = Config.PROJECT_ROOT;
        }
    }

    return {
        isGlob: isGlob,
        root: root,
        glob: glob,
        filepath: filepath
    }
}