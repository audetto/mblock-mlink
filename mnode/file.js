"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _require = require("../constant"),
    ROUTER = _require.ROUTER,
    _require2 = require("../util"),
    mkdirsSync = _require2.mkdirsSync,
    logger = require("../logger"),
    path = require("path"),
    fs = require("fs"),
    moment = require("moment"),
    save = require("save-file");
logger.debug(moment().format("YYYY-MM-DD-HH-mm-ss")), mkdirsSync(ROUTER.CAPTURE_PATH);
var getPath = function(e) {
        var r = path.resolve(e);
        return mkdirsSync(r), r
    },
    getFile = function(e, r, t) {
        var n = (e = e || moment().format("YYYY-MM-DD-HH-mm-ss")) + "." + r,
            i = path.resolve(ROUTER.CAPTURE_PATH, n);
        return t && (i = path.resolve(getPath(t), n)), i
    },
    writeTextToFile = function(e, r, t, n) {
        var i = getFile(r, t, n);
        try {
            fs.writeFileSync(i, e)
        } catch (e) {
            logger.error(e)
        }
    },
    appendTextToFile = function(e, r) {
        try {
            fs.appendFileSync(r)
        } catch (e) {
            logger.error(e)
        }
    },
    readTextFromFile = function(e) {
        var r = "";
        try {
            r = fs.readFileSync(e, "utf8")
        } catch (e) {
            logger.error(e)
        }
        return r
    },
    readDir = function(e, r) {
        logger.debug(r);
        var t = "";
        try {
            t = fs.readdirSync(e), r && (t = t.filter(function(e) {
                return e.split(".")[e.split(".").length - 1] === r
            }))
        } catch (e) {
            logger.error(e)
        }
        return t
    },
    saveToFile = function(e, r, t, n) {
        var i = getFile(r, t, n);
        save(e, i)
    },
    readFile = function(r) {
        var t;
        return _regenerator.default.async(function(e) {
            for (;;) switch (e.prev = e.next) {
                case 0:
                    if (r) {
                        e.next = 2;
                        break
                    }
                    return e.abrupt("return");
                case 2:
                    return t = function(r) {
                        return _regenerator.default.async(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return logger.debug(r), e.abrupt("return", new Promise(function(t, n) {
                                        fs.readFile(r, function(e, r) {
                                            e && (logger.error(e), n(e)), r = toArrayBuffer(r), t(r)
                                        })
                                    }));
                                case 2:
                                case "end":
                                    return e.stop()
                            }
                        })
                    }, e.next = 5, _regenerator.default.awrap(t(r));
                case 5:
                    return e.abrupt("return", e.sent);
                case 6:
                case "end":
                    return e.stop()
            }
        })
    },
    toArrayBuffer = function(e) {
        for (var r = new ArrayBuffer(e.length), t = new Uint8Array(r), n = 0; n < e.length; ++n) t[n] = e[n];
        return r
    },
    toBuffer = function(e) {
        for (var r = new Buffer(e.byteLength), t = new Uint8Array(e), n = 0; n < r.length; ++n) r[n] = t[n];
        return r
    };
module.exports = {
    toBuffer: toBuffer,
    saveToFile: saveToFile,
    readFile: readFile,
    writeTextToFile: writeTextToFile,
    appendTextToFile: appendTextToFile,
    readTextFromFile: readTextFromFile,
    readDir: readDir
};
