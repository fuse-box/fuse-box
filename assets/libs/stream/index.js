if (typeof window === "undefined") {
    module.exports = global.stream
} else {
    module.exports = {}
}