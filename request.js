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

var Request = function() {
    function r(e) {
        _classCallCheck(this, r), this.verifiy(e), this.Body = e;
    }
    return _createClass(r, [ {
        key: "verifiy",
        value: function(e) {
            if (!e.hasOwnProperty("connectType")) throw new Error("Missing 'connectType'.");
            if (!e.hasOwnProperty("cmd")) throw new Error("Missing 'cmd'.");
        }
    }, {
        key: "getParams",
        value: function() {
            return this.Body.hasOwnProperty("params") ? this.Body.params : {};
        }
    }, {
        key: "getOptions",
        value: function() {
            var e = this.getParams();
            return e.hasOwnProperty("options") ? e.options : {};
        }
    } ]), r;
}();

module.exports = Request;
