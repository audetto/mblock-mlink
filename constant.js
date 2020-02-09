"use strict";
var path = require("path"),
    HOMEPATH = "win32" === process.platform ? process.env.USERPROFILE : process.env.HOME,
    ROUTER = {
        CONNECT_TYPE: {
            SERIALPORT: "serialport",
            WLAN_SCAN: "wlanScan",
            ESPTOOL_BY_EXEC: "esptoolByExec",
            BLE: "ble",
            HID: "hid",
            WIFI: "wifi"
        },
        RESOURCE_PATH: path.resolve(HOMEPATH, "mblock"),
        MBLOCK5_LOG_PATH: path.resolve(HOMEPATH, "mblock5", "logs"),
        MLINK_LOG_PATH: path.resolve(HOMEPATH, "mlink", "logs"),
        LOCAL_SERVER_PATH: path.resolve(HOMEPATH, "mlink", "www"),
        CAPTURE_PATH: path.resolve(HOMEPATH, "mlink", "capture")
    };
module.exports = {
    ROUTER: ROUTER
};
