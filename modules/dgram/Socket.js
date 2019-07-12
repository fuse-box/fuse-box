"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var events_1 = require("events");
var bowser = require("bowser");
var UDPBrowserTypes;
(function (UDPBrowserTypes) {
    UDPBrowserTypes[UDPBrowserTypes["ChromeSocketUDP"] = 0] = "ChromeSocketUDP";
    UDPBrowserTypes[UDPBrowserTypes["ChromeSocketsUDP"] = 1] = "ChromeSocketsUDP";
    UDPBrowserTypes[UDPBrowserTypes["FirefoxUDP"] = 2] = "FirefoxUDP";
})(UDPBrowserTypes || (UDPBrowserTypes = {}));
var browserUDP = false;
if (bowser.chrome) {
    if (chrome.sockets.tcp) {
        browserUDP = UDPBrowserTypes.ChromeSocketsUDP;
    }
    else if (chrome.socket) {
        browserUDP = UDPBrowserTypes.ChromeSocketUDP;
    }
}
if (bowser.firefox) {
    if (navigator.mozUDPSocket) {
        browserUDP = UDPBrowserTypes.FirefoxUDP;
    }
}
var NotInThisBrowserError = /** @class */ (function (_super) {
    __extends(NotInThisBrowserError, _super);
    function NotInThisBrowserError(message, inner_error) {
        var _this = this;
        message = "Method not implemented in this browser: " + (message ? message : "");
        _this = _super.call(this, message) || this;
        return _this;
    }
    return NotInThisBrowserError;
}(Error));
/**
 * @since Chrome 33
 */
