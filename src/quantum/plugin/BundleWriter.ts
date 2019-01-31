import * as fs from "fs";
import { each } from "realm-utils";
import { Bundle } from "../../core/Bundle";
import { ScriptTarget } from "../../core/File";
import { ensureUserPath, joinFuseBoxPath, uglify, Concat } from "../../Utils";
import { CSSCollection } from "../core/CSSCollection";
import { CSSOptimizer } from "./CSSOptimizer";
import { QuantumCore } from "./QuantumCore";
import { QuantumSplitConfig } from "./QuantumSplit";
export class BundleWriter {
	private bundles = new Map<string, Bundle>();
	constructor(public core: QuantumCore) {}

	private getUglifyJSOptions(bundle: Bundle): any {
		let opts = this.core.opts.shouldUglify() || {};
		const userTerser = this.core.context.languageLevel > ScriptTarget.ES5 || !!opts.es6;
		if (typeof opts === "boolean") {
			opts = {};
		}
		if (userTerser) {
			this.core.context.log.echoInfo("Using terser because the target is greater than ES5 or es6 option is set");
		} else {
			this.core.context.log.echoInfo("Using uglify-js because the target is set to ES5 and no es6 option is set");
		}

		if (bundle.generatedSourceMaps) {
			opts.sourceMap = {
				includeSources: true,
				content: bundle.generatedSourceMaps,
				url: bundle.generatedSourceMapsPath,
			};
		}

		return {
			...opts,
			es6: userTerser,
		};
	}

	private createBundle(name: string, code?: string): Bundle {
		let bundle = new Bundle(name, this.core.producer.fuse.copy(), this.core.producer);
		if (code) {
			bundle.generatedCode = new Buffer(code);
		}

		this.bundles.set(bundle.name, bundle);
		return bundle;
	}

	private addShims() {
		const producer = this.core.producer;
		// check for shims
		if (producer.fuse.context.shim) {
			const shims = [];
			for (let name in producer.fuse.context.shim) {
				let item = producer.fuse.context.shim[name];
				if (item.source) {
					let shimPath = ensureUserPath(item.source);
					if (!fs.existsSync(shimPath)) {
						console.warn(`Shim error: Not found: ${shimPath}`);
					} else {
						shims.push(fs.readFileSync(shimPath).toString());
					}
				}
			}
			if (shims.length) {
				this.createBundle(this.core.opts.shimsPath, shims.join("\n"));
			}
		}
	}

	private uglifyBundle(bundle: Bundle) {
		this.core.log.echoInfo(`Uglifying ${bundle.name}...`);

		const result = uglify(bundle.generatedCode, this.getUglifyJSOptions(bundle));
		if (result.error) {
			this.core.log.echoBoldRed(`  → Error during uglifying ${bundle.name}`).error(result.error);
			throw result.error;
		}
		bundle.generatedCode = result.code;
		if (result.map) {
			bundle.generatedSourceMaps = result.map;
		}
		this.core.log.echoInfo(`Done uglifying ${bundle.name}`);
		this.core.log.echoGzip(result.code);
	}

