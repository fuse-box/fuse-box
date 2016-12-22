"use strict";
const realm_utils_1 = require("realm-utils");
class ChainPluginClass {
    constructor(test, plugins) {
        this.test = test;
        this.plugins = plugins;
    }
    add(plugin) {
        this.plugins.push(plugin);
        return this;
    }
    bundleStart(context) {
        let plugin = this.plugins.find(plugin => realm_utils_1.utils.isFunction(plugin.bundleStart));
        if (plugin) {
            plugin.bundleStart(context);
        }
    }
    transform(file) {
        return realm_utils_1.each(this.plugins, (plugin) => {
            if (realm_utils_1.utils.isFunction(plugin.initialize)) {
                return plugin.initialize.apply(plugin, [file.context]);
            }
            if (realm_utils_1.utils.isFunction(plugin.transform)) {
                return plugin.transform.apply(plugin, [file]);
            }
        });
    }
    bundleEnd(context) {
        let plugin = this.plugins.find(plugin => realm_utils_1.utils.isFunction(plugin.bundleEnd));
        if (plugin) {
            plugin.bundleEnd(context);
        }
    }
}
exports.ChainPluginClass = ChainPluginClass;
exports.ChainPlugin = (test, plugins) => {
    return new ChainPluginClass(test, plugins);
};
