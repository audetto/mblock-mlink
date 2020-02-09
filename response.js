"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    channel = require("./channel"),
    _require = require("./constant"),
    ROUTER = _require.ROUTER,
    Response = function() {
        function r(e, t) {
            (0, _classCallCheck2.default)(this, r), this.messageId = t, this.io = e, this.messageBody = {
                connectType: "",
                method: "",
                error: null,
                connectName: "",
                data: {}
            };
        }
        return (0, _createClass2.default)(r, [{
            key: "reply",
            value: function(e) {
                var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                return this.io.emit("s2c_send", this.messageId, Object.assign({}, this.messageBody, {
                    error: e,
                    data: t
                }));
            }
        }, {
            key: "push",
            value: function(e, t) {
                var r = this,
                    n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "",
                    s = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : {},
                    a = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : "onReceive",
                    i = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : "";
                return channel.getChannelByConnectIdDo(e, function(e) {
                    e.emit("s2c_receive", Object.assign({}, r.messageBody, {
                        error: t,
                        data: s,
                        method: a,
                        connectType: "" === i ? ROUTER.CONNECT_TYPE.SERIALPORT : i,
                        connectName: n
                    }));
                });
            }
        }]), r;
    }();

module.exports = Response;
