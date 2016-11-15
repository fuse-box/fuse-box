module.exports = function(__filename, contents) {
    if (typeof window !== 'undefined') {
        var styleId = __filename.replace(/[\.\/]+/g, "-");
        if (styleId.charAt(0) === '-') styleId = styleId.substring(1);
        var exists = document.getElementById(styleId);
        if (!exists) {
            var s = document.createElement("style");
            s.id = styleId;
            s.innerHTML = contents;
            document.getElementsByTagName("head")[0].appendChild(s);
        }
    }
}