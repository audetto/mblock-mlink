"use strict";

var i, channels = {},
    frequency = 2412;

for (i = 1; i < 15; i++) channels[i] = frequency.toString(), frequency += 5;

for (frequency = 5180, i = 36; i <= 64; i += 4) channels[i] = frequency.toString(),
    frequency += 20;

for (frequency = 5500, i = 100; i <= 144; i += 4) channels[i] = frequency.toString(),
    frequency += 20;

function frequencyFromChannel(e) {
    return channels[parseInt(e)];
}

function dBFromQuality(e) {
    return parseFloat(e) / 2 - 100;
}

exports.frequencyFromChannel = frequencyFromChannel, exports.dBFromQuality = dBFromQuality;
