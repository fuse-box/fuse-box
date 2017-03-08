/*
 * From https://github.com/defunctzombie/node-util/blob/master/support/isBuffer.js
 */
module.exports = function isBuffer(arg) {
    if (typeof Buffer !== "undefined") {
        return arg instanceof Buffer;
    } else {
        return arg && typeof arg === "object"
    && typeof arg.copy === "function"
    && typeof arg.fill === "function"
    && typeof arg.readUInt8 === "function";
    }
};
