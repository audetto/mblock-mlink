"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    channel = require("../../channel"),
    logger = require("../../logger"),
    _require = require("../../constant"),
    ROUTER = _require.ROUTER,
    child_process = require("child_process"),
    BleChildProcess = __dirname + "/bleChildProcess.js",
    MessageChannel = function() {
        function e() {
            (0, _classCallCheck2.default)(this, e), this.init(), this.childProcessInitCount = 0
        }
        return (0, _createClass2.default)(e, [{
            key: "init",
            value: function() {
                this.messageChannelHandleMap = {}, this.messageChannelHandleTimeOutMap = {}, this._GC()
            }
        }, {
            key: "pop",
            value: function(e) {
                var t = null;
                return this.messageChannelHandleMap[e] && (t = this.messageChannelHandleMap[e]), delete this.messageChannelHandleMap[e], delete this.messageChannelHandleTimeOutMap[e], t
            }
        }, {
            key: "push",
            value: function(e, t) {
                this.messageChannelHandleMap[e] = t, this.messageChannelHandleTimeOutMap[e] = (new Date).getTime()
            }
        }, {
            key: "clear",
            value: function(e) {
                this.messageChannelHandleMap[e] && (this.messageChannelHandleMap[e] = []), this.messageChannelHandleTimeOutMap[e] && (this.messageChannelHandleTimeOutMap[e] = [])
            }
        }, {
            key: "_GC",
            value: function() {
                var n = this;
                setInterval(function() {
                    if (!(Object.keys(n.messageChannelHandleMap).length < 512)) {
                        var e = (new Date).getTime();
                        for (var t in n.messageChannelHandleTimeOutMap) 3e5 <= e - n.messageChannelHandleTimeOutMap[t] && (delete n.messageChannelHandleTimeOutMap[t], delete n.messageChannelHandleMap[t])
                    }
                }, 3e3)
            }
        }]), e
    }(),
    msgChannel = new MessageChannel,
    Ble = function() {
        function e() {
            (0, _classCallCheck2.default)(this, e), this.bleOption = {}, this.response = null, this.listenEvents = {}, this.pf = null
        }
        return (0, _createClass2.default)(e, [{
            key: "executeCmd",
            value: function(e, t) {
                var n = e.getOptions();
                switch (this.bleParams = e.getParams(), n.hasOwnProperty("port") && (this.bleOption.port = n.port), msgChannel.push(t.messageId, t), this.response = t, (this.request = e).Body.cmd) {
                    case "getDevices":
                        return this.doGetDevices(t);
                    case "open":
                        return this.doOpen(e, t);
                    case "close":
                        return this.doClose(e, t);
                    case "write":
                        return this.doWrite(e, t);
                    default:
                        return msgChannel.pop(t.messageId)
                }
            }
        }, {
            key: "doGetDevices",
            value: function(s) {
                this.getPF().send({
                    cmd: "getDevices",
                    tag: "ble"
                });
                var a = (new Date).getTime(),
                    r = setInterval(function() {
                        var e = msgChannel.pop(s.messageId);
                        if (e) {
                            clearInterval(r);
                            var t = [];
                            if (e.hasOwnProperty("data"))
                                for (var n in e.data) t.push(e.data[n]);
                            return s.reply(null, t)
                        }
                        if (6e3 < (new Date).getTime() - a) return clearInterval(r), s.reply(null, [])
                    }, 300)
            }
        }, {
            key: "doClose",
            value: function(e, t) {
                var n = e.getOptions(),
                    s = n.port,
                    a = t.io.id;
                this.listenEvents[s] && this.listenEvents[s][a] && (delete this.listenEvents[s][a], logger.debug("> ".concat(t.io.id, ": -> [close]")), this.processSendSomething(this.pf, {
                    cmd: "close",
                    port: n.port
                }), t.reply(null, {}))
            }
        }, {
            key: "doWrite",
            value: function(e, t) {
                if (!this.pf) return logger.debug("> ".concat(t.io.id, ": -> [doWrite], err: disconnect.")), t.reply("disconnect");
                var n = e.getOptions(),
                    s = e.getParams();
                this.processSendSomething(this.pf, {
                    cmd: "write",
                    data: s.data,
                    port: n.port,
                    encode: "utf-8"
                }), logger.debug("> ".concat(t.io.id, ": -> [Write]"), new Buffer(s.data)), t.reply(null)
            }
        }, {
            key: "doOpen",
            value: function(e, t) {
                var n = this,
                    s = e.getOptions(),
                    a = t.io.id,
                    r = s.port,
                    i = ROUTER.CONNECT_TYPE.BLE;
                this.listenEvents[r] || (this.listenEvents[r] = {}), this.listenEvents[r][a] = function(e) {
                    try {
                        switch (e.method) {
                            case "disconnect":
                                return t.push(n.getBleTarget(e.connectName), "disconnect", e.connectName, {}, "onReceive", i);
                            case "reportBleType":
                                return t.push(n.getBleTarget(e.connectName), "reportBleType", e.connectName, {
                                    type: e.type
                                }, "onReceive", i);
                            case "close":
                                return t.push(n.getBleTarget(e.connectName), "close", e.connectName, {}, "onReceive", i);
                            case "error":
                                return t.push(n.getBleTarget(e.connectName), e.error, e.connectName, {}, "onReceive", i);
                            case "data":
                                return t.push(n.getBleTarget(e.connectName), null, e.connectName, e.data, "onReceive", i)
                        }
                    } catch (e) {
                        logger.debug("eventCallbak catch:", e)
                    }
                }, channel.withPlatformsConnect(a, this.getBleTarget(), this.pf), this.processSendSomething(this.pf, {
                    cmd: "open",
                    options: {
                        writeProperty: s.writeProperty,
                        notifyProperty: s.notifyProperty,
                        serviceUUID: s.serviceUUID
                    },
                    port: r,
                    timeout: 6e3
                }), msgChannel.clear(t.messageId);
                var l = (new Date).getTime(),
                    o = setInterval(function() {
                        var e = msgChannel.pop(t.messageId);
                        if (logger.debug("get open data", e), 6e3 < (new Date).getTime() - l && (clearInterval(o), n.kill(), t.reply("timeout", {})), e) {
                            if (clearInterval(o), e.error) return n.kill();
                            t.reply(e.error, e)
                        } else t.reply(null, {})
                    }, 300)
            }
        }, {
            key: "getPF",
            value: function() {
                var i = this,
                    e = this.response;
                return this.pf && !this.pf.killed && null === this.pf.exitCode || (this.pf = child_process.fork(BleChildProcess), logger.debug("-----childProcess-----"), channel.withPlatformsConnect(e.io.id, this.getBleTarget(), this.pf), this.pf.on("message", function(r) {
                    logger.debug("---- get message from childprocess ----", r.method);
                    switch (r.method) {
                        case "getDevices":
                        case "open":
                            return msgChannel.push(i.response.messageId, r);
                        case "disconnect":
                        case "reportBleType":
                        case "close":
                        case "error":
                        case "data":
                            return void

                            function() {
                                if (logger.debug("listenEvents", i.listenEvents), logger.debug("> on('".concat(r.method, "')"), r.data ? new Buffer(r.data) : r), !r.hasOwnProperty("connectName"))
                                    for (var e in i.listenEvents) {
                                        var t = i.listenEvents[e];
                                        for (var n in "disconnect" !== r.method && "close" !== r.method && "error" !== r.method || delete i.listenEvents[e], t) t[n](r)
                                    }
                                if (i.listenEvents[r.connectName]) {
                                    var s = i.listenEvents[r.connectName];
                                    for (var a in "disconnect" !== r.method && "close" !== r.method && "error" !== r.method || delete i.listenEvents[r.connectName], s) s[a](r)
                                }
                            }()
                    }
                }), this.pf.on("exit", function() {
                    logger.error("bluetooth driver not supported, need zadig"), e.io.emit("bluetooth", {
                        message: "driverNotSupported"
                    })
                })), this.pf
            }
        }, {
            key: "kill",
            value: function() {
                logger.debug("prepare kill ble process"), this.pf && (this.pf.killed || (this.pf.kill("SIGTERM"), this.pf = null))
            }
        }, {
            key: "processSendSomething",
            value: function(e, t) {
                try {
                    e.send(t)
                } catch (e) {
                    logger.debug("process send error", t)
                }
            }
        }, {
            key: "getBleTarget",
            value: function(e, t) {
                var n = 0 < arguments.length && void 0 !== e ? e : "",
                    s = 1 < arguments.length && void 0 !== t ? t : "";
                return "" === n ? "ble:" + this.bleOption.port + ":" + s : "ble:" + n + ":" + s
            }
        }]), e
    }();
module.exports = new Ble;