var Socket = /** @class */ (function (_super) {
    __extends(Socket, _super);
    /**
     * Note that in Node's `dgram`, you're not supposed to ever do
     * `new dgram.Socket()` (presumably for legacy compatibility reasons). Here
     * we have no problem including a constructor.
     */
    function Socket(type, reuseAddr) {
        if (reuseAddr === void 0) { reuseAddr = false; }
        var _this = _super.call(this) || this;
        _this._chromeSocketId = null;
        _this._firefoxSocket = null;
        _this._addressInfo = null;
        if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
            _this._onReceiveChrome = _this._onReceiveChrome.bind(_this);
            _this._onReceiveErrorChrome = _this._onReceiveErrorChrome.bind(_this);
            chrome.sockets.udp.onReceive.addListener(_this._onReceiveChrome);
            chrome.sockets.udp.onReceiveError.addListener(_this._onReceiveErrorChrome);
            chrome.sockets.udp.create({}, function (createInfo) {
                _this._chromeSocketId = createInfo.socketId;
            });
        }
        return _this;
    }
    Socket.prototype._onReceiveChrome = function (info) {
        if (info.socketId === this._chromeSocketId) {
            this.emit('message', Buffer.from(info.data), { address: info.remoteAddress, port: info.remotePort });
        }
    };
    Socket.prototype._onReceiveErrorChrome = function (info) {
        if (info.socketId === this._chromeSocketId) {
            this.emit('error', new Error("Bad socket result code: " + info.resultCode));
        }
    };
    Socket.prototype.send = function (msg, portOrOffset, addressOrLength, callbackOrPort, address, callback) {
        var _this = this;
        if (address === void 0) { address = 'localhost'; }
        var length = null;
        var offset = 0;
        var port = 0;
        if (typeof addressOrLength === 'string') {
            port = portOrOffset;
            address = addressOrLength;
            callback = callbackOrPort;
        }
        else {
            offset = portOrOffset;
            length = addressOrLength;
            port = callbackOrPort;
        }
        if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
            if (!this._chromeSocketId) {
                throw new Error('Socket not created');
            }
            if (!this._addressInfo) {
                this._addressInfo = { address: '0.0.0.0', 'port': 0, 'family': 'udp4' };
                this.bind(this._addressInfo.port, this._addressInfo.address);
            }
            if (Array.isArray(msg) && msg.length === 0) {
                throw new Error('Array argument must have at least one item');
            }
            if (Array.isArray(msg)) {
                if (typeof msg[0] === 'string') {
                    msg = msg.reduce(function (accumulator, item) {
                        return accumulator += item;
                    }, '');
                }
                else {
                    msg = Buffer.concat(msg);
                }
            }
            if (typeof msg === 'string') {
                msg = Buffer.from(msg);
            }
            if (length) {
                msg = msg.slice(offset, length);
            }
            chrome.sockets.udp.send(this._chromeSocketId, msg.buffer, this._addressInfo.address, this._addressInfo.port, function (sendInfo) {
                if (sendInfo.resultCode < 0) {
                    var error = new Error("Bad network result code: " + sendInfo.resultCode);
                    if (callback) {
                        callback(error);
                    }
                    else {
                        _this.emit('error', error);
                    }
                }
                if (callback) {
                    callback(sendInfo.bytesSent);
                }
            });
            return;
        }
        throw new Error('No available ways to send.');
    };
    Socket.prototype.bind = function (portOrOptions, addressOrCallback, callback) {
        var _this = this;
        var address;
        var port;
        var exclusive;
        if (typeof portOrOptions === 'object') {
            port = portOrOptions.port;
            address = portOrOptions.address || '0.0.0.0';
            exclusive = portOrOptions.exclusive || false;
            callback = addressOrCallback;
        }
        else {
            port = portOrOptions || 0;
            address = addressOrCallback || '0.0.0.0';
        }
        this._addressInfo = {
            address: address,
            port: port,
            family: 'udp4'
        };
        if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
            if (!this._chromeSocketId) {
                throw new Error('Socket not created');
            }
            chrome.sockets.udp.bind(this._chromeSocketId, address, port, function (result) {
                if (result < 0) {
                    _this.emit('error', new Error("Bad network result code: " + result));
                }
                else {
                    if (callback) {
                        callback();
                    }
                    _this.emit('listening');
                }
            });
            return;
        }
        throw new NotInThisBrowserError();
    };
    /**
     * Close the underlying socket and stop listening for data on it. If a
     * callback is provided, it is added as a listener for the 'close' event.
     */
    Socket.prototype.close = function (callback) {
        var _this = this;
        if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
            if (!this._chromeSocketId) {
                throw new Error('Socket not created');
            }
            chrome.sockets.udp.close(this._chromeSocketId, function () {
                if (callback) {
                    _this.addListener('close', callback);
                }
                _this.emit('close');
            });
            return;
        }
        throw new NotInThisBrowserError();
    };
    /**
     * Returns an object containing the address information for a socket. For UDP
     * sockets, this object will contain address, family and port properties.
     */
    Socket.prototype.address = function () {
        if (!this._addressInfo) {
            throw new Error('No address info is available');
        }
        return this._addressInfo;
    };
    /**
     * When set to true, UDP packets may be sent to a local interface's broadcast
     * address.
     *
     * @since Chrome 44
     */
    Socket.prototype.setBroadcast = function (flag) {
        if (!flag) {
            throw new Error('setBroadcast requires an argument');
        }
        if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
            if (!this._chromeSocketId)
                throw new Error('Socket not created');
            chrome.sockets.udp.setBroadcast(this._chromeSocketId, flag);
            return;
        }
        throw new NotInThisBrowserError();
    };
    /**
     * Sets the IP_TTL socket option. While TTL generally stands for "Time to
     * Live", in this context it specifies the number of IP hops that a packet is
     * allowed to travel through. Each router or gateway that forwards a packet
     * decrements the TTL. If the TTL is decremented to 0 by a router, it will not
     * be forwarded. Changing TTL values is typically done for network probes or
     * when multicasting.
     *
     * @param ttl A number of hops between 1 and 255. The default on most systems
     * is 64 but can vary.
     */
    Socket.prototype.setTTL = function (ttl) {
        if (!ttl) {
            throw new Error('setTTL requires an argument');
        }
        if (ttl < 1 || ttl > 255) {
            throw new Error('ttl for setTTL should be between 1 and 255.');
        }
        if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
            if (!this._chromeSocketId)
                throw new Error('Socket not created');
            throw new Error('Method not implemented in Chrome.');
        }
        throw new NotInThisBrowserError();
    };
    /**
     * Sets the IP_MULTICAST_TTL socket option. While TTL generally stands for
     * "Time to Live", in this context it specifies the number of IP hops that a
     * packet is allowed to travel through, specifically for multicast traffic.
     * Each router or gateway that forwards a packet decrements the TTL. If the
     * TTL is decremented to 0 by a router, it will not be forwarded.
     *
     * The argument passed to to socket.setMulticastTTL() is a number of hops
     * between 0 and 255. The default on most systems is 1 but can vary.
     */
    Socket.prototype.setMulticastTTL = function (ttl) {
        var _this = this;
        if (!ttl) {
            throw new Error('setMulticastTTL requires an argument');
        }
        if (!ttl || ttl < 1 || ttl > 255) {
            throw new Error('ttl for setTTL should be between 1 and 255.');
        }
        if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
            if (!this._chromeSocketId)
                throw new Error('Socket not created');
            chrome.sockets.udp.setMulticastTimeToLive(this._chromeSocketId, ttl, function (result) {
                if (result < 0) {
                    _this.emit('error', new Error('Bad network result code:' + result));
                }
            });
            return;
        }
        throw new NotInThisBrowserError();
    };
    /**
     * Sets or clears the IP_MULTICAST_LOOP socket option. When set to true,
     * multicast packets will also be received on the local interface.
     */
    Socket.prototype.setMulticastLoopback = function (flag) {
        if (!flag) {
            throw new Error('setMulticastLoopback requires an argument');
        }
        if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
            if (!this._chromeSocketId)
                throw new Error('Socket not created');
            /**
             * Note: the behavior of setMulticastLoopbackMode is slightly different
             * between Windows and Unix-like systems. The inconsistency happens only
             * when there is more than one application on the same host joined to the
             * same multicast group while having different settings on multicast
             * loopback mode. On Windows, the applications with loopback off will not
             * RECEIVE the loopback packets; while on Unix-like systems, the
             * applications with loopback off will not SEND the loopback packets to
             * other applications on the same host. See MSDN: http://goo.gl/6vqbj
             */
            chrome.sockets.udp.setMulticastLoopbackMode(this._chromeSocketId, flag, function () { });
            return;
        }
        throw new NotInThisBrowserError();
    };
    /**
     * Join a multicast group.
     *
     * @param multicastInterface Included for interface compatibility, but does
     *                           nothing.
     */
    Socket.prototype.addMembership = function (multicastAddress, multicastInterface) {
        var _this = this;
        if (!multicastAddress) {
            throw new Error('An address must be provided');
        }
        if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
            if (!this._chromeSocketId)
                throw new Error('Socket not created');
            chrome.sockets.udp.joinGroup(this._chromeSocketId, multicastAddress, function (result) {
                if (result < 0) {
                    _this.emit('error', new Error('Bad network result code:' + result));
                }
            });
            return;
        }
        throw new NotInThisBrowserError();
    };
    /**
     * Leave a multicast group. This happens automatically when the socket is
     * closed, so it's only needed when reusing sockets.
     *
     * @param multicastInterface Included for interface compatibility, but does
     *                           nothing.
     */
    Socket.prototype.dropMembership = function (multicastAddress, multicastInterface) {
        var _this = this;
        if (!multicastAddress) {
            throw new Error('An address must be provided');
        }
        if (browserUDP === UDPBrowserTypes.FirefoxUDP) {
            throw new Error('Method not implemented in Firefox.');
        }
        if (browserUDP === UDPBrowserTypes.ChromeSocketsUDP) {
            if (!this._chromeSocketId)
                throw new Error('Socket not created');
            chrome.sockets.udp.leaveGroup(this._chromeSocketId, multicastAddress, function (result) {
                if (result < 0) {
                    _this.emit('error', new Error('Bad network result code:' + result));
                }
            });
            return;
        }
        throw new NotInThisBrowserError();
    };
    Socket.prototype.ref = function () {
        throw new Error('Method not implemented in this browser');
    };
    Socket.prototype.unref = function () {
        throw new Error('Method not implemented in this browser');
    };
    Socket.prototype.addListener = function (event, listener) {
        return _super.prototype.addListener.call(this, event, listener);
    };
    Socket.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.call(this, event, args);
    };
    Socket.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    Socket.prototype.once = function (event, listener) {
        return _super.prototype.once.call(this, event, listener);
    };
    Socket.prototype.prependListener = function (event, listener) {
        return _super.prototype.prependListener.call(this, event, listener);
    };
    Socket.prototype.prependOnceListener = function (event, listener) {
        return _super.prototype.prependOnceListener.call(this, event, listener);
    };
    return Socket;
}(events_1.EventEmitter));
exports.Socket = Socket;
