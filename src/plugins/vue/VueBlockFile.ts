import * as fs from "fs";
import { extractExtension } from "../../Utils";
import { File } from "../../core/File";
import { Plugin } from "../../core/WorkflowContext";
import { IPathInformation } from "../../core/PathMaster";
import { CSSPluginClass } from "../stylesheet/CSSplugin";
import { LESSPluginClass } from "../stylesheet/LESSPlugin";
import { SassPluginClass } from "../stylesheet/SassPlugin";
import { StylusPluginClass } from "../stylesheet/StylusPlugin";
import { FuseBoxHTMLPlugin } from "../HTMLplugin";
import { BabelPluginClass } from "../js-transpilers/BabelPlugin";
import { CoffeePluginClass } from "../js-transpilers/CoffeePlugin";
import { ConsolidatePluginClass } from "../ConsolidatePlugin";
const PLUGIN_LANG_MAP = new Map<string, any>()
	.set("css", new CSSPluginClass())
	.set("less", new LESSPluginClass())
	.set("scss", new SassPluginClass({ importer: true }))
	.set("sass", new SassPluginClass({ importer: true, indentedSyntax: true }))
	.set("styl", new StylusPluginClass())
	.set("stylus", new StylusPluginClass())
	.set("html", new FuseBoxHTMLPlugin())
	.set("js", new BabelPluginClass())
	.set("ts", null) // Null - just use the bog standard TS compiler, no need for plugins
	.set("coffee", new CoffeePluginClass());

export abstract class VueBlockFile extends File {
	constructor(
		public file: File,
		public info: IPathInformation,
		public block: any,
		public scopeId: string,
		public pluginChain: Plugin[],
	) {
		super(file.context, info);
		this.collection = file.collection;
		this.context.extensionOverrides && this.context.extensionOverrides.setOverrideFileInfo(this);
		this.ignoreCache = true;
	}

	public setPluginChain(block: any, pluginChain: Plugin[]) {
		const defaultExtension = extractExtension(this.info.fuseBoxPath);

		if (pluginChain.length === 0 && !block.lang) {
			if (defaultExtension === "js" && this.context.useTypescriptCompiler) {
				pluginChain.push(PLUGIN_LANG_MAP.get("ts"));
			} else if (block.type === "template" && extractExtension(this.info.absPath) !== "html") {
				pluginChain.push(
					new ConsolidatePluginClass({
						engine: extractExtension(this.info.absPath),
					}),
				);
			} else {
				pluginChain.push(PLUGIN_LANG_MAP.get(defaultExtension));
			}
		}

		if (pluginChain.length === 0 && block.lang) {
			if ((defaultExtension === "js" && this.context.useTypescriptCompiler) || block.lang === "ts") {
				pluginChain.push(PLUGIN_LANG_MAP.get("ts"));
			} else {
				const PluginToUse = PLUGIN_LANG_MAP.get(block.lang.toLowerCase());

				if (!PluginToUse) {
					if (block.type === "template") {
						pluginChain.push(
							new ConsolidatePluginClass({
								engine: block.lang.toLowerCase(),
							}),
						);
					} else {
						const message = `VueComponentClass - cannot find a plugin to transpile lang="${block.lang}"`;
						this.context.log.echoError(message);
						return Promise.reject(new Error(message));
					}
				} else {
					pluginChain.push(PluginToUse);
				}

				if (block.type === "style" && !(PluginToUse instanceof CSSPluginClass)) {
					pluginChain.push(PLUGIN_LANG_MAP.get("css"));
				}
			}
		}

		const pluginChainString = this.pluginChain
			.map(plugin => {
				return plugin ? plugin.constructor.name : "TypeScriptCompiler";
			})
			.join(" → ");

		this.context.debug("VueComponentClass", `using ${pluginChainString} for ${this.info.fuseBoxPath}`);
	}

	public loadContents() {
		if (this.isLoaded) {
			return;
		}

		if (this.block.src || this.hasExtensionOverride) {
			try {
				this.contents = fs.readFileSync(this.info.absPath).toString();
			} catch (e) {
				this.context.log.echoError(`VueComponentPlugin - Could not load external file ${this.info.absPath}`);
			}
		} else {
			this.contents = this.block.content;
		}

		this.isLoaded = true;
	}

	public abstract async process(): Promise<void>;
}
