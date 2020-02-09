"use strict";

var dev = {
        debug: function(n) {
            for (var o, r = arguments.length, e = new Array(1 < r ? r - 1 : 0), c = 1; c < r; c++) e[c - 1] = arguments[c];
            (o = console).debug.apply(o, [n].concat(e));
        },
        info: function(n) {
            for (var o, r = arguments.length, e = new Array(1 < r ? r - 1 : 0), c = 1; c < r; c++) e[c - 1] = arguments[c];
            (o = console).log.apply(o, [n].concat(e));
        }
    },
    pro = {
        info: function(n) {
            for (var o, r = arguments.length, e = new Array(1 < r ? r - 1 : 0), c = 1; c < r; c++) e[c - 1] = arguments[c];
            (o = console).log.apply(o, [n].concat(e));
        }
    },
    combine = function(n, o) {
        var r = {};
        if ("dev" === process.env.NODE_ENV) {
            for (var e in o) r[e] = function() {};
            return Object.assign({}, r, n);
        }
        for (var c in n) r[c] = function() {};
        return Object.assign({}, r, o);
    };

module.exports = combine(dev, pro);
