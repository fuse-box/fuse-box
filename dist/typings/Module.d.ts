import { RequireOptions } from './Utils';
export declare class Module {
    absPath: string;
    contents: string;
    dir: string;
    dependencies: Module[];
    constructor(absPath?: string);
    setDir(dir: string): void;
    digest(): RequireOptions[];
    getAbsolutePathOfModule(name: string): string;
    addDependency(module: Module): void;
    getProjectPath(entry?: Module, userRootPath?: string): string;
    private ensureExtension(name);
}
