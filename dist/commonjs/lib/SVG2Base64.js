"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SVG2Base64 {
    static get(content) {
        content = content.replace(/"/g, "'");
        content = content.replace(/\s+/g, " ");
        content = content.replace(/[{}\|\\\^~\[\]`"<>#%]/g, (match) => {
            return "%" + match[0].charCodeAt(0).toString(16).toUpperCase();
        });
        return "data:image/svg+xml;charset=utf8," + content.trim();
    }
}
exports.SVG2Base64 = SVG2Base64;
