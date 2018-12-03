if (FuseBox.isServer) {
	module.exports = global.require("stream");
} else {
	module.exports = { Stream: require("stream-browserify") };
}
