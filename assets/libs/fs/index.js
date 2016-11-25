if (typeof window === "undefined") {
    module.exports = global.require("fs");
} else {
    module.exports = {}
}