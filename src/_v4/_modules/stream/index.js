if (FuseBox.isServer) {
  module.exports = global.require("stream");
} else {
  module.exports = require("stream-browserify");
}
