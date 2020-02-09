"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    Wifi = require("./wifi"),
    logger = require("../../logger"),
    WlanScan = function() {
        function e() {
            (0, _classCallCheck2.default)(this, e);
        }
        return (0, _createClass2.default)(e, [{
            key: "executeCmd",
            value: function(e, l) {
                Wifi.init({
                    iface: null
                }), logger.debug("> ".concat(l.io.id, ": -> [wlan init]")), Wifi.scan(function(e, i) {
                    var r = {},
                        a = [];
                    return logger.debug("> ".concat(l.io.id, ": -> [wlan scan]"), e), i instanceof Array && i.forEach(function(e, i) {
                        r[e.ssid] || a.push(e), r[e.ssid] = e;
                    }), l.reply(e, a);
                });
            }
        }]), e;
    }();

module.exports = new WlanScan();
