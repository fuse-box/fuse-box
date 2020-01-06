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
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b, _c;
const core_1 = require("@angular/core");
const app_init_service_1 = require("../shared/fusing/app-init.service");
const platform_service_1 = require("../shared/fusing/platform.service");
let AppComponent = class AppComponent {
    constructor(rdr, ais, ps) {
        if (ps.isElectron) {
            ais.init(rdr);
        }
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'pm-app',
        styleUrls: ['./app.component.css'],
        templateUrl: './app.component.html',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Renderer2 !== "undefined" && core_1.Renderer2) === "function" ? _a : Object, typeof (_b = typeof app_init_service_1.AppInitService !== "undefined" && app_init_service_1.AppInitService) === "function" ? _b : Object, typeof (_c = typeof platform_service_1.PlatformService !== "undefined" && platform_service_1.PlatformService) === "function" ? _c : Object])
], AppComponent);
exports.AppComponent = AppComponent;
