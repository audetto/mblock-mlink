"use strict";
var fs = require("fs"),
    path = require("path"),
    open = require("open"),
    mkdirsSync = function n(e) {
        return !!existsSync(e) || !!n(path.dirname(e)) && (fs.mkdirSync(e), !0)
    },
    existsSync = function(n) {
        try {
            fs.accessSync(n, fs.F_OK)
        } catch (n) {
            return !1
        }
        return !0
    },
    deleteDirsSync = function() {},
    openDir = function(n) {
        open(n)
    };
module.exports = {
    mkdirsSync: mkdirsSync,
    existsSync: existsSync,
    openDir: openDir
};
