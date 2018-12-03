import { VueBlockFile } from "./VueBlockFile";

export class VueTemplateFile extends VueBlockFile {
	private toFunction(code) {
		const vueTranspiler = require("vue-template-es2015-compiler");
		return vueTranspiler(`function render () {${code}}`);
	}

	public async process() {
		const vueCompiler = require("vue-template-compiler");
		this.loadContents();

		return this.pluginChain
			.reduce((chain, plugin) => {
				return chain
					.then(() => {
						const promise = plugin.transform(this);
						return promise || Promise.resolve(this);
					})
					.then(() => {
						this.contents = JSON.parse(
							this.contents
								.replace("module.exports.default =", "")
								.replace("module.exports =", "")
								.trim(),
						);
					})
					.then(() => vueCompiler.compile(this.contents));
			}, Promise.resolve())
			.then((compiled: any) => {
				return `Object.assign(_options, {
        _scopeId: ${this.scopeId ? JSON.stringify(this.scopeId) : null},
        render: ${this.toFunction(compiled.render)},
        staticRenderFns: [${compiled.staticRenderFns.map(t => this.toFunction(t)).join(",")}]
      })`;
			})
			.then((contents: string) => {
				this.contents = contents;
			});
	}
}
