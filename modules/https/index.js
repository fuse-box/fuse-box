if (FuseBox.isServer) {
    module.exports = global.require("https");
} else {
    module.exports = {};
}
