if (FuseBox.isServer) {
    module.exports = global.require("os");
} else {
    module.exports = {};
}
