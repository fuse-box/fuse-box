if (FuseBox.isServer) {
    module.exports = global.require("net");
} else {
    module.exports = {};
}
