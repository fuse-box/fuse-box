if (FuseBox.isServer) {
    module.exports = global.require("module");
} else {
    module.exports = {
        _load: FuseBox.import,
        globalPaths: [],
    };
}