	public async process() {
		const producer = this.core.producer;
		const bundleManifest: any = {};
		this.addShims();

		producer.bundles.forEach(bundle => {
			this.bundles.set(bundle.name, bundle);
		});

		if (this.core.opts.isContained() && producer.bundles.size > 1) {
			this.core.opts.throwContainedAPIError();
		}

		// create api bundle (should be the last)
		if (this.core.opts.shouldCreateApiBundle()) {
			this.createBundle("api.js");
		}

		producer.bundles = this.bundles;

		let splitFileOptions: any;
		if (this.core.context.quantumBits.size > 0) {
			const splitConf: QuantumSplitConfig = this.core.context.quantumSplitConfig;
			splitFileOptions = {
				c: {
					b: splitConf.getBrowserPath(),
					s: splitConf.getServerPath(),
				},
				i: {},
			};
			this.core.api.setBundleMapping(splitFileOptions);
			this.core.quantumBits.forEach(bit => {
				// even though bit is banned we still need to map it
				// in order for await import() to work
				if (bit.banned) {
					splitFileOptions.i[bit.name] = bit.entry.getID();
				}
			});
		}

		let index = 1;
		const writeBundle = async (bundle: Bundle) => {
			const output = await bundle.context.output.writeCurrent(bundle.generatedCode);
			let entryString;
			if (bundle.quantumBit && bundle.quantumBit.entry) {
				entryString = bundle.quantumBit.entry.getFuseBoxFullPath();
			}
			bundleManifest[bundle.name] = {
				fileName: output.filename,
				hash: output.hash,
				type: "js",
				entry: entryString,
				absPath: output.path,
				webIndexed: !bundle.quantumBit,
				relativePath: output.relativePath,
			};
			// if this bundle belongs to splitting
			// we need to remember the generated file name and store
			// and then pass to the API
			if (bundle.quantumBit) {
				const splitOpts: any = [output.relativePath, bundle.quantumBit.entry.getID()];
				splitFileOptions.i[bundle.quantumBit.name] = splitOpts;
				const cssCollection = bundle.quantumBit.cssCollection;
				if (cssCollection) {
					let cssName = bundle.quantumBit.name;
					if (!/\.css$/.test(cssName)) {
						cssName = `${cssName}.css`;
					}
					const splitConfig = this.core.context.quantumSplitConfig;
					const output = await writeCSS(cssCollection, cssName);
					if (output) {
						if (bundle.quantumBit && splitConfig && splitConfig.resolveOptions) {
							const dest = splitConfig.getDest();
							cssName = joinFuseBoxPath(dest, output.filename);
						} else {
							cssName = output.filename;
						}
						splitOpts.push({ css: true, name: cssName });
					}
				}
			}
		};
		const writeCSS = async (cssCollection: CSSCollection, key: string) => {
			if (cssCollection.written) {
				return;
			}
			const cssData = cssCollection.collection;

			if (cssData.size > 0) {
				const output = this.core.producer.fuse.context.output;
				let name =
					key === "default"
						? this.core.opts.getCSSPath()
						: this.core.opts.getCSSFiles()
							? this.core.opts.getCSSFiles()[key]
							: key;
				if (!/\.css$/.test(name)) {
					name = `${name}.css`;
				}

				// make sure css files are piped in the same place where the split bundles go
				const splitConfig = this.core.context.quantumSplitConfig;
				if (cssCollection.quantumBit && splitConfig && splitConfig.resolveOptions) {
					const dest = splitConfig.getDest();
					name = joinFuseBoxPath(dest, name);
				}
				cssCollection.render(name);
				let useSourceMaps = cssCollection.useSourceMaps;

				const cleanCSSOptions = this.core.opts.getCleanCSSOptions();
				if (cleanCSSOptions) {
					const optimer = new CSSOptimizer(this.core);
					optimer.optimize(cssCollection, cleanCSSOptions);
				}

				const cssResultData = await output.writeToOutputFolder(name, cssCollection.getString(), true);

				bundleManifest[name] = {
					fileName: cssResultData.filename,
					type: "css",
					hash: cssResultData.hash,
					absPath: cssResultData.path,
					relativePath: cssResultData.relativePath,
					webIndexed: cssCollection.splitCSS ? false : true,
				};
				if (!cssCollection.splitCSS) {
					this.core.producer.injectedCSSFiles.add(cssResultData.filename);
				}

				if (useSourceMaps) {
					output.writeToOutputFolder(cssCollection.sourceMapsPath, cssCollection.sourceMap);
				}
				cssCollection.written = true;
				return cssResultData;
			}
		};

		return each(producer.bundles, async (bundle: Bundle) => {
			if (bundle.name === "api.js") {
				// has to be the highest priority
				// assuming that u user won't make more than 1000 bundles...
				bundle.webIndexPriority = 1000;
				if (this.core.opts.isContained()) {
					this.core.opts.throwContainedAPIError();
				}
				bundle.generatedCode = new Buffer(this.core.api.render());
			} else {
				bundle.webIndexPriority = 1000 - index;
			}

			// if the api wants to be  baked it, we have to skip generation now

			if (!this.core.opts.shouldBakeApiIntoBundle(bundle.name)) {
				if (this.core.opts.shouldUglify()) {
					this.uglifyBundle(bundle);
				}
				index++;
				await writeBundle(bundle);
				if (bundle.generatedSourceMaps && bundle.generatedSourceMapsPath) {
					await bundle.context.output.writeToOutputFolder(bundle.generatedSourceMapsPath, bundle.generatedSourceMaps);
				}
			}
		})
			.then(async () => {
				if (!this.core.opts.shouldCreateApiBundle()) {
					this.core.opts.getMissingBundles(producer.bundles).forEach(bundle => {
						this.core.log.echoBoldRed(`  → Error. Can't find bundle name ${bundle}`);
					});

					for (const [name, bundle] of producer.bundles) {
						if (this.core.opts.shouldBakeApiIntoBundle(name)) {
							const generatedAPIBundle = this.core.api.render();
							if (this.core.opts.isContained()) {
								bundle.generatedCode = new Buffer(
									bundle.generatedCode
										.toString()
										.replace("/*$$CONTAINED_API_PLACEHOLDER$$*/", generatedAPIBundle.toString()),
								);
							} else {
								if (bundle.generatedSourceMaps) {
									// baking api into bundle
									// not breaking sourcemaps
									const concat = new Concat(true, "", "\n");
									concat.add(null, generatedAPIBundle);
									concat.add(null, bundle.generatedCode, bundle.generatedSourceMaps);
									bundle.generatedCode = concat.content;
									bundle.generatedSourceMaps = concat.sourceMap;
								} else {
									bundle.generatedCode = new Buffer(generatedAPIBundle + "\n" + bundle.generatedCode);
								}
							}
							if (this.core.opts.shouldUglify()) {
								this.uglifyBundle(bundle);
							}
							await writeBundle(bundle);
							if (bundle.generatedSourceMaps && bundle.generatedSourceMapsPath) {
								await bundle.context.output.writeToOutputFolder(
									bundle.generatedSourceMapsPath,
									bundle.generatedSourceMaps,
								);
							}
						}
					}
				}
			})
			.then(async () => {
				if (this.core.opts.shouldGenerateCSS()) {
					for (const item of this.core.cssCollection) {
						const cssCollection = item[1];
						await writeCSS(cssCollection, item[0]);
					}
				}
			})
			.then(() => {
				const manifestPath = this.core.opts.getManifestFilePath();
				if (manifestPath) {
					this.core.producer.fuse.context.output.writeToOutputFolder(
						manifestPath,
						JSON.stringify(bundleManifest, null, 2),
					);
				}
				if (this.core.opts.webIndexPlugin) {
					return this.core.opts.webIndexPlugin.producerEnd(producer);
				}
			})
			.then(() => {
				// calling completed()
				this.core.producer.bundles.forEach(bundle => {
					if (bundle.onDoneCallback) {
						bundle.process.setFilePath(bundle.fuse.context.output.lastWrittenPath);
						bundle.onDoneCallback(bundle.process);
					}
				});
			});
	}
}
