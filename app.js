"use strict";
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
    _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator")),
    server = require("http").createServer(),
    io = require("socket.io")(server),
    fs = require("fs"),
    logger = require("./logger"),
    router = require("./router"),
    channel = require("./channel"),
    Mnode = require("./mnode"),
    SOCKET_PORT = 55278,
    getVersion = function() {
        var r;
        try {
            var e = __dirname + "/version.json";
            fs.accessSync(e, fs.F_OK), r = require(e)
        } catch (e) {
            var n = __dirname + "/../package.json";
            fs.accessSync(n, fs.F_OK), r = require(n)
        }
        return r.version
    },
    version = getVersion();
io.on("connection", function(i) {
    channel.push(i);
    var t = new Mnode(i);
    i.on("mnode_from_client", function(r, n) {
        var o;
        return _regenerator.default.async(function(e) {
            for (;;) switch (e.prev = e.next) {
                case 0:
                    return e.next = 2, _regenerator.default.awrap(t.execute(r, n));
                case 2:
                    o = e.sent, i.emit("mnode_from_server", r, o);
                case 4:
                case "end":
                    return e.stop()
            }
        })
    }), i.on("c2s_send", function(e, r) {
        router.dispatcher(i, e, r, version)
    }), i.on("disconnect", function() {
        channel.platformsGC(i), logger.debug("Socket.io-client Disconnect.")
    }), i.on("check_mlink_version", function() {
        i.emit("mlink_version", version), logger.info("Version: version.json -> ", version)
    }), logger.debug("Socket.io-client Connected.", i.id)
}), server.listen(SOCKET_PORT, function() {
    logger.debug("Robot Communication Started. Listen:", SOCKET_PORT, "Web Version: ", version)
}), Mnode.startServer();
