import { string2RegExp } from "../Utils";
import { File } from "./File";
import { Bundle } from "./Bundle";
import { FuseBox } from "./FuseBox";


export class BundleSplit {
    public rules = new Map<RegExp, string>();
    public tasks = new Map<string, File[]>();
    public bundles = new Map<string, FuseBox>();

    constructor(public bundle: Bundle) { }

    public addRule(rule: string, bundleName: string) {
        this.rules.set(string2RegExp(rule), bundleName);
    }

    /**
     * 
     * @param name 
     */
    public createFuseBoxInstance(name: string): FuseBox {
        const producer = this.bundle.producer;
        const config = Object.assign({}, producer.fuse.opts);
        config.plugins = [].concat(config.plugins || [])
        const fuse = FuseBox.init(config);
        this.bundles.set(name, fuse);
        return fuse;
    }


    public getFuseBoxInstance(name: string) {
        if (this.bundles.get(name)) {
            return this.bundles.get(name);
        }
        return this.createFuseBoxInstance(name);
    }


    public beforeMasterWrite(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(this.tasks);
            return resolve();
        });
    }



    /**
     * Checks if a file should go to a master bundle
     * If not puts it to a target bundle
     * @param file File
     */
    public verify(file: File): boolean {
        let targetBundleName;
        this.rules.forEach((bundleName, regexp) => {
            if (regexp.test(file.info.fuseBoxPath)) {
                targetBundleName = bundleName;
            }
        });
        if (targetBundleName) {
            let tasks = this.tasks.get(targetBundleName);;
            if (!tasks) {
                tasks = [];
                this.tasks.set(targetBundleName, tasks);
            }
            tasks.push(file);
            return true;
        }
        return false;
    }
}