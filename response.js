"use strict";

function _classCallCheck(e, s) {
    if (!(e instanceof s)) throw new TypeError("Cannot call a class as a function");
}

function _defineProperties(e, s) {
    for (var n = 0; n < s.length; n++) {
        var t = s[n];
        t.enumerable = t.enumerable || !1, t.configurable = !0, "value" in t && (t.writable = !0),
        Object.defineProperty(e, t.key, t);
    }
}

function _createClass(e, s, n) {
    return s && _defineProperties(e.prototype, s), n && _defineProperties(e, n), e;
}

var Channel = require("./channel"), Response = function() {
    function n(e, s) {
        _classCallCheck(this, n), this.messageId = s, this.io = e, this.messageBody = {
            connectType: "",
            method: "",
            error: null,
            connectName: "",
            data: {}
        };
    }
    return _createClass(n, [ {
        key: "reply",
        value: function(e, s) {
            var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
            if (this.messageBody.error = e, this.messageBody.data = n, "" === s || s === this.messageBody.connectName) return this.io.emit("s2c_send", this.messageId, this.messageBody);
            console.log("当前返回的数据并不是该通信口的数据，故直接丢掉。");
        }
    }, {
        key: "push",
        value: function(e, s, n) {
            var t = this, o = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : {};
            if (this.messageBody.method = "onReceive", this.messageBody.error = s, this.messageBody.data = o,
            "" === n || n === this.messageBody.connectName) return Channel.getChannelByConnectIdDo(e, function(e) {
                e.emit("s2c_receive", t.messageBody);
            });
            console.log("当前返回的数据并不是该通信口的数据，故直接丢掉。");
        }
    } ]), n;
}();

module.exports = Response;
