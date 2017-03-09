if (FuseBox.isServer) {
    module.exports = global.require("crypto");
} else {
    module.exports = {};
}
