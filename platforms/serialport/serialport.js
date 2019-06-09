"use strict";

function _classCallCheck(e, r) {
    if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
}

function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
        var n = r[t];
        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0),
        Object.defineProperty(e, n.key, n);
    }
}

function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), e;
}

var serialport = require("serialport"), child_process = require("child_process"), channel = require("../../channel"), SerialPortChildProcess = __dirname + "/serialPortChildProcess.js", SerialPort = function() {
    function e() {
        _classCallCheck(this, e), this.currentSerialport = {
            port: "",
            baudRate: 115200
        }, this.processChannelHandleMap = {}, this.messageChannelHandleMap = {}, this.response = null,
        this.heartLoop = null;
    }
    return _createClass(e, [ {
        key: "executeCmd",
        value: function(e, r) {
            this.response = r;
            var t = e.getOptions();
            switch (t.hasOwnProperty("port") && (this.currentSerialport.port = t.port), t.hasOwnProperty("baudRate") && (this.currentSerialport.baudRate = t.baudRate),
            e.Body.cmd) {
              case "flush":
                return this.doFlush(e, r);

              case "getDevices":
                return this.doGetDevices(e, r);

              case "open":
                return this.fork();

              case "close":
                return this.doClose(e, r);

              case "set":
                return this.doSet(e, r);

              case "drain":
                return this.doDrain(e, r);

              case "write":
                return this.doWrite(e, r);
            }
        }
    }, {
        key: "doGetDevices",
        value: function(e, t) {
            serialport.list(function(e, r) {
                t.reply(e, "", r);
            });
        }
    }, {
        key: "doClose",
        value: function(e, r) {
            return r.reply(null, this.currentSerialport.port), console.log("> ".concat(r.io.id, ": -> [close]")),
            this.kill();
        }
    }, {
        key: "doSet",
        value: function(e, r) {
            if (!this.processChannelHandleMap["".concat(this.currentSerialport.port)]) return console.log("> ".concat(r.io.id, ": -> [doSet], err: disconnect.")),
            r.reply("disconnect", this.currentSerialport.port);
            var t = e.getParams();
            this.processChannelHandleMap["".concat(this.currentSerialport.port)].send({
                cmd: "set",
                data: t.data,
                messageId: r.messageId
            }), console.log("> ".concat(this.response.io.id, ": -> [Set]"), JSON.stringify(t.data)),
            r.reply(null, this.currentSerialport.port);
        }
    }, {
        key: "doDrain",
        value: function(e, r) {
            if (!this.processChannelHandleMap["".concat(this.currentSerialport.port)]) return console.log("> ".concat(r.io.id, ": -> [doDrain], err: disconnect.")),
            r.reply("disconnect", this.currentSerialport.port);
            this.processChannelHandleMap["".concat(this.currentSerialport.port)].send({
                cmd: "drain",
                messageId: r.messageId
            }), this.messageChannelHandleMap[r.messageId] = r;
        }
    }, {
        key: "drain",
        value: function(e, r) {
            if (this.messageChannelHandleMap[r]) {
                var t = this.messageChannelHandleMap[r];
                delete this.messageChannelHandleMap[r], t.reply(e, this.currentSerialport.port);
            } else console.log("info: serialport drain 响应请求失败，丢失消息。", this.messageChannelHandleMap, r);
        }
    }, {
        key: "doWrite",
        value: function(e, r) {
            if (!this.processChannelHandleMap["".concat(this.currentSerialport.port)]) return console.log("> ".concat(r.io.id, ": -> [doWrite], err: disconnect.")),
            r.reply("disconnect", this.currentSerialport.port);
            var t = e.getParams();
            this.processChannelHandleMap["".concat(this.currentSerialport.port)].send({
                cmd: "write",
                data: t.data,
                encode: t.encode,
                messageId: r.messageId
            }), console.log("> ".concat(this.response.io.id, ": -> [Write]"), new Buffer(t.data)),
            r.reply(null, this.currentSerialport.port);
        }
    }, {
        key: "doFlush",
        value: function(e, r) {
            return r.reply("node-serialport 因库有crash几率，暂时不开放flush.");
        }
    }, {
        key: "flush",
        value: function(e, r, t) {
            if (this.messageChannelHandleMap[r]) {
                var n = this.messageChannelHandleMap[r];
                delete this.messageChannelHandleMap[r], console.log("> ".concat(n.io.id, ": <- [flush]")),
                n.reply(e, t);
            } else console.log("info: serialport flush 响应请求失败，丢失消息。", this.messageChannelHandleMap, r);
        }
    }, {
        key: "open",
        value: function(e, r, t) {
            if (this.messageChannelHandleMap[r]) {
                var n = this.messageChannelHandleMap[r];
                delete this.messageChannelHandleMap[r], console.log("> ".concat(n.io.id, ": <- [Connected] "), t),
                n.reply(e, t);
            } else console.log("info: serialport open 返回失败，丢失消息。", this.messageChannelHandleMap, r);
        }
    }, {
        key: "kill",
        value: function() {
            console.log("调用到kill function"), this.processChannelHandleMap["".concat(this.currentSerialport.port)] && (console.log("当前子进程PID", this.processChannelHandleMap["".concat(this.currentSerialport.port)].pid),
            console.log("当前子进程是否已经被killed", this.processChannelHandleMap["".concat(this.currentSerialport.port)].killed),
            this.processChannelHandleMap["".concat(this.currentSerialport.port)].killed || this.processChannelHandleMap["".concat(this.currentSerialport.port)].kill("SIGTERM")),
            clearInterval(this.heartLoop);
        }
    }, {
        key: "fork",
        value: function() {
            var r = this;
            if (this.processChannelHandleMap["".concat(this.currentSerialport.port)]) return channel.withPlatformsConnect(this.response.io.id, this.getSerialportTarget(), this.processChannelHandleMap["".concat(this.currentSerialport.port)]),
            this.response.reply(null, this.currentSerialport.port);
            this.processChannelHandleMap["".concat(this.currentSerialport.port)] = child_process.fork(SerialPortChildProcess),
            channel.withPlatformsConnect(this.response.io.id, this.getSerialportTarget(), this.processChannelHandleMap["".concat(this.currentSerialport.port)]),
            this.processChannelHandleMap["".concat(this.currentSerialport.port)].send({
                cmd: "open",
                options: this.currentSerialport,
                messageId: this.response.messageId
            }), this.keepalived(), this.messageChannelHandleMap[this.response.messageId] = this.response,
            this.processChannelHandleMap["".concat(this.currentSerialport.port)].on("message", function(e) {
                switch (e.method) {
                  case "flush":
                    return r.flush(e.error, e.messageId, e.connectName);

                  case "drain":
                    return r.drain(e.error, e.messageId, e.connectName);

                  case "disconnect":
                  case "close":
                    return r.response.push(r.getSerialportTarget(), e.method, e.connectName), r.kill();

                  case "error":
                    return r.response.push(r.getSerialportTarget(), e.error, e.connectName), r.kill();

                  case "data":
                    return console.log("> ".concat(r.response.io.id, ": <- [Read]"), new Buffer(e.data)),
                    r.response.push(r.getSerialportTarget(), null, e.connectName, e.data);

                  case "open":
                    return r.open(null, e.messageId, e.port);
                }
            }), this.processChannelHandleMap["".concat(this.currentSerialport.port)].on("disconnect", function() {
                console.log("> ".concat(r.response.io.id, ": [info] 子进程 disconnect ").concat(r.currentSerialport.port)),
                r.kill(), r.response.push(r.getSerialportTarget(), "disconnect", r.currentSerialport.port),
                r.clearChannelMap();
            }), this.processChannelHandleMap["".concat(this.currentSerialport.port)].on("close", function() {
                console.log("> ".concat(r.response.io.id, ": [info] 子进程 close ").concat(r.currentSerialport.port)),
                r.kill(), r.response.push(r.getSerialportTarget(), "disconnect", r.currentSerialport.port),
                r.clearChannelMap();
            });
        }
    }, {
        key: "keepalived",
        value: function() {
            var r = this;
            this.heartLoop = setInterval(function() {
                for (var e in r.processChannelHandleMap) r.processChannelHandleMap[e].pid && r.processChannelHandleMap[e].send({
                    cmd: "heart"
                });
            }, 3e3);
        }
    }, {
        key: "clearChannelMap",
        value: function() {
            delete this.processChannelHandleMap["".concat(this.currentSerialport.port)], channel.untiePlatformsConnect(this.response.io.id, this.getSerialportTarget());
        }
    }, {
        key: "getSerialportTarget",
        value: function() {
            return "serialport:" + this.currentSerialport.port;
        }
    } ]), e;
}();

module.exports = new SerialPort();
