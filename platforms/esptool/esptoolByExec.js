"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),
    _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")),
    child_process = require("child_process"),
    path = require("path"),
    os = require("os"),
    fs = require("fs"),
    Buffer = require("buffer").Buffer,
    logger = require("../../logger"),
    helper = require("../../util"),
    TEMP_PATH = os.tmpdir(),
    EXEC_PATH = path.resolve(__dirname, "esptool"),
    FIRMWARE_PATH = path.resolve(TEMP_PATH, "firmware.bin"),
    EsptoolByExec = function() {
        function e() {
            (0, _classCallCheck2.default)(this, e), this.percent = 0
        }
        return (0, _createClass2.default)(e, [{
            key: "executeCmd",
            value: function(r, t) {
                var o, s;
                return _regenerator.default.async(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            return logger.debug("调试已进入 codey flash 模式"), o = null, s = {}, e.prev = 2, e.next = 5, _regenerator.default.awrap(this.flash(r.getParams(), t));
                        case 5:
                            s = e.sent, e.next = 11;
                            break;
                        case 8:
                            e.prev = 8, e.t0 = e.catch(2), o = e.t0;
                        case 11:
                            t.reply(o, s);
                        case 12:
                        case "end":
                            return e.stop()
                    }
                }, null, this, [
                    [2, 8]
                ])
            }
        }, {
            key: "_firmwareBinFile",
            value: function(e) {
                try {
                    helper.existsSync(TEMP_PATH) || fs.mkdirSync(TEMP_PATH), helper.existsSync(FIRMWARE_PATH) && fs.unlinkSync(FIRMWARE_PATH), fs.appendFileSync(FIRMWARE_PATH, new Buffer(e))
                } catch (e) {
                    return !1
                }
                return !0
            }
        }, {
            key: "flash",
            value: function(i, n) {
                var l = this;
                return n.io.on("esptoolByExec.cancel", this.doKillEsptoolByExec), new Promise(function(o, t) {
                    if (l.percent = 0, !(i = i || {}).hasOwnProperty("options")) throw new Error("Missing 'options'.");
                    if (!l._firmwareBinFile(i.options.data)) return t({
                        status: -4,
                        err: "Codey Firmware Write Temp Dir Failed."
                    });
                    var e = i.options.port.options.port || "",
                        r = i.options.buadRate || "115200",
                        s = i.options.startIndex || "0x1000";
                    logger.debug("传递过来的参数: ", i.options.port.options.port, i.options.buadRate);
                    var a = child_process.spawn(EXEC_PATH, ["--port", e, "-b", r, "write_flash", s, FIRMWARE_PATH]);
                    a.stdout.on("data", function(e) {
                        var r = Buffer.from(e).toString();
                        if (logger.debug(r), -1 !== r.indexOf("Writing at 0x")) {
                            var t = r.match(/\((.*?)%\)/g);
                            l.percent = parseInt(t[0].replace("(", "").replace(")", "").replace(" %", "")), n.io.emit("esptoolByExec.progress", {
                                percent: l.percent,
                                msg: r
                            }), "100" === l.percent && o(100)
                        }
                    }), a.stderr.on("data", function(e) {
                        var r = Buffer.from(e).toString();
                        logger.debug("codey flash stderr: ", r), t({
                            status: -1,
                            err: "codey flash Failed."
                        })
                    }), a.on("exit", function(e, r) {
                        logger.debug("codey flash exited: ", e, r), 4294967295 === e && (logger.debug("串口已断开连接"), n.io.emit("esptoolByExec.portDisconnect")), 1 === e && t({
                            status: -2,
                            err: "codey flash canceled."
                        }), 100 !== l.percent && t({
                            status: -3,
                            err: "codey flash Failed."
                        }), o({})
                    })
                })
            }
        }, {
            key: "doKillEsptoolByExec",
            value: function() {
                child_process.exec("TASKKILL /F /IM esptool.exe")
            }
        }]), e
    }();
module.exports = new EsptoolByExec;
