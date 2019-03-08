"use strict";
exports.__esModule = true;
var Socket_1 = require("./Socket");
function createSocket(typeOrOptions, callback) {
    var type, reuseAddr = false;
    if (typeof typeOrOptions === 'string') {
        type = typeOrOptions === 'udp6' ? 'udp6' : 'udp4';
    }
    else {
        type = typeOrOptions.type === 'udp6' ? 'udp6' : 'udp4';
        reuseAddr = typeOrOptions.reuseAddr || false;
    }
    if (callback) {
        this.addListener('message', callback);
    }
    var socket = new Socket_1.Socket(type, reuseAddr);
    return socket;
}
exports["default"] = {
    createSocket: createSocket,
    Socket: Socket_1.Socket
};
