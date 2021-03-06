"use strict";
var exec = require("child_process").exec,
    networkUtils = require("./network-utils"),
    env = require("./env"),
    iconv = require("iconv-lite");

function scanWifi(e) {
    return function(o) {
        exec("chcp 65001 && netsh wlan show networks mode=Bssid", env, function(e, n) {
            if (e) o && o(e);
            else {
                n = n.toString("utf8").split("\r").join("").split("\n").slice(5, n.length);
                var i, s, t, r = -1,
                    c = 0,
                    l = [],
                    u = [];
                for (t = 0; t < n.length; t++) "" == n[t] && (r++, i = n.slice(c, t), l.push(i), c = t + 1);
                for (t = 0; t < r; t++) 0 < l[t].length && (s = parse(l[t]), u.push(s));
                o && o(null, u)
            }
        })
    }
}

function parse(e) {
    var n, i = {
        mac: null,
        ssid: null,
        frequency: null,
        signal_level: null,
        security: null
    };
    return e[4] && (n = e[4].match(/.*?:\s(.*)/)) && n[1] && (i.mac = n[1]), e[0] && (n = e[0].match(/.*?:\s(.*)/)) && n[1] && (i.ssid = iconv.decode(iconv.encode(n[1], "gbk"), "utf8")), e[7] && (n = e[7].match(/.*?:\s(.*)/)) && n[1] && (i.frequency = networkUtils.frequencyFromChannel(n[1])), e[5] && (n = e[5].match(/.*?:\s(.*)/)) && n[1] && (i.signal_level = networkUtils.dBFromQuality(n[1])), e[2] && (n = e[2].match(/.*?:\s(.*)/)) && n[1] && (i.security = n[1]), i
}
exports.scanWifi = scanWifi;
