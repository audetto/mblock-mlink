"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    channel = require("./channel"),
    _require = require("./constant"),
    ROUTER = _require.ROUTER,
    logger = require("./logger"),
    Response = function() {
        function r(e, t) {
            (0, _classCallCheck2.default)(this, r), this.messageId = t, this.io = e, this.messageBody = {
                connectType: "",
                method: "",
                error: null,
                connectName: "",
                data: {}
            }
        }
        return (0, _createClass2.default)(r, [{
            key: "reply",
            value: function(e, t) {
                var r = 1 < arguments.length && void 0 !== t ? t : {};
                return this.io.emit("s2c_send", this.messageId, Object.assign({}, this.messageBody, {
                    error: e,
                    data: r
                }))
            }
        }, {
            key: "push",
            value: function(t, r, e, n, s, a) {
                var i = this,
                    l = 2 < arguments.length && void 0 !== e ? e : "",
                    o = 3 < arguments.length && void 0 !== n ? n : {},
                    c = 4 < arguments.length && void 0 !== s ? s : "onReceive",
                    u = 5 < arguments.length && void 0 !== a ? a : "";
                return channel.getChannelByConnectIdDo(t, function(e) {
                    logger.debug("【".concat(t, "】push to mblock:"), r, "".concat(JSON.stringify(o))), e.emit("s2c_receive", Object.assign({}, i.messageBody, {
                        error: r,
                        data: o,
                        method: c,
                        connectType: "" === u ? ROUTER.CONNECT_TYPE.SERIALPORT : u,
                        connectName: l
                    }))
                })
            }
        }]), r
    }();
module.exports = Response;
