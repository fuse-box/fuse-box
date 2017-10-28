import * as path from "path";
import * as fs from "fs-extra";
import * as appRoot from "app-root-path";
import { FuseBox } from "../../index";
import { BundleProducer } from "../../core/BundleProducer";
import { fork } from "child_process";
import { removeFolder } from "../../Utils";
import * as request from "request";

const jsdom = require("jsdom");

function createTestFolders(customFolder: string): { root, homeDir, dist } {
    let root = path.join(appRoot.path, ".fusebox", "tests", new Date().getTime().toString() + "_" + Math.random());
    if (customFolder) {
        root = path.join(appRoot.path, customFolder);
    }
    fs.ensureDirSync(root);

    const homeDir = path.join(root, "src");
    fs.ensureDirSync(homeDir);

    const output = path.join(root, "dist");
    fs.ensureDirSync(output);
    return {
        root: root,
        homeDir: homeDir,
        dist: output
    };
}

function createFiles(dir: string, files: any) {
    for (let name in files) {
        const content = files[name];
        const filePath = path.join(dir, name)
        fs.ensureDirSync(path.dirname(filePath));
        fs.writeFileSync(filePath, content);
    }
}
export function createRealNodeModule(name: string, files: any) {

    const path2Module = path.join(appRoot.path, "node_modules", name);
    if (fs.existsSync(path2Module)) {
        removeFolder(path2Module);
    }
    fs.ensureDirSync(path2Module);
    createFiles(path2Module, files);
}
export class FuseTestEnv {
    public fuse: FuseBox;
    public window: any;
    public producer: BundleProducer;
    public dirs: { root, homeDir, dist };

    constructor(config: any) {
        this.dirs = createTestFolders(config.testFolder);
        const basicConfig = {
            homeDir: this.dirs.homeDir,
            log: false,
            output: `${this.dirs.dist}/$name.js`
        }
        config.project = config.project || {};
        createFiles(this.dirs.homeDir, config.project.files);

        if (config.project.distFiles) {
            createFiles(this.dirs.dist, config.project.distFiles);
        }

        config = Object.assign(basicConfig, config.project || {});
        this.fuse = FuseBox.init(config);
    }

    public simple(instructions: string = "> index.ts"): Promise<FuseTestEnv> {
        this.fuse.bundle("app")
            .instructions(instructions);
        return this.fuse.run().then(producer => {
            this.producer = producer;
            return this;
        });
    }

    public config(fn: { (fuse: FuseBox): any }): Promise<FuseTestEnv> {
        return Promise.resolve(fn(this.fuse)).then(() => this.fuse.run()).then(producer => {
            this.producer = producer;
            return this;
        });
    }

    public server(message, fn: { (response): any }): Promise<FuseTestEnv> {
        return new Promise((resolve, reject) => {
            const scripts = [];
            const bundles = this.producer.sortBundles();
            bundles.forEach(bundle => {
                if (bundle.webIndexed) {
                    let contents = fs.readFileSync(bundle.context.output.lastPrimaryOutput.path).toString();
                    scripts.push(contents);
                }
            });
            scripts.push(message);
            const forkedFile = path.join(this.dirs.dist, "__isolated_fork.js");
            fs.writeFileSync(forkedFile, scripts.join("\n"));
            const proc = fork(forkedFile);
            proc.on('message', (m) => {

                return resolve(fn(m));
            });
            proc.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
        });
    }
    public browser(fn: { (window: any, test: FuseTestEnv): any }): Promise<FuseTestEnv> {
        const scripts = [path.join(appRoot.path, "src/tests/stubs/DummyXMLHttpRequest.js")];
        const bundles = this.producer.sortBundles();
        bundles.forEach(bundle => {
            if (bundle.webIndexed) {
                scripts.push(bundle.context.output.lastPrimaryOutput.path);
            }
        });
        return new Promise((resolve, reject) => {
            jsdom.env({
                html: `<html>
                    <head>
                    </head><body></body></html>
                `,
                scripts: scripts,
                //virtualConsole: jsdom.createVirtualConsole().sendTo(console),
                done: (err, window) => {
                    window.__ajax = (url, fn) => {
                        if ( /^http(s)\:/.test(url)){
                            return request(url, function (error, response, body) {
                                if(error){
                                    return fn(400, body);
                                }
                                fn(200,body);
                              });
                        }
                        const target = path.join(this.dirs.dist, url);
                        if (fs.existsSync(target)) {
                            return fn(200, fs.readFileSync(target).toString());
                        }
                        return fn(404, "Not found");

                    }
                    if (err) {
                        return reject(err);
                    }
                    return resolve(fn(window, this));
                }
            });
        });
    }

    public static create(config) {
        return new FuseTestEnv(config);
    }
}