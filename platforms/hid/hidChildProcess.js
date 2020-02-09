"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),
    _this = void 0;

function ownKeys(r, e) {
    var n = Object.keys(r);
    if (Object.getOwnPropertySymbols) {
        var t = Object.getOwnPropertySymbols(r);
        e && (t = t.filter(function(e) {
            return Object.getOwnPropertyDescriptor(r, e).enumerable
        })), n.push.apply(n, t)
    }
    return n
}

function _objectSpread(r) {
    for (var e = 1; e < arguments.length; e++) {
        var n = null != arguments[e] ? arguments[e] : {};
        e % 2 ? ownKeys(n, !0).forEach(function(e) {
            (0, _defineProperty2.default)(r, e, n[e])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(n)) : ownKeys(n).forEach(function(e) {
            Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(n, e))
        })
    }
    return r
}
var currentPort, hidConnection, disconnectTimeId, hid = require("node-hid"),
    logger = require("../../logger"),
    enableHIDInLinux = function(e) {
        var r = path.join(__dirname, "linux-tool", "enableHID.sh");
        _this.spawn("bash " + r, [], e)
    },
    checkDisconnect = function() {
        clearTimeout(disconnectTimeId), disconnectTimeId = clearTimeout(function() {
            hidConnection && hidConnection.close(), process.send({
                method: "disconnect",
                error: "Disconnect",
                connectName: currentPort
            })
        }, 500)
    },
    checkDevice = function(r, n) {
        return hid.devices().find(function(e) {
            return e.vendorId === r && e.productId === n
        })
    },
    connect = function(e, r) {
        var n = e.vendorId,
            t = e.productId,
            o = e.channelId,
            c = {
                connectName: currentPort = o,
                messageId: r
            };
        if (checkDevice(n, t, c)) {
            try {
                hidConnection = new hid.HID(n, t), console.log("connected: ", currentPort), checkDisconnect()
            } catch (e) {
                "linux" === process.platform ? enableHIDInLinux(function(e) {
                    null === e ? process.send({
                        method: "error",
                        code: 500,
                        error: "Please restart your computer to enable 2.4G device.",
                        connectName: currentPort
                    }) : process.send({
                        method: "error",
                        code: 500,
                        error: e.message,
                        connectName: currentPort
                    })
                }) : process.send(_objectSpread({
                    method: "error",
                    code: 500,
                    error: e.message || "Cannot connect to the 2.4G device. Please check your USB connection or use another USB port."
                }, c))
            }
            if (!hidConnection) return process.send(_objectSpread({
                method: "error",
                code: 404,
                error: "Cannot find 2.4G dongle"
            }, c));
            hidConnection.on("error", function(e) {
                process.send({
                    method: "close",
                    connectName: currentPort,
                    error: e.message
                })
            }), hidConnection.on("data", function(e) {
                0 !== e[0] && process.send({
                    method: "data",
                    data: e,
                    connectName: currentPort
                }), checkDisconnect()
            }), process.send({
                method: "open",
                connectName: currentPort,
                messageId: r
            })
        } else process.send(_objectSpread({
            method: "error",
            error: "Cannot find 2.4G dongle",
            code: 404
        }, c))
    },
    writeData = function(e) {
        for (var r = new Buffer(e), n = [0, r.length], t = 0; t < r.length; t++) n.push(r[t]);
        try {
            hidConnection.write(n)
        } catch (e) {
            process.send({
                method: "close",
                connectName: currentPort,
                error: e.message
            }), console.log(e), process.exit(0)
        }
    };
process.on("message", function(r) {
    var n, t, o, c;
    return _regenerator.default.async(function(e) {
        for (;;) switch (e.prev = e.next) {
            case 0:
                n = r.cmd, t = r.options, o = r.data, c = r.messageId, e.t0 = n, e.next = "open" === e.t0 ? 4 : "write" === e.t0 ? 6 : "parse" === e.t0 ? 8 : "resume" === e.t0 ? 10 : 12;
                break;
            case 4:
                return connect(t, c), e.abrupt("break", 13);
            case 6:
                return writeData(o), e.abrupt("break", 13);
            case 8:
                return hidConnection.pause(), e.abrupt("break", 13);
            case 10:
                return hidConnection.resume(), e.abrupt("break", 13);
            case 12:
                return e.abrupt("return");
            case 13:
            case "end":
                return e.stop()
        }
    })
}), process.on("SIGTERM", function() {
    logger.debug("Got HID SIGKILL. exit." + currentPort), process.exit(0)
});
