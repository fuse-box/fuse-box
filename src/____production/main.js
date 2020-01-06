"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ProductionContext_1 = require("./ProductionContext");
var codeSplittingStage_1 = require("./stages/codeSplittingStage");
var finalStage_1 = require("./stages/finalStage");
var generationStage_1 = require("./stages/generationStage");
var moduleLinkStage_1 = require("./stages/moduleLinkStage");
var preparationStage_1 = require("./stages/preparationStage");
var referenceLinkStage_1 = require("./stages/referenceLinkStage");
var transpileStage_1 = require("./stages/transpileStage");
function productionMain(props) {
    return __awaiter(this, void 0, void 0, function () {
        var productionContext, flow, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productionContext = ProductionContext_1.createProductionContext(props);
                    flow = { productionContext: productionContext, ctx: props.ctx, packages: props.packages };
                    /** Stage 1 */
                    // Replace process, add polyfills
                    // unwrap if conditions with dead code elimination
                    // replace FuseBox.iServer and FuseBox.isBrowser
                    // some other
                    preparationStage_1.preparationStage(flow);
                    // after this stage, productionContext has:
                    // productionContext.productionPackages which contain transform (but not transpiled sources ready for further transformations)
                    // TREE SHAKING STAGES *********************************************************************************************************
                    /** Stage 2 */
                    moduleLinkStage_1.moduleLinkStage(flow);
                    // at this stage we need to resolve and most importantly link all production modules and packages for further treeshaking
                    // and other manupulations
                    // having import references in places and we now link all the imports and exports
                    // to count references
                    referenceLinkStage_1.referenceLinkStage(flow);
                    //treeShakingStage(flow);
                    codeSplittingStage_1.codeSplittingStage(flow);
                    transpileStage_1.transpileStage(flow);
                    generationStage_1.generationStage(flow);
                    return [4 /*yield*/, finalStage_1.finalStage(flow)];
                case 1:
                    data = _a.sent();
                    props.ctx.log.stopStreaming();
                    props.ctx.ict.sync('complete', { bundles: data.bundles, ctx: props.ctx, packages: props.packages });
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.productionMain = productionMain;
