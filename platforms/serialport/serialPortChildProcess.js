"use strict";

var serialport = require("serialport"), SerialPort = null, currentPort = null, connect = function(e, r) {
    var o = e.port;
    currentPort = o, delete e.port, (SerialPort = new serialport(o, e)).on("open", function() {
        process.send({
            method: "open",
            messageId: r,
            port: o
        });
    }), SerialPort.on("error", function(e) {
        process.send({
            method: "error",
            error: e,
            connectName: currentPort
        }), console.log("[child] serialport open error:", e);
    }), SerialPort.on("data", function(e) {
        process.send({
            method: "data",
            data: e,
            connectName: currentPort
        });
    }), SerialPort.on("close", function() {
        console.log("[child] serialport close."), process.send({
            method: "close",
            connectName: currentPort
        });
    }), SerialPort.on("disconnect", function() {
        console.log("[child] serialport disconnect."), process.send({
            method: "disconnect",
            connectName: currentPort
        });
    });
}, heartTime = new Date().getTime();

setInterval(function() {
    console.log("[child] 进程 ".concat(process.pid, " 父子进程通信时间差："), new Date().getTime() - heartTime),
    3e4 < new Date().getTime() - heartTime && (console.log("[child] 进程 ".concat(process.pid, " 主进程与子进程失联，故kill掉。")),
    process.exit(0));
}, 3e3), process.on("message", function(r) {
    if (heartTime = new Date().getTime(), console.log("[child] 进程 ".concat(process.pid, " 收到的数据:"), r.cmd),
    "heart" !== r.cmd) {
        if ("open" === r.cmd) return connect(r.options, r.messageId);
        if (null !== SerialPort) {
            if ("set" === r.cmd) return SerialPort.set(r.data);
            if ("drain" === r.cmd) return SerialPort.drain(function(e) {
                process.send({
                    method: "drain",
                    error: e,
                    messageId: r.messageId,
                    connectName: currentPort
                });
            });
            if ("flush" === r.cmd) return SerialPort.flush(function(e) {
                process.send({
                    method: "flush",
                    error: e,
                    messageId: r.messageId,
                    connectName: currentPort
                });
            });
            var e = new Buffer(r.data);
            console.log("-> port write", e), SerialPort.write(e, r.encode, function() {});
        } else process.send({
            method: r.cmd,
            error: "serialport is disconnect.",
            messageId: r.messageId,
            connectName: currentPort
        });
    }
}), process.on("SIGTERM", function() {
    console.log("Got Serial SIGKILL. exit.", currentPort), process.exit(0);
});
