if (FuseBox.isServer) {
    module.exports = global.require("tty");
} else {
    module.exports = {
        isatty() {
            return false;
        },
    };
}
