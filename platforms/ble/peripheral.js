"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    logger = require("../../logger"),
    Peripheral = function() {
        function n(e, r, t, i) {
            (0, _classCallCheck2.default)(this, n), this.noble = t, this.currentPort = e, this.options = r, this.writeCharacteristic = null, this.notifyCharacteristic = null, this.currentPeripheral = null, this.peripheralList = i
        }
        return (0, _createClass2.default)(n, [{
            key: "connect",
            value: function(r) {
                var t, i, n = this;
                return _regenerator.default.async(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            return e.next = 2, _regenerator.default.awrap(this.__getperipheral(this.currentPort));
                        case 2:
                            return t = e.sent, this.bleName = t && t.advertisement && t.advertisement.localName, t.once("disconnect", function() {
                                "Makeblock_LE" === n.bleName && r && r()
                            }), this.currentPeripheral = t, e.next = 8, _regenerator.default.awrap(this.__connectReal(t));
                        case 8:
                            return e.next = 10, _regenerator.default.awrap(this.__getCharacteristics(t, this.options));
                        case 10:
                            (i = e.sent) && i.hasOwnProperty("write") && (this.writeCharacteristic = i.write), i && i.hasOwnProperty("notify") && (this.notifyCharacteristic = i.notify, this.notifyCharacteristic.on("data", function(e, r) {
                                logger.debug("bluetooth 4.0 Received: ", r, e), process.send({
                                    method: "data",
                                    data: e,
                                    connectName: n.currentPort
                                })
                            }), this.notifyCharacteristic.subscribe(function(e) {
                                e && logger.debug("Error subscribing to echoCharacteristic")
                            })), null === this.writeCharacteristic && this.reportWriteIsNull();
                        case 14:
                        case "end":
                            return e.stop()
                    }
                }, null, this)
            }
        }, {
            key: "__getperipheral",
            value: function(a) {
                var c = this.peripheralList,
                    e = this.noble;
                return new Promise(function(t, i) {
                    try {
                        e.stopScanning()
                    } catch (e) {
                        logger.debug("Connect before stopScanning is fail.")
                    }
                    var n = (new Date).getTime(),
                        o = setInterval(function() {
                            for (var e in c)
                                if (e === a) {
                                    clearInterval(o);
                                    var r = c[e];
                                    return logger.debug("Connecting to '".concat(e, "' ").concat(r.id)), t(r)
                                }
                            3e3 < (new Date).getTime() - n && (clearInterval(o), i("timeout"))
                        }, 500)
                })
            }
        }, {
            key: "__connectReal",
            value: function(i) {
                var n = this;
                return new Promise(function(r, t) {
                    i.connect(function(e) {
                        return e ? (logger.debug("connecting error", e), t("connect error")) : (logger.debug("Connected to", i.id), r(n.currentPort))
                    })
                })
            }
        }, {
            key: "__getCharacteristics",
            value: function(r, o) {
                return new Promise(function(i, n) {
                    logger.debug("服务匹配。");
                    var e = [o.serviceUUID];
                    r.discoverServices(e, function(e, r) {
                        if (logger.debug("服务callback.", e), e) return n(e);
                        if (0 === r.length) return n("not found service. ");
                        var t = [o.writeProperty, o.notifyProperty];
                        r[0].discoverCharacteristics(t, function(e, r) {
                            if (logger.debug("特征值callback.", e), e) return n(e);
                            var t = {
                                write: null,
                                notify: null
                            };
                            return r.forEach(function(e) {
                                o.writeProperty === e.uuid && (t.write = e, logger.debug("discoverWriteService", e.uuid)), o.notifyProperty === e.uuid && (t.notify = e, logger.debug("discoverNotifyService", e.uuid))
                            }), i(t)
                        })
                    })
                })
            }
        }, {
            key: "write",
            value: function(i, n) {
                var o = this;
                return new Promise(function(r, t) {
                    var e = new Buffer(i, n);
                    logger.debug("write into", o.options), logger.debug("Sending: ", e), o.writeCharacteristic.write(e, !0, function(e) {
                        return e ? t(e) : r()
                    })
                })
            }
        }, {
            key: "disconnect",
            value: function() {
                this.currentPeripheral.disconnect(function(e) {
                    logger.debug("noble disconnect error is", e)
                })
            }
        }, {
            key: "reportWriteIsNull",
            value: function() {
                logger.debug("------ ".concat(this.bleName, " writeCharacteristic is null ------")), "Makeblock_LE" === this.bleName && (process.send({
                    method: "reportBleType",
                    connectName: this.currentPort,
                    type: "dualmode"
                }), this.disconnect())
            }
        }]), n
    }();
module.exports = Peripheral;
