"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(r, e) {
    var o = Object.keys(r);
    if (Object.getOwnPropertySymbols) {
        var t = Object.getOwnPropertySymbols(r);
        e && (t = t.filter(function(e) {
            return Object.getOwnPropertyDescriptor(r, e).enumerable
        })), o.push.apply(o, t)
    }
    return o
}

function _objectSpread(r) {
    for (var e = 1; e < arguments.length; e++) {
        var o = null != arguments[e] ? arguments[e] : {};
        e % 2 ? ownKeys(o, !0).forEach(function(e) {
            (0, _defineProperty2.default)(r, e, o[e])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(o)) : ownKeys(o).forEach(function(e) {
            Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(o, e))
        })
    }
    return r
}
var serialport = require("serialport"),
    logger = require("../../logger"),
    SerialPort = null,
    currentPort = null,
    connect = function(e, r) {
        var o = e.port;
        currentPort = o, delete e.port, (SerialPort = new serialport(o, e)).on("open", function() {
            process.send({
                method: "open",
                messageId: r,
                port: o
            })
        }), SerialPort.on("error", function(e) {
            process.send({
                method: "error",
                error: e,
                connectName: currentPort
            }), logger.debug("[child] serialport open error:", e)
        }), SerialPort.on("data", function(e) {
            process.send({
                method: "data",
                data: e,
                connectName: currentPort
            })
        }), SerialPort.on("close", function() {
            logger.debug("[child] serialport close."), process.send({
                method: "close",
                connectName: currentPort
            })
        }), SerialPort.on("disconnect", function() {
            logger.debug("[child] serialport disconnect."), process.send({
                method: "disconnect",
                connectName: currentPort
            })
        })
    };
process.on("message", function(e) {
    if (logger.debug("[child] 进程 ".concat(process.pid, " 收到的数据:"), e.cmd), "open" === e.cmd) return connect(e.options, e.messageId);
    var r = {
        method: e.cmd,
        messageId: e.messageId,
        connectName: currentPort
    };
    if (null !== SerialPort) {
        if ("set" === e.cmd) return SerialPort.set(e.data);
        if ("drain" === e.cmd) return SerialPort.drain(function(e) {
            process.send(_objectSpread({}, r, {
                error: e
            }))
        });
        if ("flush" === e.cmd) return SerialPort.flush(function(e) {
            process.send(_objectSpread({}, r, {
                error: e
            }))
        });
        if ("write" === e.cmd) {
            var o = new Buffer(e.data);
            logger.debug("-> port write", o), SerialPort.write(o, e.encode), SerialPort.drain(function(e) {
                process.send(_objectSpread({}, r, {
                    error: e
                }))
            })
        }
    } else process.send(_objectSpread({}, r, {
        error: "serialport is disconnect."
    }))
}), process.on("SIGTERM", function() {
    logger.debug("Got Serial SIGKILL. exit.", currentPort), SerialPort = null, process.exit(0)
});
