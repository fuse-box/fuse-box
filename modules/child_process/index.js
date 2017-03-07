if (FuseBox.isServer) {
    module.exports = global.require("child_process");
} else {
    module.exports = {};
}
