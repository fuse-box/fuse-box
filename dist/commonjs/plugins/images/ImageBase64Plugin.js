"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const SVG2Base64_1 = require("../../lib/SVG2Base64");
const base64Img = require("base64-img");
class ImageBase64PluginClass {
    constructor() {
        this.test = /\.(gif|png|jpg|jpeg|svg)$/i;
    }
    init(context) {
        context.allowExtension(".gif");
        context.allowExtension(".png");
        context.allowExtension(".jpg");
        context.allowExtension(".jpeg");
        context.allowExtension(".svg");
    }
    transform(file) {
        const context = file.context;
        const cached = context.cache.getStaticCache(file);
        if (cached) {
            file.isLoaded = true;
            file.contents = cached.contents;
        }
        else {
            const ext = path.extname(file.absPath);
            if (ext === ".svg") {
                file.loadContents();
                let content = SVG2Base64_1.SVG2Base64.get(file.contents);
                file.contents = `module.exports = ${JSON.stringify(content)}`;
                return;
            }
            file.isLoaded = true;
            const data = base64Img.base64Sync(file.absPath);
            file.contents = `module.exports = ${JSON.stringify(data)}`;
            context.cache.writeStaticCache(file, undefined);
        }
    }
}
exports.ImageBase64PluginClass = ImageBase64PluginClass;
;
exports.ImageBase64Plugin = () => {
    return new ImageBase64PluginClass();
};
