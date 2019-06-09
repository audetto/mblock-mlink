"use strict";

var server = require("http").createServer(), io = require("socket.io")(server), SOCKET_PORT = 55278, Router = require("./router"), Channel = require("./channel");

io.on("connection", function(e) {
    Channel.push(e);
    var o = new Router(e);
    e.on("c2s_send", function(e, n) {
        o.dispatch(e, n);
    }), e.on("disconnect", function() {
        Channel.platformsGC(e), console.log("Socket.io-client Disconnect.");
    }), console.log("Socket.io-client Connected.", e.id);
}), server.listen(SOCKET_PORT, function() {
    console.log("Robot Communication Started. Listen:", SOCKET_PORT, "Web Version");
});
