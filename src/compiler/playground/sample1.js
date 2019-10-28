"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exception = (constructor) => {
    var _a;
    return _a = class extends constructor {
            constructor() {
                super(...arguments);
                this.name = constructor.name;
            }
        },
        _a.sukka = 1,
        _a;
};
