"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"), _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")), _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass")), serialport = require("serialport"), child_process = require("child_process"), channel = require("../../channel"), logger = require("../../logger"), SerialPortChildProcess = __dirname + "/serialPortChildProcess.js", MessageChannel = function() {
    function e() {
        (0, _classCallCheck2.default)(this, e), this.init();
    }
    return (0, _createClass2.default)(e, [ {
        key: "init",
        value: function() {
            this.messageChannelHandleMap = {}, this.messageChannelHandleTimeOutMap = {}, this._GC();
        }
    }, {
        key: "pop",
        value: function(e) {
            var r = null;
            return this.messageChannelHandleMap[e] && (r = this.messageChannelHandleMap[e]),
            delete this.messageChannelHandleMap[e], delete this.messageChannelHandleTimeOutMap[e],
            r;
        }
    }, {
        key: "push",
        value: function(e, r) {
            this.messageChannelHandleMap[e] = r, this.messageChannelHandleTimeOutMap[e] = new Date().getTime();
        }
    }, {
        key: "_GC",
        value: function() {
            var t = this;
            setInterval(function() {
                if (!(Object.keys(t.messageChannelHandleMap).length < 512)) {
                    var e = new Date().getTime();
                    for (var r in t.messageChannelHandleTimeOutMap) 3e5 <= e - t.messageChannelHandleTimeOutMap[r] && (delete t.messageChannelHandleTimeOutMap[r],
                    delete t.messageChannelHandleMap[r]);
                }
            }, 3e3);
        }
    } ]), e;
}(), msgChannel = new MessageChannel(), SerialPort = function() {
    function e() {
        (0, _classCallCheck2.default)(this, e), this.currentSerialport = {
            port: "",
            baudRate: 115200
        }, this.processChannelHandleMap = {}, this.response = null;
    }
    return (0, _createClass2.default)(e, [ {
        key: "executeCmd",
        value: function(e, r) {
            var t = e.getOptions();
            switch (t.hasOwnProperty("port") && (this.currentSerialport.port = t.port), t.hasOwnProperty("baudRate") && (this.currentSerialport.baudRate = t.baudRate),
            msgChannel.push(r.messageId, r), this.response = r, e.Body.cmd) {
              case "flush":
                return this.doFlush(e, r);

              case "getDevices":
                return this.doGetDevices(e, r);

              case "open":
                return this.fork(e, r);

              case "close":
                return this.doClose(e, r);

              case "set":
                return this.doSet(e, r);

              case "drain":
                return this.doDrain(e, r);

              case "write":
                return this.doWrite(e, r);

              default:
                return msgChannel.pop(r.messageId);
            }
        }
    }, {
        key: "doGetDevices",
        value: function(e, t) {
            serialport.list(function(e, r) {
                logger.debug("> ".concat(t.io.id, ": -> [getDevices]"), r), t.reply(e, r);
            });
        }
    }, {
        key: "doClose",
        value: function(e, r) {
            return r.reply(null, this.currentSerialport.port), logger.debug("> ".concat(r.io.id, ": -> [close]")),
            this.kill();
        }
    }, {
        key: "doSet",
        value: function(e, r) {
            if (!this.processChannelHandleMap["".concat(this.currentSerialport.port)]) return logger.debug("> ".concat(r.io.id, ": -> [doSet], err: disconnect.")),
            r.reply("disconnect", this.currentSerialport.port);
            var t = e.getParams();
            this.processSendSomething(this.processChannelHandleMap["".concat(this.currentSerialport.port)], {
                cmd: "set",
                data: t.data,
                messageId: r.messageId
            }), logger.debug("> ".concat(this.response.io.id, ": -> [Set]"), JSON.stringify(t.data)),
            r.reply(null);
        }
    }, {
        key: "doDrain",
        value: function(e, r) {
            if (!this.processChannelHandleMap["".concat(this.currentSerialport.port)]) return logger.debug("> ".concat(r.io.id, ": -> [doDrain], err: disconnect.")),
            r.reply("disconnect");
            this.processSendSomething(this.processChannelHandleMap["".concat(this.currentSerialport.port)], {
                cmd: "drain",
                messageId: r.messageId
            });
        }
    }, {
        key: "drain",
        value: function(e, r) {
            var t = msgChannel.pop(r);
            t ? t.reply(e) : logger.debug("message[".concat(r, "]: serialport drain missing."));
        }
    }, {
        key: "doWrite",
        value: function(e, r) {
            if (!this.processChannelHandleMap["".concat(this.currentSerialport.port)]) return logger.debug("> ".concat(r.io.id, ": -> [doWrite], err: disconnect.")),
            r.reply("disconnect");
            var t = e.getParams();
            this.processSendSomething(this.processChannelHandleMap["".concat(this.currentSerialport.port)], {
                cmd: "write",
                data: t.data,
                encode: t.encode,
                messageId: r.messageId
            }), logger.debug("> ".concat(this.response.io.id, ": -> [Write]"), new Buffer(t.data)),
            r.reply(null);
        }
    }, {
        key: "doFlush",
        value: function(e, r) {
            return r.reply("node-serialport 因库有crash几率，暂时不开放flush.");
        }
    }, {
        key: "flush",
        value: function(e, r) {
            var t = msgChannel.pop(r);
            t ? t.reply(e) : logger.debug("message[".concat(r, "]: serialport flush missing."));
        }
    }, {
        key: "open",
        value: function(e, r) {
            var t = msgChannel.pop(r);
            t ? t.reply(e) : logger.debug("message[".concat(r, "]: serialport open missing."));
        }
    }, {
        key: "kill",
        value: function() {
            logger.debug("prepare kill serialport process"), this.processChannelHandleMap["".concat(this.currentSerialport.port)] && (this.processChannelHandleMap["".concat(this.currentSerialport.port)].killed || this.processChannelHandleMap["".concat(this.currentSerialport.port)].kill("SIGTERM"));
        }
    }, {
        key: "fork",
        value: function(e, r) {
            var t = this;
            if (this.processChannelHandleMap["".concat(this.currentSerialport.port)]) return channel.withPlatformsConnect(r.io.id, this.getSerialportTarget(), this.processChannelHandleMap["".concat(this.currentSerialport.port)]),
            r.reply(null);
            this.processChannelHandleMap["".concat(this.currentSerialport.port)] = child_process.fork(SerialPortChildProcess),
            channel.withPlatformsConnect(r.io.id, this.getSerialportTarget(), this.processChannelHandleMap["".concat(this.currentSerialport.port)]),
            this.processSendSomething(this.processChannelHandleMap["".concat(this.currentSerialport.port)], {
                cmd: "open",
                options: this.currentSerialport,
                messageId: r.messageId
            }), this.processChannelHandleMap["".concat(this.currentSerialport.port)].on("message", function(e) {
                switch (e.method) {
                  case "flush":
                    return t.flush(e.error, e.messageId);

                  case "drain":
                    return t.drain(e.error, e.messageId);

                  case "disconnect":
                  case "close":
                    return t.response.push(t.getSerialportTarget(e.connectName), e.method, e.connectName),
                    t.kill();

                  case "error":
                    return t.response.push(t.getSerialportTarget(e.connectName), e.error, e.connectName),
                    t.kill();

                  case "data":
                    return logger.debug("> ".concat(t.response.io.id, ": <- [Read]"), new Buffer(e.data)),
                    t.response.push(t.getSerialportTarget(e.connectName), null, e.connectName, e.data);

                  case "open":
                    return t.open(null, e.messageId);
                }
            }), this.processChannelHandleMap["".concat(this.currentSerialport.port)].on("disconnect", function() {
                logger.debug("process disconnect."), t.process_GC();
            }), this.processChannelHandleMap["".concat(this.currentSerialport.port)].on("close", function() {
                logger.debug("process close."), t.process_GC();
            });
        }
    }, {
        key: "processSendSomething",
        value: function(e, r) {
            try {
                e.send(r);
            } catch (e) {
                logger.debug("process send error", r);
            }
        }
    }, {
        key: "process_GC",
        value: function() {
            for (var r in this.processChannelHandleMap) try {
                this.processChannelHandleMap[r].killed && (this.response.push(this.getSerialportTarget(r), "disconnect", r),
                delete this.processChannelHandleMap[r], channel.untiePlatformsConnect(this.getSerialportTarget(r)));
            } catch (e) {
                logger.debug("process[".concat(r, "] is not exist."));
            }
        }
    }, {
        key: "getSerialportTarget",
        value: function() {
            var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "";
            return "" === e ? "serialport:" + this.currentSerialport.port : "serialport:" + e;
        }
    } ]), e;
}();

module.exports = new SerialPort();
