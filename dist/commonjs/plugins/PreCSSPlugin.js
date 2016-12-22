"use strict";
const predefinedExt = new Map([
    ['less', '.less'],
    ['stylus', '.styl'],
    ['sass', '.scss']
]);
class PreCSSPluginClass {
    constructor(opts) {
        this.opts = opts;
        this.processorType = 'less';
        this.test = this.createRegExpFromExt(predefinedExt.get(this.processorType));
        this.ext = predefinedExt.get(this.processorType);
        this.opts = opts;
        if (opts.type) {
            this.processorType = opts.type;
            if (predefinedExt.has(this.processorType)) {
                this.ext = predefinedExt.get(this.processorType);
                this.test = this.createRegExpFromExt(predefinedExt.get(this.processorType));
            }
        }
        if (opts.test)
            this.test = opts.test;
        if (opts.ext)
            this.ext = opts.ext;
        this.processor = this.prepareProcessor();
    }
    init(context) {
        context.allowExtension(this.ext);
    }
    transform(file) {
        file.loadContents();
        return this.compile(file.contents).then(content => {
            file.contents = content;
            return file.createChain('style', file);
        });
    }
    prepareProcessor() {
        if (this.opts.render)
            return this.opts.render;
        return require(`./precss/${this.processorType}`).render;
    }
    compile(content) {
        return this.processor(content, this.opts.options);
    }
    createRegExpFromExt(ext) {
        return new RegExp(`\\${ext}$`);
    }
}
exports.PreCSSPluginClass = PreCSSPluginClass;
exports.PreCSSPlugin = (options) => {
    return new PreCSSPluginClass(options);
};
