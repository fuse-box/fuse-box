import { RequireOptions, IPackageInformation } from "./Utils";
export declare class Module {
    absPath: string;
    contents: string;
    dir: string;
    dependencies: Module[];
    packageInfo: IPackageInformation;
    constructor(absPath?: string);
    setDir(dir: string): void;
    setPackage(info: IPackageInformation): void;
    digest(): RequireOptions[];
    getAbsolutePathOfModule(name: string, packageInfo?: IPackageInformation): string;
    addDependency(module: Module): void;
    getProjectPath(entry?: Module, userRootPath?: string): string;
    private ensureExtension(name);
}
