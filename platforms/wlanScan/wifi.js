"use strict";
var windowsScan = require("./windows-scan.js").scanWifi,
    linuxScan = require("./linux-scan.js").scanWifi,
    macScan = require("./mac-scan.js").scanWifi,
    config = {
        debug: !1,
        iface: null
    };

function init(i) {
    var n;
    switch (i && i.debug && (config.debug = i.debug), i && i.iface && (config.iface = i.iface), process.platform) {
        case "linux":
            n = linuxScan(config);
            break;
        case "darwin":
            n = macScan(config);
            break;
        case "win32":
            n = windowsScan(config);
            break;
        default:
            throw new Error("ERROR : UNRECOGNIZED OS")
    }
    exports.scan = n
}
exports.init = init, exports.scan = function() {
    throw new Error("ERROR : use init before")
};
