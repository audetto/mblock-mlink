"use strict";

var server = require("http").createServer(), io = require("socket.io")(server), fs = require("fs"), SOCKET_PORT = 55278, logger = require("./logger"), Router = require("./router"), channel = require("./channel");

io.on("connection", function(e) {
    channel.push(e);
    var n = new Router(e);
    e.on("c2s_send", function(e, r) {
        n.dispatch(e, r);
    }), e.on("disconnect", function() {
        channel.platformsGC(e), logger.debug("Socket.io-client Disconnect.");
    }), logger.debug("Socket.io-client Connected.", e.id);
}), server.listen(SOCKET_PORT, function() {
    try {
        var e = __dirname + "/version.json";
        fs.accessSync(e, fs.F_OK);
        var r = require(e);
        logger.info("Version:", r.version);
    } catch (e) {
        logger.info("Version: Dev");
    }
    logger.debug("Robot Communication Started. Listen:", SOCKET_PORT, "Web Version");
});
