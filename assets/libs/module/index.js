if (typeof window === "undefined") {
    module.exports = global.require("module");
} else {
    module.exports = {
        globalPaths: {}
    }
}