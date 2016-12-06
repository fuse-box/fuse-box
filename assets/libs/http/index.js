if (typeof window === "undefined") {
    module.exports = global.require("http");
} else {
    module.exports = {}
}