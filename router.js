"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"), _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")), _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")), SerialPort = require("./platforms/serialport/serialport"), wlanScan = require("./platforms/wlanScan"), Request = require("./request"), Response = require("./response"), _require = require("./constant"), ROUTER = _require.ROUTER, Router = function() {
    function r(e) {
        (0, _classCallCheck2.default)(this, r), this.IO = e;
    }
    return (0, _createClass2.default)(r, [ {
        key: "reflect",
        value: function(e) {
            switch (e) {
              case ROUTER.CONNECT_TYPE.SERIALPORT:
                return SerialPort;

              case ROUTER.CONNECT_TYPE.WLAN_SCAN:
                return wlanScan;

              default:
                throw new Error("unknown 'connectType'.");
            }
        }
    }, {
        key: "dispatch",
        value: function(e, r) {
            var t = new Response(this.IO, e);
            try {
                var s = new Request(r);
                t.messageBody.connectType = s.Body.connectType, t.messageBody.method = s.Body.cmd,
                s.getOptions().hasOwnProperty("port") && (t.messageBody.connectName = s.getOptions().port),
                this.reflect(s.Body.connectType).executeCmd(s, t);
            } catch (e) {
                var a = e.hasOwnProperty("message") ? e.message : "service error.";
                t.reply(a, "");
            }
        }
    } ]), r;
}();

module.exports = Router;
