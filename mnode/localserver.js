"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    open = require("open"),
    util = require("../util"),
    logger = require("../logger"),
    httpServer = require("http-server"),
    _require = require("./ip"),
    getNetInterface = _require.getNetInterface,
    _require2 = require("../constant"),
    ROUTER = _require2.ROUTER,
    LocalServer = function() {
        function r(e) {
            (0, _classCallCheck2.default)(this, r), this.host = getNetInterface().address, this.port = e || 34433, this.serverPath = ROUTER.LOCAL_SERVER_PATH, this.createDir()
        }
        return (0, _createClass2.default)(r, [{
            key: "createDir",
            value: function() {
                util.mkdirsSync(this.serverPath)
            }
        }, {
            key: "deleteDir",
            value: function() {}
        }, {
            key: "start",
            value: function() {
                var e = "http://".concat(this.host, ":").concat(this.port);
                if (!this.server) {
                    try {
                        this.server = httpServer.createServer({
                            root: this.serverPath
                        }), this.server.listen(this.port, this.host), logger.debug("the server folder is ".concat(this.serverPath)), logger.debug("start server on: ".concat(e))
                    } catch (e) {
                        logger.error(e)
                    }
                    return e
                }
                logger.debug("server already start")
            }
        }, {
            key: "close",
            value: function() {
                this.server && (this.server.close(), logger.debug("close server"))
            }
        }, {
            key: "openInBrowser",
            value: function() {
                var r;
                return _regenerator.default.async(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            r = "http://".concat(this.host, ":").concat(this.port), open(r);
                        case 2:
                        case "end":
                            return e.stop()
                    }
                }, null, this)
            }
        }], [{
            key: "openRootDir",
            value: function() {
                var e = ROUTER.LOCAL_SERVER_PATH;
                logger.info("open server root path", e), open(e)
            }
        }]), r
    }();
module.exports = LocalServer;
