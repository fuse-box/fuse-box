"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReplacePluginClass {
    constructor(options) {
        this.options = options;
        this.test = /.*/;
    }
    ;
    transform(file) {
        for (let key in this.options) {
            if (this.options.hasOwnProperty(key)) {
                const regexp = new RegExp(key, 'g');
                file.contents = file.contents.replace(regexp, this.options[key]);
            }
        }
    }
}
exports.ReplacePluginClass = ReplacePluginClass;
exports.ReplacePlugin = (options) => {
    return new ReplacePluginClass(options);
};
