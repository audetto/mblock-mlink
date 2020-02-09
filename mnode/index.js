"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof")),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    logger = require("../logger"),
    ip = require("./ip"),
    wlan = require("../platforms/wlanScan"),
    os = require("os"),
    path = require("path"),
    fs = require("fs"),
    LocalServer = require("./localserver"),
    _require = require("../constant"),
    ROUTER = _require.ROUTER,
    _require2 = require("../util"),
    openDir = _require2.openDir,
    _require3 = require("./wifi"),
    connectSsid = _require3.connectSsid,
    _require4 = require("./file"),
    saveToFile = _require4.saveToFile,
    readFile = _require4.readFile,
    writeTextToFile = _require4.writeTextToFile,
    appendTextToFile = _require4.appendTextToFile,
    readTextFromFile = _require4.readTextFromFile,
    readDir = _require4.readDir,
    Mnode = function() {
        function Mnode(e) {
            (0, _classCallCheck2.default)(this, Mnode), this.client = e
        }
        return (0, _createClass2.default)(Mnode, [{
            key: "execute",
            value: function(e, r) {
                switch (this.cmdId = e, logger.debug(e), e) {
                    case "ipConfig":
                        return this.getIpConfig();
                    case "currentWifi":
                        return this.getCurrentWifi();
                    case "wifiList":
                        return this.getWifiList();
                    case "connectSsid":
                        return connectSsid(r.password, r.ssid);
                    case "openServerRootDir":
                        return this.openServerRootDir();
                    case "openServerInBrowser":
                        return this.openServerInBrowser();
                    case "openResourceDir":
                        return this.openResourceDir();
                    case "saveToFile":
                        saveToFile(r.data, r.name, r.type, r.path);
                        break;
                    case "readFile":
                        return readFile(r.path);
                    case "writeTextToFile":
                        writeTextToFile(r.data, r.name, r.type, r.path);
                        break;
                    case "appendTextToFile":
                        appendTextToFile(r.data, r.path);
                        break;
                    case "readTextFromFile":
                        return readTextFromFile(r.path);
                    case "readDir":
                        return readDir(r.path, r.fileType);
                    case "openDir":
                        if (r.path) return openDir(r.path);
                        break;
                    case "os":
                    case "fs":
                    case "path":
                        return this.execNodeCmd(e, r);
                    default:
                        return logger.error(e, "is not support"), "not support"
                }
            }
        }, {
            key: "getIpConfig",
            value: function() {
                var e = ip.getNetInterface();
                return e.broadcastAddr = ip.getBroadcastAddress(), logger.debug(e), e
            }
        }, {
            key: "getCurrentWifi",
            value: function() {
                var r;
                return _regenerator.default.async(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            return e.next = 2, _regenerator.default.awrap(wlan.getCurrent());
                        case 2:
                            return r = e.sent, logger.debug("wlan", r), e.abrupt("return", r);
                        case 5:
                        case "end":
                            return e.stop()
                    }
                })
            }
        }, {
            key: "getWifiList",
            value: function() {
                var r;
                return _regenerator.default.async(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            return e.next = 2, _regenerator.default.awrap(wlan.getWifiList());
                        case 2:
                            return r = e.sent, logger.debug("wifilist", r), e.abrupt("return", r);
                        case 5:
                        case "end":
                            return e.stop()
                    }
                })
            }
        }, {
            key: "startLocalServer",
            value: function(e) {
                return Mnode.startServer(e.port)
            }
        }, {
            key: "openServerInBrowser",
            value: function() {
                (new LocalServer).openInBrowser()
            }
        }, {
            key: "openServerRootDir",
            value: function() {
                LocalServer.openRootDir()
            }
        }, {
            key: "openResourceDir",
            value: function() {
                openDir(ROUTER.RESOURCE_PATH)
            }
        }, {
            key: "execNodeCmd",
            value: function execNodeCmd(cmdId, params) {
                var result = "";
                try {
                    var cmd = eval(cmdId),
                        methods = null,
                        _iteratorNormalCompletion = !0,
                        _didIteratorError = !1,
                        _iteratorError = void 0;
                    try {
                        for (var _iterator = params.methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0) {
                            var _item = _step.value;
                            methods = cmd[_item], cmd = methods
                        }
                    } catch (e) {
                        _didIteratorError = !0, _iteratorError = e
                    } finally {
                        try {
                            _iteratorNormalCompletion || null == _iterator.return || _iterator.return()
                        } finally {
                            if (_didIteratorError) throw _iteratorError
                        }
                    }
                    var args = "";
                    if (params.args) {
                        var _iteratorNormalCompletion2 = !0,
                            _didIteratorError2 = !1,
                            _iteratorError2 = void 0;
                        try {
                            for (var _iterator2 = params.args[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = !0) {
                                var item = _step2.value;
                                if ("string" != typeof item) throw "param only support string, '".concat(item.toString(), "' is ").concat((0, _typeof2.default)(item))
                            }
                        } catch (e) {
                            _didIteratorError2 = !0, _iteratorError2 = e
                        } finally {
                            try {
                                _iteratorNormalCompletion2 || null == _iterator2.return || _iterator2.return()
                            } finally {
                                if (_didIteratorError2) throw _iteratorError2
                            }
                        }
                        args = params.args.toString()
                    }
                    result = "function" == typeof cmd ? cmd(args) : cmd
                } catch (e) {
                    logger.error(e)
                }
                return logger.info(result), result
            }
        }], [{
            key: "startServer",
            value: function(e) {
                return new LocalServer(e = e || "").start()
            }
        }]), Mnode
    }();
module.exports = Mnode;
