"use strict";
var log4js = require("log4js"),
    _require = require("./constant"),
    ROUTER = _require.ROUTER,
    configure = {
        replaceConsole: !0,
        appenders: {
            stdout: {
                type: "console"
            },
            info: {
                type: "file",
                filename: ROUTER.MLINK_LOG_PATH + "/runtime.log",
                maxLogSize: 2048e4,
                backups: 10
            }
        },
        categories: {
            default: {
                appenders: ["stdout"],
                level: "debug"
            },
            info: {
                appenders: ["info"],
                level: "debug"
            }
        }
    };
log4js.configure(configure);
var type = "dev" === process.env.NODE_ENV ? "default" : "info",
    logger = log4js.getLogger(type);
module.exports = logger;
