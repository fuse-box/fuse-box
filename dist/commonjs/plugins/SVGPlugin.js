"use strict";
class SVGSimplePlugin {
    constructor() {
        this.test = /\.svg$/;
    }
    init(context) {
        context.allowExtension(".svg");
    }
    transform(file) {
        file.loadContents();
        let content = file.contents;
        content = content.replace(/"/g, "'");
        content = content.replace(/\s+/g, " ");
        content = content.replace(/[{}\|\\\^~\[\]`"<>#%]/g, (match) => {
            return "%" + match[0].charCodeAt(0).toString(16).toUpperCase();
        });
        let data = "data:image/svg+xml;charset=utf8," + content.trim();
        file.contents = `module.exports = ${JSON.stringify(data)}`;
    }
}
exports.SVGSimplePlugin = SVGSimplePlugin;
;
exports.SVGPlugin = () => {
    return new SVGSimplePlugin();
};
