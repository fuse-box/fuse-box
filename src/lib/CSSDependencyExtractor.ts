import * as path from "path";
import * as fs from "fs";

export interface ICSSDependencyExtractorOptions {
    paths: string[];
    extensions: string[],
    content: string;
    sassStyle?: boolean;
    importer?: { (f: string, prev: any, done: { (info: { file: string }): void }): string }
}

export class CSSDependencyExtractor {
    private filesProcessed = new Set<string>();
    private dependencies: string[] = [];
    constructor(public opts: ICSSDependencyExtractorOptions) {
        this.extractDepsFromString(opts.content);
    }


    private extractDepsFromString(input: string, currentPath? : string) {
        const re = /@(?:import|value)[^"']+["']([^"']+)/g;
        let match;
        while (match = re.exec(input)) {
            let target = this.findTarget(match[1], currentPath);
            if (target) {
                this.readFile(target, path.dirname(target));
                this.dependencies.push(target);
            }
        }
    }

    private readFile(fileName: string, currentPath? : string) {
        if ( !this.filesProcessed.has(fileName)){
            this.filesProcessed.add(fileName);
            const contents = fs.readFileSync(fileName).toString();
            this.extractDepsFromString(contents, currentPath)
        }
    }
    public getDependencies() {
        return this.dependencies;
    }

    private tryFile(filePath: string): string {
        if(!filePath){
            return;
        }
        // restrict node_module
        // we don't want to detect stuff from there
        if (filePath.indexOf("node_modules") > -1) {
            return;
        }

        let fname = path.basename(filePath);
        // if a filename doesn't have _ we need to try it with _ for sass cases
        if (this.opts.sassStyle && !/^_/.test(fname)) {
            const pathWithUnderScore = path.join(path.dirname(filePath), "_" + fname);
            if (fs.existsSync(pathWithUnderScore)) {
                return pathWithUnderScore;
            }
        }

        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }

    private getPath(suggested: string, fileName: string) {
        let target = fileName;
        if (this.opts.importer) {
            fileName = this.opts.importer(fileName, null, info => {
                target = info.file;
            });
        }
        if(!target){
            return;
        }
        if (path.isAbsolute(target)) {
            return target;
        }
        return path.join(suggested, target);
    }

    private findTarget(fileName: string, currentPath? : string): string {
        let targetFile: any;
        let extName = path.extname(fileName);
        let paths = this.opts.paths;
        if( currentPath){
            paths = [currentPath].concat(paths)
        }
        if (!extName) {
            for (let p = 0; p < paths.length; p++) {
                for (let e = 0; e < this.opts.extensions.length; e++) {
                    let filePath = this.getPath(paths[p], fileName + "." + this.opts.extensions[e]);
                    filePath = this.tryFile(filePath);
                    if (filePath) {
                        return filePath;
                    }
                }
            }
        } else {
            for (let p = 0; p < paths.length; p++) {
                let filePath = this.getPath(paths[p], fileName);
                filePath = this.tryFile(filePath);
                if (filePath) {
                    return filePath;
                }

            }
        }
        return targetFile;
    }
    public static init(opts: ICSSDependencyExtractorOptions) {
        return new CSSDependencyExtractor(opts);
    }
    //
}