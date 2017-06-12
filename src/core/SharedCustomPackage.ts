import { BundleData } from "../arithmetic/Arithmetic";
import * as path from "path";

export class SharedCustomPackage {
    public homeDir: string;
    public main: string;

    public mainPath;
    public mainDir;
    constructor(public name: string, public data: BundleData) {}

    public init(homeDir: string, main: string) {
        this.main = main;
        this.homeDir = homeDir;
        this.mainPath = path.join(homeDir, main);
        this.mainDir = path.dirname(this.mainPath);
    }
}
