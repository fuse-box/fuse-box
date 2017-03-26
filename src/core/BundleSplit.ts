import { string2RegExp } from "../Utils";
import { File } from "./File";
import { BundleProducer } from "./BundleProducer";

export class BundleSplit {
    public rules = new Map<RegExp, string>();
    public tasks = new Map<string, File>();;

    constructor(public producer: BundleProducer) { }

    public addRule(rule: string, bundleName: string) {
        this.rules.set(string2RegExp​​(rule), bundleName);
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
            this.tasks.set(targetBundleName, file);
            return true;
        }
        return false;
    }
}