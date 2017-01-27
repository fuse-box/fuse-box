"use strict";
var $isPromise = function (item) {
    return item
        && typeof item.then === 'function' &&
        typeof item.catch === 'function';
};
var FuseBoxTestRunner = (function () {
    function FuseBoxTestRunner() {
    }
    FuseBoxTestRunner.prototype.start = function () {
        var tests = FuseBox.import("*.test.js");
        for (var name_1 in tests) {
            if (tests.hasOwnProperty(name_1)) {
                var testExports = tests[name_1];
                this.runClassExports(name_1, testExports);
            }
        }
    };
    FuseBoxTestRunner.prototype.convertToReadableName = function (str) {
        var prev;
        var word = [];
        var words = [];
        var addWord = function () {
            if (word.length) {
                words.push(word.join('').toLowerCase());
            }
        };
        for (var i = 0; i < str.length; i++) {
            var char = str.charAt(i);
            if (char === "_") {
                if (word.length) {
                    addWord();
                    word = [];
                }
            }
            else {
                if (char.toUpperCase() === char) {
                    addWord();
                    word = [char];
                }
                else {
                    word.push(char);
                }
                if (i == str.length - 1) {
                    addWord();
                }
            }
        }
        var sentence = words.join(' ');
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    };
    FuseBoxTestRunner.prototype.runClassExports = function (filename, moduleExports) {
        for (var key in moduleExports) {
            if (moduleExports.hasOwnProperty(key)) {
                this.runClass(moduleExports[key]);
            }
        }
    };
    FuseBoxTestRunner.prototype.extractInstructions = function (obj) {
        var props = Object.getOwnPropertyNames(obj.constructor.prototype);
        var instructions = {
            methods: []
        };
        var systemProps = ["before", 'beforeEach', 'after', 'afterEach'];
        for (var i = 1; i < props.length; i++) {
            var propertyName = props[i];
            if (systemProps.indexOf(propertyName) == -1) {
                instructions.methods.push(propertyName);
            }
            else {
                if (typeof obj[propertyName] === "function") {
                    instructions[propertyName] = true;
                }
            }
        }
        return instructions;
    };
    FuseBoxTestRunner.prototype.hasCallback = function (func) {
        return /^(function\s)?[a-z0-9$_]+\((.+)\)/.test(func.toString());
    };
    FuseBoxTestRunner.prototype.createEvalFunction = function (obj, method) {
        var _this = this;
        return function () {
            return new Promise(function (resolve, reject) {
                var func = obj[method];
                var hasCallback = _this.hasCallback(func);
                if (hasCallback) {
                    func(function (error) {
                        if (error) {
                            return reject(error);
                        }
                        return resolve();
                    });
                }
                else {
                    var result = func();
                    if ($isPromise(result)) {
                        return result.then(resolve).catch(reject);
                    }
                    else {
                        return resolve();
                    }
                }
            });
        };
    };
    FuseBoxTestRunner.prototype.runClass = function (obj) {
        var _this = this;
        var instance = new obj();
        var instructions = this.extractInstructions(instance);
        var tasks = [];
        if (instructions["before"]) {
            tasks.push({
                method: "before",
                fn: this.createEvalFunction(instance, "before")
            });
        }
        if (instructions["beforeAll"]) {
            tasks.push({
                method: "beforeAll",
                fn: this.createEvalFunction(instance, "before")
            });
        }
        instructions.methods.forEach(function (methodName) {
            if (instructions["beforeAll"]) {
                tasks.push({
                    method: "beforeAll",
                    fn: _this.createEvalFunction(instance, "before")
                });
            }
            tasks.push({
                method: methodName,
                title: _this.convertToReadableName(methodName),
                fn: _this.createEvalFunction(instance, methodName)
            });
            if (instructions["afterAll"]) {
                tasks.push({
                    method: "afterAll",
                    fn: _this.createEvalFunction(instance, "afterAll")
                });
            }
        });
        if (instructions["after"]) {
            tasks.push({
                method: "after",
                fn: this.createEvalFunction(instance, "after")
            });
        }
        tasks.forEach(function (item) {
            item();
        });
    };
    FuseBoxTestRunner.prototype.runTasks = function (tasks) {
    };
    return FuseBoxTestRunner;
}());
exports.FuseBoxTestRunner = FuseBoxTestRunner;
