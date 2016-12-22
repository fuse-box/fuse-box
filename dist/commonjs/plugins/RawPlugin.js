"use strict";
class RawPluginClass {
    constructor() {
        this.test = /.*/;
    }
    init(context) { }
    transform(file) {
        file.loadContents();
        file.contents = `module.exports = ${JSON.stringify(file.contents)}`;
    }
}
exports.RawPluginClass = RawPluginClass;
exports.RawPlugin = () => {
    return new RawPluginClass();
};
