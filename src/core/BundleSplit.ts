import { string2RegExp, ensurePublicExtension, joinFuseBoxPath } from "../Utils";
import { File } from "./File";
import { Bundle } from "./Bundle";
import { FuseBox } from "./FuseBox";
import { each } from "realm-utils";
import { WorkFlowContext } from "./WorkflowContext";


export class SplitConfig {
    public fuse: FuseBox;
    public name: string;
    public main: string;
    public dest: string;
    public parent: Bundle;
    public files: File[] = [];
    public rules: RegExp[] = [];
}

export class BundleSplit {
    public bundles = new Map<string, SplitConfig>();
    public browserPath = "/";
    public dest = "./";
    public serverPath = `./`;
    constructor(public bundle: Bundle) { }
    public addRule(rule: string, bundleName: string) {
        const conf = this.bundles.get(bundleName);
        conf.rules.push(string2RegExp(rule));
    }

    /**
     * 
     * @param name 
     */
    public createFuseBoxInstance(name: string, mainFile: string): FuseBox {

        const producer = this.bundle.producer;
        const config = Object.assign({}, producer.fuse.opts);
        config.plugins = [].concat(config.plugins || [])
        config.standalone = false;
        const fuse = FuseBox.init(config);
        fuse.context.output.setName(joinFuseBoxPath(this.dest, name))
        let conf = new SplitConfig();
        conf.fuse = fuse;
        conf.name = name;
        conf.parent = this.bundle;
        conf.dest = this.dest;
        conf.main = mainFile;
        this.bundles.set(name, conf);
        return fuse;
    }


    public getFuseBoxInstance(name: string, mainFile: string) {
        if (this.bundles.get(name)) {
            return this.bundles.get(name);
        }
        return this.createFuseBoxInstance(name, mainFile);
    }


    public beforeMasterWrite(masterContext: WorkFlowContext): Promise<any> {
        return each(this.bundles, (conf: SplitConfig, bundleName: string) => {
            return conf.fuse.createSplitBundle(conf);
        }).then((configs: SplitConfig[]) => {
            // getting information on the paths
            let obj: any = {
                bundles: {},
                browser: this.browserPath,
                server: this.serverPath,
            };
            configs.forEach(config => {
                let localFileName = config.fuse.context.output.lastGeneratedFileName;
                obj.bundles[config.name] = {
                    file: localFileName,
                    main: ensurePublicExtension(config.main)
                }
            });
            masterContext.source.bundleInfoObject = obj;
        });
    }



    /**
     * Checks if a file should go to a master bundle
     * If not puts it to a target bundle
     * @param file File
     */
    public verify(file: File): boolean {
        let targetConfg: SplitConfig;
        this.bundles.forEach(conf => {
            conf.rules.forEach(rx => {
                if (rx.test(file.info.fuseBoxPath)) {
                    targetConfg = conf;
                }
            })
        });
        if (targetConfg) {
            targetConfg.files.push(file);
            return true;
        }
        return false;
    }
}