"use strict";
var exec = require("child_process").exec,
    macProvider = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport",
    networkUtils = require("./network-utils.js"),
    env = require("./env");

function scanWifi(r) {
    return function(s) {
        exec(macProvider + " -s", env, function(r, e) {
            r && s && s(r);
            var i = parseAirport({
                BSSID: "BSSID",
                RSSI: "RSSI",
                CHANNEL: "CHANNEL",
                HT: "HT",
                SECURITY: "SECURITY",
                CC: "CC"
            }, e);
            s && s(null, i)
        })
    }
}

function parseAirport(r, e) {
    for (var i = e.split("\n"), s = i[0].indexOf(r.BSSID), n = i[0].indexOf(r.RSSI), t = i[0].indexOf(r.CHANNEL), u = i[0].indexOf(r.HT), o = i[0].indexOf(r.SECURITY), c = [], a = 1, f = i.length; a < f; a++) c.push({
        mac: i[a].substr(s, n - s).trim(),
        ssid: i[a].substr(0, s).trim(),
        frequency: networkUtils.frequencyFromChannel(i[a].substr(t, u - t).trim()),
        signal_level: i[a].substr(n, t - n).trim(),
        security: i[a].substr(o).trim()
    });
    return c.pop(), c
}
exports.scanWifi = scanWifi;
