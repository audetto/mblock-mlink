"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    channel = require("../../channel"),
    logger = require("../../logger"),
    Udp = require("./udp"),
    udpList = {},
    Wifi = function() {
        function e() {
            (0, _classCallCheck2.default)(this, e)
        }
        return (0, _createClass2.default)(e, [{
            key: "executeCmd",
            value: function(e, t) {
                switch (this.response = t, this.request = e, this.params = e.Body.params, logger.debug("wifi command: ", e.Body.cmd), e.Body.cmd) {
                    case "open":
                        return this.connect(e, t);
                    case "close":
                        return this.disconnect(e, t);
                    case "send":
                        return this.send(this.params.data, this.params.hostname, this.params.port);
                    case "onMessage":
                        return this.onMessage(this.params.port, this.params.hostname);
                    case "closeUdp":
                        var s = this._getUdpId(this.params.port, this.params.hostname);
                        return this.closeUdp(s)
                }
            }
        }, {
            key: "connect",
            value: function(e, t) {
                logger.debug("Wi-Fi 通道连接成功！"), this._resetUdpList(), t.reply(null)
            }
        }, {
            key: "disconnect",
            value: function() {
                this.kill()
            }
        }, {
            key: "kill",
            value: function(e) {
                logger.debug("Wi-Fi 通道断开连接！", e || ""), this.unRegisterChannel(), this._resetUdpList()
            }
        }, {
            key: "send",
            value: function(e, t, s) {
                var i = this._createUdpInstance(s, t);
                try {
                    i.send(e)
                } catch (e) {
                    this.pushToMblock(e, i.udpid)
                }
            }
        }, {
            key: "onMessage",
            value: function(e, t) {
                var s = this,
                    i = this._createUdpInstance(e, t, !0);
                i.repeat || i.onMessage(function(e) {
                    logger.info("[received from server]:", e), s.pushToMblock(e, i.udpid)
                })
            }
        }, {
            key: "closeUdp",
            value: function(e) {
                logger.debug(e), udpList[e] && (udpList[e].close(), delete udpList[e], udpList[e] = null)
            }
        }, {
            key: "_createUdpInstance",
            value: function(e, t, s) {
                logger.info(e, t);
                var i = null,
                    n = this._getUdpId(e, t);
                return udpList[n] ? (logger.info("repeated udp connnect", n), (i = udpList[n]).repeat = !0) : (logger.debug("create udp"), i = new Udp(e, t, s), this.registerChannel(this), i.logToMblock = this.pushToMblock.bind(this), udpList[n] = i), i
            }
        }, {
            key: "_resetUdpList",
            value: function() {
                for (var e in logger.debug("清空 udpList"), udpList) this.closeUdp(e);
                udpList = {}
            }
        }, {
            key: "pushToMblock",
            value: function(e, t) {
                var s = t + "|" + e;
                this.response.push(this._getConnectId(), null, this.params.ip, s, "onReceive", "wifi")
            }
        }, {
            key: "registerChannel",
            value: function(e) {
                channel.withPlatformsConnect(this.response.io.id, this._getConnectId(), e)
            }
        }, {
            key: "unRegisterChannel",
            value: function() {
                logger.debug("解绑通道", this._getConnectId()), channel.untiePlatformsConnect(this._getConnectId())
            }
        }, {
            key: "_getConnectId",
            value: function() {
                return "wifi-" + this.params.ip
            }
        }, {
            key: "_getUdpId",
            value: function(e, t) {
                return t + ":" + e
            }
        }]), e
    }(),
    wifi = new Wifi;
module.exports = wifi;
