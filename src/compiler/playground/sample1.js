"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b, _c, _d, _e, _f;
const core_1 = require("@angular/core");
let HomeComponent = class HomeComponent {
    constructor(env, runka) {
        this.env = env;
    }
    method1(kakka) {
        return 1;
    }
    method2(kakka, another, baba) {
        return 1;
    }
};
__decorate([
    pissa,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", typeof (_a = typeof Makka !== "undefined" && Makka) === "function" ? _a : Object)
], HomeComponent.prototype, "method1", null);
__decorate([
    paska(),
    pissa(),
    __param(0, runka),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Kakkenen !== "undefined" && Kakkenen) === "function" ? _b : Object, typeof (_c = typeof AnotherKakka !== "undefined" && AnotherKakka) === "function" ? _c : Object, String]),
    __metadata("design:returntype", typeof (_d = typeof Makka !== "undefined" && Makka) === "function" ? _d : Object)
], HomeComponent.prototype, "method2", null);
HomeComponent = __decorate([
    core_1.Component({
        selector: 'app-home',
        templateUrl: './home.component.html',
        styleUrls: ['./home.component.css'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_e = typeof Kakka !== "undefined" && Kakka) === "function" ? _e : Object, typeof (_f = typeof Sukka !== "undefined" && Sukka) === "function" ? _f : Object])
], HomeComponent);
exports.HomeComponent = HomeComponent;
