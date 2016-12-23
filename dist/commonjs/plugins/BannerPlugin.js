"use strict";
class BannerPluginClass {
    constructor(banner) {
        this.test = /\.js$/;
        this.banner = banner || '';
    }
    preBundle(context) {
        context.source.addContent(this.banner);
    }
}
exports.BannerPluginClass = BannerPluginClass;
exports.BannerPlugin = (banner) => {
    return new BannerPluginClass(banner);
};
