"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    CommendStack = function() {
        function e() {
            (0, _classCallCheck2.default)(this, e), this.commendStack = [], this.__commendExec()
        }
        return (0, _createClass2.default)(e, [{
            key: "__commendExec",
            value: function() {
                var e, t = this;
                setInterval(function() {
                    256 < t.commendStack.length ? logger.debug("CommendStack length > 256.") : 0 < t.commendStack.length && (e = t.commendStack.shift())[0](e[1])
                }, 300)
            }
        }, {
            key: "push",
            value: function(e) {
                this.commendStack.push(e)
            }
        }]), e
    }();
module.exports = CommendStack;
