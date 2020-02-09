"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    SerialPort = require("./platforms/serialport/serialport"),
    wifi = require("./platforms/wifi"),
    wlanScan = require("./platforms/wlanScan"),
    esptoolByExec = require("./platforms/esptool/esptoolByExec"),
    Ble = require("./platforms/ble/ble"),
    hid = require("./platforms/hid/hid"),
    Request = require("./request"),
    Response = require("./response"),
    _require = require("./constant"),
    ROUTER = _require.ROUTER,
    logger = require("./logger"),
    Router = function() {
        function e() {
            (0, _classCallCheck2.default)(this, e)
        }
        return (0, _createClass2.default)(e, [{
            key: "reflect",
            value: function(e) {
                switch (logger.debug(e), e) {
                    case ROUTER.CONNECT_TYPE.SERIALPORT:
                        return SerialPort;
                    case ROUTER.CONNECT_TYPE.WLAN_SCAN:
                        return wlanScan;
                    case ROUTER.CONNECT_TYPE.ESPTOOL_BY_EXEC:
                        return esptoolByExec;
                    case ROUTER.CONNECT_TYPE.BLE:
                        return Ble;
                    case ROUTER.CONNECT_TYPE.HID:
                        return hid;
                    case ROUTER.CONNECT_TYPE.WIFI:
                        return wifi;
                    default:
                        throw logger.error("unknown 'connectType'."), new Error("unknown 'connectType'.")
                }
            }
        }, {
            key: "dispatcher",
            value: function(e, r, t, s) {
                var o = new Response(e, r);
                try {
                    var a = new Request(t);
                    o.messageBody.connectType = a.Body.connectType, o.messageBody.method = a.Body.cmd, o.messageBody.mlinkVersion = s, a.getOptions().hasOwnProperty("port") && (o.messageBody.connectName = a.getOptions().port), this.reflect(a.Body.connectType).executeCmd(a, o)
                } catch (e) {
                    var n = e.hasOwnProperty("message") ? e.message : "service error.";
                    o.reply(n)
                }
            }
        }]), e
    }();
module.exports = new Router;
