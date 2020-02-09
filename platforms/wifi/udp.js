"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    logger = require("../../logger"),
    util = require("util"),
    dgram = require("dgram"),
    Udp = function() {
        function s(e, t, r) {
            (0, _classCallCheck2.default)(this, s), this.hostname = t, this.port = e, this.udpid = this.hostname + ":" + this.port, this.instance = dgram.createSocket({
                type: "udp4",
                reuseAddr: !0
            }), r && (this.hostname ? this.instance.bind(this.port, this.hostname) : this.instance.bind(this.port)), this.instance.on("error", this._onError.bind(this)), this.instance.on("close", this._onClose.bind(this))
        }
        return (0, _createClass2.default)(s, [{
            key: "_onError",
            value: function(e) {
                this.close();
                var t = "error:\n".concat(e.stack);
                logger.error(t)
            }
        }, {
            key: "_onClose",
            value: function() {
                logger.info("socket(".concat(this.udpid, ") closed : BYE!"))
            }
        }, {
            key: "send",
            value: function(e) {
                var t = (new util.TextDecoder).decode(new Buffer(e));
                logger.debug("【".concat(this.udpid, "】send:"), t), this.instance.send(t, 0, t.length, this.port, this.hostname, function(e, t) {
                    e && logger.error(e)
                })
            }
        }, {
            key: "onMessage",
            value: function(s) {
                this.instance.on("message", function(e, t) {
                    var r = (new util.TextDecoder).decode(e);
                    s && s(r)
                })
            }
        }, {
            key: "close",
            value: function() {
                this.instance.close()
            }
        }]), s
    }();
module.exports = Udp;
