"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    NodeHid = require("node-hid"),
    child_process = require("child_process"),
    channel = require("../../channel"),
    logger = require("../../logger"),
    hidChildProcess = __dirname + "/hidChildProcess.js",
    MessageChannel = function() {
        function e() {
            (0, _classCallCheck2.default)(this, e), this.init()
        }
        return (0, _createClass2.default)(e, [{
            key: "init",
            value: function() {
                this.messageChannelHandleMap = {}, this.messageChannelHandleTimeOutMap = {}, this._GC()
            }
        }, {
            key: "pop",
            value: function(e) {
                var n = null;
                return this.messageChannelHandleMap[e] && (n = this.messageChannelHandleMap[e]), delete this.messageChannelHandleMap[e], delete this.messageChannelHandleTimeOutMap[e], n
            }
        }, {
            key: "push",
            value: function(e, n) {
                this.messageChannelHandleMap[e] = n, this.messageChannelHandleTimeOutMap[e] = (new Date).getTime()
            }
        }, {
            key: "_GC",
            value: function() {
                var s = this;
                setInterval(function() {
                    if (!(Object.keys(s.messageChannelHandleMap).length < 512)) {
                        var e = (new Date).getTime();
                        for (var n in s.messageChannelHandleTimeOutMap) 3e5 <= e - s.messageChannelHandleTimeOutMap[n] && (delete s.messageChannelHandleTimeOutMap[n], delete s.messageChannelHandleMap[n])
                    }
                }, 3e3)
            }
        }]), e
    }(),
    msgChannel = new MessageChannel,
    Hid = function() {
        function e() {
            (0, _classCallCheck2.default)(this, e), this.hidOption = {
                channelId: "",
                vendorId: 0,
                productId: 0
            }, this.processChannelHandleMap = {}, this.response = null
        }
        return (0, _createClass2.default)(e, [{
            key: "executeCmd",
            value: function(e, n) {
                var s = e.getOptions();
                switch (s.hasOwnProperty("vendorId") && s.hasOwnProperty("productId") && (this.hidOption = {
                    channelId: "".concat(s.vendorId, "_").concat(s.productId),
                    vendorId: s.vendorId,
                    productId: s.productId
                }), msgChannel.push(n.messageId, n), this.response = n, e.Body.cmd) {
                    case "getDevices":
                        return this.doGetDevices(e, n);
                    case "open":
                        return this.fork(e, n);
                    case "close":
                        return this.doClose(e, n);
                    case "write":
                        return this.doWrite(e, n);
                    default:
                        return msgChannel.pop(n.messageId)
                }
            }
        }, {
            key: "doGetDevices",
            value: function(e, n) {
                var s = NodeHid.devices();
                logger.debug("> ".concat(n.io.id, ": -> [getDevices]"), s), n.reply(null, s)
            }
        }, {
            key: "doClose",
            value: function(e, n) {
                return n.reply(null, this.hidOption.channelId), logger.debug("> ".concat(n.io.id, ": -> [close]")), this.kill()
            }
        }, {
            key: "doWrite",
            value: function(e, n) {
                var s = this.processChannelHandleMap[this.hidOption.channelId];
                if (!s) return logger.debug("> ".concat(n.io.id, ": -> [doWrite], err: disconnect.")), n.reply("disconnect");
                var t = e.getParams();
                this.processSendSomething(s, {
                    cmd: "write",
                    data: t.data,
                    encode: t.encode,
                    messageId: n.messageId
                }), logger.debug("> ".concat(this.response.io.id, ": -> [Write]"), new Buffer(t.data)), n.reply(null)
            }
        }, {
            key: "open",
            value: function(e, n) {
                var s = msgChannel.pop(n);
                s ? s.reply(e) : logger.debug("message[".concat(n, "]: hid open missing."))
            }
        }, {
            key: "kill",
            value: function() {
                logger.debug("prepare kill hid process");
                var e = this.processChannelHandleMap[this.hidOption.channelId];
                e && !e.killed && e.kill("SIGTERM")
            }
        }, {
            key: "fork",
            value: function(e, n) {
                var s = this,
                    t = this.processChannelHandleMap[this.hidOption.channelId];
                if (t) return channel.withPlatformsConnect(n.io.id, this.getHidTarget(), t), n.reply(null);
                t = child_process.fork(hidChildProcess), this.processChannelHandleMap[this.hidOption.channelId] = t, channel.withPlatformsConnect(n.io.id, this.getHidTarget(), t), this.processSendSomething(t, {
                    cmd: "open",
                    options: this.hidOption,
                    messageId: n.messageId
                }), t.on("message", function(e) {
                    switch (e.method) {
                        case "disconnect":
                        case "close":
                            return s.response.push(s.getHidTarget(e.connectName), e.method, e.connectName, e.data, "onReceive", "hid"), s.kill();
                        case "error":
                            return s.response.push(s.getHidTarget(e.connectName), e.error, e.connectName, e.data, "onReceive", "hid"), s.kill();
                        case "data":
                            return logger.debug("> ".concat(s.response.io.id, ": <- [Read]"), new Buffer(e.data)), s.response.push(s.getHidTarget(e.connectName), null, e.connectName, e.data, "onReceive", "hid");
                        case "open":
                            return s.open(null, e.messageId)
                    }
                }), t.on("disconnect", function(e) {
                    logger.debug("process disconnect.", e), s.process_GC()
                }), t.on("close", function(e) {
                    logger.debug("process close.", e), s.process_GC()
                })
            }
        }, {
            key: "processSendSomething",
            value: function(e, n) {
                try {
                    e.send(n)
                } catch (e) {
                    logger.debug("process send error", n)
                }
            }
        }, {
            key: "process_GC",
            value: function() {
                for (var n in this.processChannelHandleMap) try {
                    this.processChannelHandleMap[n].killed && (this.response.push(this.getHidTarget(n), "disconnect", n), delete this.processChannelHandleMap[n], channel.untiePlatformsConnect(this.getHidTarget(n)))
                } catch (e) {
                    logger.debug("process[".concat(n, "] is not exist."))
                }
            }
        }, {
            key: "getHidTarget",
            value: function(e) {
                var n = 0 < arguments.length && void 0 !== e ? e : "";
                return "" === n ? "hid:" + this.hidOption.channelId : "hid:" + n
            }
        }]), e
    }();
module.exports = new Hid;
