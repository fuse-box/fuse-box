/// <reference types="node" />
export declare type Concat = {
    add(fileName: string | null, content: string | Buffer, sourceMap?: string): void;
    content: Buffer;
    sourceMap: string;
};
export declare type ConcatModule = {
    new (generateSourceMap: boolean, outputFileName: string, seperator: string): Concat;
};
export declare const Concat: ConcatModule;
export declare function contains(array: any[], obj: any): boolean;
export declare function replaceAliasRequireStatement(requireStatement: string, aliasName: string, aliasReplacement: string): string;
export declare function write(fileName: string, contents: any): Promise<{}>;
export declare function camelCase(str: string): string;
export declare function parseQuery(qstr: any): Map<string, string>;
/**
 * Does two things:
 * - If a relative path is given,
 *  it is assumed to be relative to appRoot and is then made absolute
 * - Ensures that the directory containing the userPath exits (creates it if needed)
 */
export declare function ensureUserPath(userPath: string): string;
export declare function ensureDir(userPath: string): string;
export declare function string2RegExp(obj: any): RegExp;
export declare function removeFolder(userPath: any): void;
export declare function replaceExt(npath: any, ext: any): string;
export declare function extractExtension(str: string): string;
export declare function ensureFuseBoxPath(input: string): string;
export declare function ensurePublicExtension(url: string): string;
export declare function getBuiltInNodeModules(): Array<string>;
export declare function findFileBackwards(target: string, limitPath: string): string;
export declare function walk(dir: any, options?: any): any[];
export declare function filter(items: any, fn: any): {};
