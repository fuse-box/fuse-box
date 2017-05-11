import { Bundle } from "./core/Bundle";
import { ChildProcess, spawn } from "child_process";
declare function require(name:string);

export class FuseProcess {
    public node: ChildProcess;
    public filePath: string;
    constructor(public bundle: Bundle) { }

    public setFilePath(filePath: string) {
        this.filePath = filePath;
    }
    /** Kills a process if exists */
    public kill() {
        if (this.node) {
            this.node.kill();
        }
    }
    /** Starts a process (for example express server) */
    public start(): FuseProcess {
        this.kill();
        this.exec();
        return this;
    }

		require(close?: ((exports: any) => void)|(() => void)) {
			function getMainExport(mdl) {
				return mdl && mdl.FuseBox && mdl.FuseBox.mainFile ?
						mdl.FuseBox.import(mdl.FuseBox.mainFile) :
						mdl;
			}
			return new Promise((resolve, reject)=> {
				var cache = (<any>require).cache, cached = cache[this.filePath], closePromise;
				if(cached) {
					cached = getMainExport(cached.exports);
					if(cached) {
						try {
							closePromise = close ? (<(exps: any) => void>close)(cached) :	//if a close function is given in parameter
								cached.close ? cached.close() : //if a `close` function is exported by the bundle
								cached.default && cached.default.close ?
									cached.default.close() : //if a `close` function is exported by the default export
								console.warn(`Bundle ${this.bundle.name} doesn't export a close() function and no close was given`);
						} catch(x) {
							console.error(`Exception while closeping bundle ${this.bundle.name}.`);
							reject(x);
						}
					} else if(close) {
						closePromise = (<() => void>close)();
					}
					delete cache[this.filePath];
				}
				if(!(closePromise instanceof Promise))
					closePromise = Promise.resolve(true);
				closePromise.then(
					()=> resolve(getMainExport(require(this.filePath))),
					x=> reject(x)
				);
			});
		}
    /** Spawns another proces */
    public exec(): FuseProcess {
        const node = spawn("node", [this.filePath], {
            stdio: "inherit",
        });
        node.on("close", (code) => {
            if (code === 8) {
                console.error("Error detected, waiting for changes...");
            }
        });
        this.node = node;
        return this;
    }
}