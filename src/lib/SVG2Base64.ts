export class SVG2Base64 {
    public static get(content: string) {
        content = content.replace(/"/g, "'");
        content = content.replace(/\s+/g, " ");
        content = content.replace(/[{}\|\\\^~\[\]`"<>#%]/g, (match) => {
            return "%" + match[0].charCodeAt(0).toString(16).toUpperCase();
        });
        return "data:image/svg+xml;charset=utf8," + content.trim();
    }
}
