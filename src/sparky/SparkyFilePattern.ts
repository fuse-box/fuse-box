import * as path from "path";
import { Config } from "../Config";

export interface SparkyFilePattern {
    isGlob: boolean;
    root: string;
    glob: string;
    filepath: string;
}

export interface SparkyFilePatternOptions {
    base?: string; // Will be ignored when parsing absolute paths
}

export function parse(str: string, opts?: SparkyFilePatternOptions): SparkyFilePattern {
    const base = opts ? (opts.base || '') : '';
    const isGlob = /[*{}}]/.test(str);
    const isAbsolutePath = path.isAbsolute(str);
    let root, filepath, glob;
    if (!isGlob) {
        root = isAbsolutePath ? path.dirname(str) : path.join(Config.PROJECT_ROOT, base);
        filepath = isAbsolutePath ? path.normalize(str) : path.join(Config.PROJECT_ROOT, base, str);
    } else {
        if (isAbsolutePath) {
            root = path.normalize(str.split("*")[0])
            glob = path.normalize(str);
        } else {
            glob = path.join(Config.PROJECT_ROOT, base, str);
            root = path.join(Config.PROJECT_ROOT, base);
        }
    }

    return {
        isGlob: isGlob,
        root: root,
        glob: glob,
        filepath: filepath
    }
}