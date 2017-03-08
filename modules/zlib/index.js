if (FuseBox.isServer) {
    module.exports = global.require("zlib");
} else {
    module.exports = {};
}
