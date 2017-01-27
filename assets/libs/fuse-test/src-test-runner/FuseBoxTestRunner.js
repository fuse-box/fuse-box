"use strict";
var FuseBoxTestRunner = (function () {
    function FuseBoxTestRunner() {
    }
    FuseBoxTestRunner.start = function () {
        var tests = FuseBox.import("*.test.js");
    };
    return FuseBoxTestRunner;
}());
exports.FuseBoxTestRunner = FuseBoxTestRunner;
