"use strict";
var nodeWifi = require("node-wifi"),
    logger = require("../logger"),
    response = require("../response"),
    connectSsid = function(e, n) {
        var i = 0 < arguments.length && void 0 !== e ? e : "",
            o = 1 < arguments.length && void 0 !== n ? n : "";
        nodeWifi.connect({
            ssid: i,
            password: o
        }, function(e) {
            e && response.reply(e), logger.debug("wifi ssid", i, "connect success!")
        })
    };
module.exports = {
    connectSsid: connectSsid
};
