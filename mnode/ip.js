"use strict";
var os = require("os"),
    getNetInterface = function() {
        var r = os.networkInterfaces();
        if (r.en0) return r.en0.find(function(r) {
            return "IPv4" === r.family
        }) || [];
        for (var t in r) {
            return r[t].find(function(r) {
                return "IPv4" === r.family && !r.internal && "127.0.0.1" !== r.address
            }) || []
        }
    },
    getBroadcastAddress = function() {
        var r = getNetInterface();
        if (r) {
            var t = r.address,
                n = r.netmask,
                e = t.split(".").map(function(r) {
                    return Number(r)
                }),
                a = n.split(".").map(function(r) {
                    return Number(r)
                }),
                i = e.map(function(r, t) {
                    return (r & a[t]).toString(2)
                }).map(function(r) {
                    return new Array(8 - r.length).fill(0).join("") + r
                });
            return a.map(function(r) {
                return (255 - r).toString(2)
            }).forEach(function(r, t) {
                if ("0" !== r)
                    for (var n = r.length, e = 0; e < n; e++) {
                        var a = i[t].split("");
                        a[7 - e] = 1, i[t] = a.join("")
                    }
            }), i.map(function(r) {
                return parseInt(r, 2)
            }).join(".") || ""
        }
        return "255.255.255.255"
    };
module.exports = {
    getNetInterface: getNetInterface,
    getBroadcastAddress: getBroadcastAddress
};
