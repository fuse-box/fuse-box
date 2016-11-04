import { WorkFlowContext } from './WorkflowContext';
import { RequireOptions, IPackageInformation } from "./Utils";
export declare class Module {
    context: WorkFlowContext;
    absPath: string;
    contents: string;
    dir: string;
    nodeModuleDir: string;
    dependencies: Module[];
    packageInfo: IPackageInformation;
    isLoaded: boolean;
    constructor(context: WorkFlowContext, absPath?: string);
    setDir(dir: string): void;
    setNodeModuleDir(dir: string): void;
    setPackage(info: IPackageInformation): void;
    digest(): RequireOptions[];
    getAbsolutePathOfModule(name: string, packageInfo?: IPackageInformation): string;
    addDependency(module: Module): void;
    getProjectPath(entry?: Module, userRootPath?: string): string;
    private ensureExtension(name);
}
