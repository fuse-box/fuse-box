if (FuseBox.isServer) {
    module.exports = global.require("http");
} else {
    module.exports = {};
}
