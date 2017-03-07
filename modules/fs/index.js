if (FuseBox.isServer) {
    module.exports = global.require("fs");
} else {
    module.exports = {};
}
