if (FuseBox.isServer) {
    module.exports = global.require("tls");
} else {
    module.exports = {};
}
