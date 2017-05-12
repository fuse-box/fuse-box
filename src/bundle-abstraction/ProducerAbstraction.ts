import { BundleAbstraction } from "./BundleAbstraction";
import * as path from "path";
import { joinFuseBoxPath } from "../Utils";

export class ProducerAbstraction {
    public bundleAbstractions = new Map<string, BundleAbstraction>();
    constructor() { }


    public registerBundleAbstraction(bundleAbstraction: BundleAbstraction) {
        this.bundleAbstractions.set(bundleAbstraction.name, bundleAbstraction);
    }

    public findFileAbstraction(packageName: string, resolvedPathRaw: string) {
        let ext = path.extname(resolvedPathRaw);
        let combinations = [];
        if (!ext) {
            combinations.push(
                `${resolvedPathRaw}.js`,
                `${resolvedPathRaw}.jsx`,
                joinFuseBoxPath(resolvedPathRaw, "index.js"),
                joinFuseBoxPath(resolvedPathRaw, "index.jsx"),
            )
        }
        this.bundleAbstractions.forEach(bundle => {
            const pkg = bundle.packageAbstractions.get(packageName);
            if (pkg) {
                pkg.fileAbstractions.forEach(file => {

                });
            }
        });
    }
}