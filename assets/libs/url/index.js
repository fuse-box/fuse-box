if (FuseBox.isServer) {
    module.exports = global.require("url");
} else {
    module.exports = {}
}