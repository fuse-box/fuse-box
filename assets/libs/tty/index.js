if (typeof window === "undefined") {
    module.exports = global.require("tty");
} else {
    module.exports = {}
}