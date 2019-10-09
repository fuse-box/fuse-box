"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function f() {
    console.log('f(): evaluated');
    return function (target, propertyKey, descriptor) {
        console.log('f(): called');
    };
}
function g() {
    console.log('g(): evaluated');
    return function (target, propertyKey, descriptor) {
        console.log('g(): called');
    };
}
function sealed(constructor) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}
function enumerable(value) {
    return function (target, propertyKey, descriptor) {
        descriptor.enumerable = value;
    };
}
const formatMetadataKey = Symbol('format');
function format(formatString) {
    return Reflect.metadata(formatMetadataKey, formatString);
}
class WithPropDecor {
    constructor(message) {
        this.greeting = message;
    }
}
__decorate([
    format('Hello, %s')
], WithPropDecor.prototype, "greeting", void 0);
let C = class C {
    constructor(message) {
        this.greeting = message;
    }
    method() { }
    greet() {
        return 'Hello, ' + this.greeting;
    }
};
__decorate([
    f(),
    g()
], C.prototype, "method", null);
__decorate([
    enumerable(false)
], C.prototype, "greet", null);
C = __decorate([
    sealed
], C);
class default_1 {
    some() { }
}
__decorate([
    f()
], default_1.prototype, "some", null);
exports.default = default_1;
function required(target, propertyKey, parameterIndex) { }
class ParamDec {
    greet(name) {
        return 'Hello';
    }
}
__decorate([
    __param(0, required)
], ParamDec.prototype, "greet", null);
