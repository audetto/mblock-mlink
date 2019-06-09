"use strict";

function _classCallCheck(n, e) {
    if (!(n instanceof e)) throw new TypeError("Cannot call a class as a function");
}

function _defineProperties(n, e) {
    for (var a = 0; a < e.length; a++) {
        var t = e[a];
        t.enumerable = t.enumerable || !1, t.configurable = !0, "value" in t && (t.writable = !0),
        Object.defineProperty(n, t.key, t);
    }
}

function _createClass(n, e, a) {
    return e && _defineProperties(n.prototype, e), a && _defineProperties(n, a), n;
}

var Channel = function() {
    function n() {
        _classCallCheck(this, n), this.channelHandleMap = {}, this.channelPlatformsConnectHandleMap = {};
    }
    return _createClass(n, [ {
        key: "push",
        value: function(n) {
            this.channelHandleMap[n.id] = n, this.channelPlatformsConnectHandleMap[n.id] = {};
        }
    }, {
        key: "pop",
        value: function(n) {
            delete this.channelHandleMap[n.id], delete this.channelPlatformsConnectHandleMap[n.id];
        }
    }, {
        key: "withPlatformsConnect",
        value: function(n, e, a) {
            this.channelPlatformsConnectHandleMap[n] && (this.channelPlatformsConnectHandleMap[n][e] = a);
        }
    }, {
        key: "untiePlatformsConnect",
        value: function(n, e) {
            this.channelPlatformsConnectHandleMap[n] && delete this.channelPlatformsConnectHandleMap[n][e];
        }
    }, {
        key: "getChannelByConnectIdDo",
        value: function(n, e) {
            for (var a in this.channelPlatformsConnectHandleMap) this.channelPlatformsConnectHandleMap[a][n] && e(this.channelHandleMap[a]);
        }
    }, {
        key: "platformsGC",
        value: function(n) {
            try {
                var e = this.channelPlatformsConnectHandleMap[n.id];
                this.pop(n);
                var a = {};
                for (var t in this.channelPlatformsConnectHandleMap) for (var l in this.channelPlatformsConnectHandleMap[t]) a[l] = this.channelPlatformsConnectHandleMap[t][l];
                for (var o in e) a[o] || e[o].kill("SIGTERM");
            } catch (n) {
                console.log("platformsGC", n);
            }
        }
    } ]), n;
}();

module.exports = new Channel();
