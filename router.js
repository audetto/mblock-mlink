"use strict";

function _classCallCheck(e, r) {
    if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
}

function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
        var n = r[t];
        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0),
        Object.defineProperty(e, n.key, n);
    }
}

function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), e;
}

var SerialPort = require("./platforms/serialport/serialport"), Request = require("./request"), Response = require("./response"), Router = function() {
    function r(e) {
        _classCallCheck(this, r), this.IO = e;
    }
    return _createClass(r, [ {
        key: "reflect",
        value: function(e) {
            switch (e) {
              case "serialport":
                return SerialPort;

              default:
                throw new Error("unknown 'connectType'.");
            }
        }
    }, {
        key: "dispatch",
        value: function(e, r) {
            var t = new Response(this.IO, e);
            try {
                var n = new Request(r);
                t.messageBody.connectType = n.Body.connectType, t.messageBody.method = n.Body.cmd,
                n.getOptions().hasOwnProperty("port") && (t.messageBody.connectName = n.getOptions().port),
                this.reflect(n.Body.connectType).executeCmd(n, t);
            } catch (e) {
                var o = e.hasOwnProperty("message") ? e.message : "service error.";
                t.reply(o, "");
            }
        }
    } ]), r;
}();

module.exports = Router;
