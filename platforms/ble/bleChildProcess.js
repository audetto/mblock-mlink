"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    nobleTool = require("./noble"),
    CommendStack = require("./commendStack"),
    Peripheral = require("./peripheral"),
    logger = require("../../logger"),
    commendStack = new CommendStack,
    bleConnectedList = {},
    BleChildProcess = function() {
        function e() {
            (0, _classCallCheck2.default)(this, e), this.scanningTimeout = 5e3, this.peripheralList = {}, this.peripheralTempList = {}, this.__peripheralList = {}, this.poweredOn = !1, this.scanningAble = !1, this.scanningStartPoint = 0, this.initNoble(!1)
        }
        return (0, _createClass2.default)(e, [{
            key: "initNoble",
            value: function(e) {
                this.noble && (this.stopScan(), this.peripheralList = {}, this.peripheralTempList = {}), this.noble = nobleTool.getNoble(e), this._scanningListener(), this._scanningGC()
            }
        }, {
            key: "getDevices",
            value: function(e) {
                return commendStack.push([this.scanningEnble.bind(this), this]), process.send({
                    method: "getDevices",
                    connectName: e.tag,
                    data: this.peripheralList
                })
            }
        }, {
            key: "open",
            value: function(t) {
                var n, r, s = this;
                return _regenerator.default.async(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            if (this.stopScan(), e.prev = 1, logger.debug("connected List", bleConnectedList), bleConnectedList[t.port]) {
                                e.next = 10;
                                break
                            }
                            return n = new Peripheral(t.port, t.options, this.noble, this.__peripheralList), this.bleConnectedIt = n, r = function() {
                                var e = n.currentPort;
                                logger.debug("BLE disconnected.", e), delete bleConnectedList[e], delete s.peripheralList[e], delete s.peripheralTempList[e], process.send({
                                    method: "disconnect",
                                    connectName: e
                                })
                            }, e.next = 9, _regenerator.default.awrap(n.connect(r.bind(this)));
                        case 9:
                            bleConnectedList[t.port] = n;
                        case 10:
                            process.send({
                                method: "open",
                                connectName: t.port
                            }), e.next = 17;
                            break;
                        case 13:
                            e.prev = 13, e.t0 = e.catch(1), delete bleConnectedList[t.port], process.send({
                                method: "open",
                                error: e.t0,
                                connectName: t.port
                            });
                        case 17:
                        case "end":
                            return e.stop()
                    }
                }, null, this, [
                    [1, 13]
                ])
            }
        }, {
            key: "write",
            value: function(t) {
                var n, r, s;
                return _regenerator.default.async(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            logger.debug("【write data to】", t.port, t.data), this.stopScan(), e.prev = 2, n = t.data;
                        case 4:
                            if (0 < n.length) return e.next = 7, _regenerator.default.awrap(bleConnectedList[t.port].write(n.splice(0, 20), t.encode));
                            e.next = 9;
                            break;
                        case 7:
                            e.next = 4;
                            break;
                        case 9:
                            e.next = 17;
                            break;
                        case 11:
                            e.prev = 11, e.t0 = e.catch(2), r = e.t0.hasOwnProperty("message") ? e.t0.message : "error", logger.debug("ble 4.0 write err", r), s = r.includes("Cannot read property 'write'"), this.bleConnectedIt && s && this.bleConnectedIt.reportWriteIsNull();
                        case 17:
                            return e.abrupt("return");
                        case 18:
                        case "end":
                            return e.stop()
                    }
                }, null, this, [
                    [2, 11]
                ])
            }
        }, {
            key: "close",
            value: function(t) {
                var n;
                return _regenerator.default.async(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            return logger.debug("process receive close."), this.stopScan(), this.peripheralList = {}, this.peripheralTempList = {}, this.bleConnectedIt = null, e.prev = 5, e.next = 8, _regenerator.default.awrap(bleConnectedList[t.port].disconnect());
                        case 8:
                            process.send({
                                method: "disconnect",
                                connectName: t.port
                            }), e.next = 15;
                            break;
                        case 11:
                            e.prev = 11, e.t0 = e.catch(5), n = e.t0.hasOwnProperty("message") ? e.t0.message : "error", logger.debug("ble 4.0 close err", n);
                        case 15:
                            return delete bleConnectedList[t.port], e.abrupt("return");
                        case 17:
                        case "end":
                            return e.stop()
                    }
                }, null, this, [
                    [5, 11]
                ])
            }
        }, {
            key: "exit",
            value: function() {
                try {
                    this.stopScan()
                } catch (e) {
                    logger.debug("kill process before stopScanning is fail.")
                }
                logger.debug("[ScanningWorker] Got Bluetooth 4.0 Scanning SIGKILL. exit."), process.exit(0)
            }
        }, {
            key: "scanningEnble",
            value: function(e) {
                try {
                    var t = e || this;
                    if (t.scanningAble || !t.poweredOn) return;
                    logger.debug("done _scanningEnble."), t.scanningStartPoint = (new Date).getTime(), t.peripheralTempList = {}, t.startScan()
                } catch (e) {
                    logger.debug("scanningEnble", e.hasOwnProperty("message") ? e.message : "error")
                }
            }
        }, {
            key: "stopScan",
            value: function() {
                this.noble.stopScanning()
            }
        }, {
            key: "startScan",
            value: function() {
                this.noble.startScanning([], !0)
            }
        }, {
            key: "_scanningListener",
            value: function() {
                var n = this;
                this.noble.on("scanStart", function() {
                    logger.debug("ble 4.0 scanStart."), n.scanningAble = !0
                }), this.noble.on("scanStop", function() {
                    logger.debug("ble 4.0 scanStop."), 0 === Object.keys(n.peripheralTempList).length && (n.peripheralTempList = {}), n.scanningAble = !1
                }), this.noble.on("discover", function(e) {
                    if (e.advertisement.localName) {
                        50 < Object.keys(n.__peripheralList).length && (n.__peripheralList = {});
                        var t = e.advertisement;
                        n.peripheralTempList[e.id] = {
                            localName: t.localName,
                            comName: e.id,
                            id: e.id,
                            txPowerLevel: t.txPowerLevel,
                            rssi: e.rssi
                        }, 0 < Object.keys(n.peripheralTempList).length && (n.peripheralList = n.peripheralTempList), n.__peripheralList[e.id] = e
                    }
                }), this.noble.on("stateChange", function(e) {
                    n.peripheralList = {}, logger.debug("Noble stateChange ", e), "poweredOn" === e ? n.poweredOn = !0 : "unsupported" === e ? (logger.info("change noble-uwp to noble"), n.initNoble(!0), n.startScan()) : (n.scanningAble = !1, n.poweredOn = !1, n.stopScan())
                })
            }
        }, {
            key: "_scanningGC",
            value: function() {
                var e = this;
                setInterval(function() {
                    e.scanningStartPoint && e.scanningTimeout < (new Date).getTime() - e.scanningStartPoint && e.scanningAble && (logger.debug("ble GC stopScanning."), e.stopScan(), setTimeout(function() {
                        e.scanningAble = !1
                    }, 300))
                }, 3e3)
            }
        }]), e
    }(),
    bleChildProcess = new BleChildProcess;
process.on("message", function(t) {
    return _regenerator.default.async(function(e) {
        for (;;) switch (e.prev = e.next) {
            case 0:
                logger.debug("receive from main process", t.cmd), "getDevices" === t.cmd && bleChildProcess.getDevices(t), "open" === t.cmd && bleChildProcess.open(t), "write" === t.cmd && bleChildProcess.write(t), "close" === t.cmd && bleChildProcess.close(t);
            case 5:
            case "end":
                return e.stop()
        }
    })
}), process.on("SIGTERM", function() {
    bleChildProcess.exit()
});
