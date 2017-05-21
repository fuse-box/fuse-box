import { Bundle } from "./core/Bundle";
import { ChildProcess, spawn } from "child_process";
declare function require(name: string);

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


	public require(opts: { close?: ((fuseBox: any) => void) } = {}) {
		function getMainExport(mdl) {
			return mdl && mdl.FuseBox && mdl.FuseBox.mainFile ?
				mdl.FuseBox.import(mdl.FuseBox.mainFile) :
				mdl;
		}
		return new Promise((resolve, reject) => {
			let cache = (<any>require).cache, cached = cache[this.filePath], closePromise, exps;
			if (cached) {
				try {
					if (opts.close)	//if a close function is given in parameter
						closePromise = opts.close(cached.exports);
					else {
						exps = getMainExport(cached.exports);
						if (exps) {
							closePromise = exps.close ? cached.close() : //if a `close` function is exported by the bundle
								exps.default && exps.default.close ?
									exps.default.close() : //if a `close` function is exported by the default export
									console.warn(`Bundle ${this.bundle.name} doesn't export a close() function and no close was given`);
						}
					}
				} catch (x) {
					console.error(`Exception while closing bundle ${this.bundle.name}.`);
					reject(x);
				}
				delete cache[this.filePath];
			}
			if (!(closePromise instanceof Promise)) {
				closePromise = Promise.resolve(true);
			}
			closePromise.then(() => {
				var exps = false;
				try { exps = require(this.filePath); }
				catch (x) { reject(x); }
				if (exps) resolve(exps);
			}).catch(reject);
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