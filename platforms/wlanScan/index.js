"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    Wifi = require("./wifi"),
    logger = require("../../logger"),
    wifiLib = require("node-wifi"),
    WlanScan = function() {
        function e() {
            (0, _classCallCheck2.default)(this, e)
        }
        return (0, _createClass2.default)(e, [{
            key: "getCurrent",
            value: function() {
                return wifiLib.init({
                    iface: null
                }), new Promise(function(t, i) {
                    wifiLib.getCurrentConnections(function(e, r) {
                        e && (logger.error(e), i(e));
                        var n = r && r[0];
                        t(n)
                    })
                })
            }
        }, {
            key: "getWifiList",
            value: function() {
                var r = this;
                return new Promise(function(i) {
                    var a;
                    return _regenerator.default.async(function(e) {
                        for (;;) switch (e.prev = e.next) {
                            case 0:
                                return Wifi.init({
                                    iface: null
                                }), e.next = 3, _regenerator.default.awrap(r.getCurrent());
                            case 3:
                                a = e.sent, Wifi.scan(function(e, r) {
                                    var n = {},
                                        t = [];
                                    r instanceof Array && r.forEach(function(e) {
                                        e && a && !n[e.ssid] && (e.ssid === a.ssid && (e.isConnected = !0, logger.debug("find you!", e.ssid)), t.push(e)), n[e.ssid] = e
                                    }), i(t)
                                });
                            case 5:
                            case "end":
                                return e.stop()
                        }
                    })
                })
            }
        }, {
            key: "executeCmd",
            value: function(r, n) {
                var t;
                return _regenerator.default.async(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            return e.next = 2, _regenerator.default.awrap(this.getWifiList(r, n));
                        case 2:
                            return t = e.sent, e.abrupt("return", n.reply(null, t));
                        case 4:
                        case "end":
                            return e.stop()
                    }
                }, null, this)
            }
        }]), e
    }();
module.exports = new WlanScan;
