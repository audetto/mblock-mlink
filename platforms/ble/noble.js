"use strict";
var logger = require("../../logger"),
    os = require("os"),
    getNoble = function(e) {
        var r = null;
        if ("win32" === os.platform()) {
            var o = os.release().split(".").map(Number);
            if (e || !(10 < o[0] || 10 === o[0] && 0 < o[1] || 10 === o[0] && 0 === o[1] && 15063 <= o[2])) {
                logger.debug("platform->win7:@kunz/noble-mac");
                try {
                    r = require("@kunz/noble-mac")
                } catch (e) {
                    logger.error(e.code)
                }
            } else logger.debug("platform->win10:noble-uwp"), r = require("noble-uwp")
        } else logger.debug("platform->mac/linux:@kunz/noble-mac"), r = require("@kunz/noble-mac");
        return r
    };
module.exports = {
    getNoble: getNoble
};
