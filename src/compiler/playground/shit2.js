var tslib_1 = require("tslib");
var rxjs_2 = require("rxjs");
var operators_3 = require("rxjs/operators");
var ANNOTATIONS = "__annotations__";
var PARAMETERS = "__parameters__";
var PROP_METADATA = "__prop__metadata__";
function makeDecorator(name, props, parentClass, additionalProcessing, typeFn) {
  var metaCtor = makeMetadataCtor(props);
  function DecoratorFactory() {
    var _a;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (this instanceof DecoratorFactory) {
      metaCtor.call.apply(metaCtor, tslib_1.__spread([this], args));
      return this;
    }
    var annotationInstance = new ((_a = DecoratorFactory).bind.apply(_a, tslib_1.__spread([void 0], args)))();
    return function TypeDecorator(cls) {
      if (typeFn) typeFn.apply(void 0, tslib_1.__spread([cls], args));
      var annotations = cls.hasOwnProperty(ANNOTATIONS) ? cls[ANNOTATIONS] : Object.defineProperty(cls, ANNOTATIONS, {
        value: []
      })[ANNOTATIONS];
      annotations.push(annotationInstance);
      if (additionalProcessing) additionalProcessing(cls);
      return cls;
    };
  }
  if (parentClass) {
    DecoratorFactory.prototype = Object.create(parentClass.prototype);
  }
  DecoratorFactory.prototype.ngMetadataName = name;
  DecoratorFactory.annotationCls = DecoratorFactory;
  return DecoratorFactory;
}
exports.ɵmakeDecorator = makeDecorator;
function makeMetadataCtor(props) {
  return function ctor() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (props) {
      var values = props.apply(void 0, tslib_1.__spread(args));
      for (var propName in values) {
        this[propName] = values[propName];
      }
    }
  };
}
function makeParamDecorator(name, props, parentClass) {
  var metaCtor = makeMetadataCtor(props);
  function ParamDecoratorFactory() {
    var _a;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (this instanceof ParamDecoratorFactory) {
      metaCtor.apply(this, args);
      return this;
    }
    var annotationInstance = new ((_a = ParamDecoratorFactory).bind.apply(_a, tslib_1.__spread([void 0], args)))();
    ParamDecorator.annotation = annotationInstance;
    return ParamDecorator;
    function ParamDecorator(cls, unusedKey, index) {
      var parameters = cls.hasOwnProperty(PARAMETERS) ? cls[PARAMETERS] : Object.defineProperty(cls, PARAMETERS, {
        value: []
      })[PARAMETERS];
      while (parameters.length <= index) {
        parameters.push(null);
      }
      (parameters[index] = parameters[index] || []).push(annotationInstance);
      return cls;
    }
  }
  if (parentClass) {
    ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
  }
  ParamDecoratorFactory.prototype.ngMetadataName = name;
  ParamDecoratorFactory.annotationCls = ParamDecoratorFactory;
  return ParamDecoratorFactory;
}
exports.ɵangular_packages_core_core_bh = makeParamDecorator;
function makePropDecorator(name, props, parentClass, additionalProcessing) {
  var metaCtor = makeMetadataCtor(props);
  function PropDecoratorFactory() {
    var _a;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (this instanceof PropDecoratorFactory) {
      metaCtor.apply(this, args);
      return this;
    }
    var decoratorInstance = new ((_a = PropDecoratorFactory).bind.apply(_a, tslib_1.__spread([void 0], args)))();
    function PropDecorator(target, name) {
      var constructor = target.constructor;
      exports.undefined = constructor;
      var meta = constructor.hasOwnProperty(PROP_METADATA) ? constructor[PROP_METADATA] : Object.defineProperty(constructor, PROP_METADATA, {
        value: {}
      })[PROP_METADATA];
      meta[name] = meta.hasOwnProperty(name) && meta[name] || [];
      meta[name].unshift(decoratorInstance);
      if (additionalProcessing) additionalProcessing.apply(void 0, tslib_1.__spread([target, name], args));
    }
    return PropDecorator;
  }
  if (parentClass) {
    PropDecoratorFactory.prototype = Object.create(parentClass.prototype);
  }
  PropDecoratorFactory.prototype.ngMetadataName = name;
  PropDecoratorFactory.annotationCls = PropDecoratorFactory;
  return PropDecoratorFactory;
}
exports.ɵangular_packages_core_core_bi = makePropDecorator;
var ɵ0 = function (token) {
  return {
    token: token
  };
};
exports.ɵ0 = ɵ0;
var Inject = makeParamDecorator("Inject", ɵ0);
exports.Inject = Inject;
var Optional = makeParamDecorator("Optional");
exports.Optional = Optional;
var Self = makeParamDecorator("Self");
exports.Self = Self;
var SkipSelf = makeParamDecorator("SkipSelf");
exports.SkipSelf = SkipSelf;
var Host = makeParamDecorator("Host");
exports.Host = Host;
var ɵ1 = function (attributeName) {
  return {
    attributeName: attributeName
  };
};
exports.ɵ1 = ɵ1;
var Attribute = makeParamDecorator("Attribute", ɵ1);
exports.Attribute = Attribute;
var InjectFlags;
exports.InjectFlags = InjectFlags;
(function (InjectFlags) {
  InjectFlags[InjectFlags["Default"] = 0] = "Default";
  InjectFlags[InjectFlags["Host"] = 1] = "Host";
  InjectFlags[InjectFlags["Self"] = 2] = "Self";
  InjectFlags[InjectFlags["SkipSelf"] = 4] = "SkipSelf";
  InjectFlags[InjectFlags["Optional"] = 8] = "Optional";
})(InjectFlags || (InjectFlags = {}));
function getClosureSafeProperty(objWithPropertyToExtract) {
  for (var key in objWithPropertyToExtract) {
    if (objWithPropertyToExtract[key] === getClosureSafeProperty) {
      return key;
    }
  }
  throw Error("Could not find renamed property on target object.");
}
exports.ɵangular_packages_core_core_bn = getClosureSafeProperty;
function fillProperties(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key) && !target.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
}
function ɵɵdefineInjectable(opts) {
  return {
    token: opts.token,
    providedIn: opts.providedIn || null,
    factory: opts.factory,
    value: undefined
  };
}
exports.ɵɵdefineInjectable = ɵɵdefineInjectable;
var defineInjectable = ɵɵdefineInjectable;
exports.defineInjectable = defineInjectable;
function ɵɵdefineInjector(options) {
  return {
    factory: options.factory,
    providers: options.providers || [],
    imports: options.imports || []
  };
}
exports.ɵɵdefineInjector = ɵɵdefineInjector;
function getInjectableDef(type) {
  var def = type[NG_INJECTABLE_DEF];
  return def && def.token === type ? def : null;
}
exports.ɵgetInjectableDef = getInjectableDef;
function getInheritedInjectableDef(type) {
  if (type && type[NG_INJECTABLE_DEF]) {
    console.warn("DEPRECATED: DI is instantiating a token \"" + type.name + "\" that inherits its @Injectable decorator but does not provide one itself.\n" + ("This will become an error in v10. Please add @Injectable() to the \"" + type.name + "\" class."));
    return type[NG_INJECTABLE_DEF];
  } else {
    return null;
  }
}
function getInjectorDef(type) {
  return type && type.hasOwnProperty(NG_INJECTOR_DEF) ? type[NG_INJECTOR_DEF] : null;
}
var NG_INJECTABLE_DEF = getClosureSafeProperty({
  ngInjectableDef: getClosureSafeProperty
});
exports.ɵNG_INJECTABLE_DEF = NG_INJECTABLE_DEF;
var NG_INJECTOR_DEF = getClosureSafeProperty({
  ngInjectorDef: getClosureSafeProperty
});
exports.ɵNG_INJECTOR_DEF = NG_INJECTOR_DEF;
function stringify(token) {
  if (typeof token === "string") {
    return token;
  }
  if (token instanceof Array) {
    return "[" + token.map(stringify).join(", ") + "]";
  }
  if (token == null) {
    return "" + token;
  }
  if (token.overriddenName) {
    return "" + token.overriddenName;
  }
  if (token.name) {
    return "" + token.name;
  }
  var res = token.toString();
  if (res == null) {
    return "" + res;
  }
  var newLineIndex = res.indexOf("\n");
  return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}
exports.ɵstringify = stringify;
var __forward_ref__ = getClosureSafeProperty({
  __forward_ref__: getClosureSafeProperty
});
function forwardRef(forwardRefFn) {
  forwardRefFn.__forward_ref__ = forwardRef;
  forwardRefFn.toString = function () {
    return stringify(this());
  };
  return forwardRefFn;
}
exports.forwardRef = forwardRef;
function resolveForwardRef(type) {
  var fn = type;
  if (typeof fn === "function" && fn.hasOwnProperty(__forward_ref__) && fn.__forward_ref__ === forwardRef) {
    return fn();
  } else {
    return type;
  }
}
exports.resolveForwardRef = resolveForwardRef;
var __globalThis = typeof globalThis !== "undefined" && globalThis;
var __window = typeof window !== "undefined" && window;
var __self = typeof self !== "undefined" && typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && self;
var __global = typeof global !== "undefined" && global;
var _global = __globalThis || __global || __window || __self;
exports.ɵglobal = _global;
var R3ResolvedDependencyType;
(function (R3ResolvedDependencyType) {
  R3ResolvedDependencyType[R3ResolvedDependencyType["Token"] = 0] = "Token";
  R3ResolvedDependencyType[R3ResolvedDependencyType["Attribute"] = 1] = "Attribute";
  R3ResolvedDependencyType[R3ResolvedDependencyType["ChangeDetectorRef"] = 2] = "ChangeDetectorRef";
})(R3ResolvedDependencyType || (R3ResolvedDependencyType = {}));
function getCompilerFacade() {
  var globalNg = _global["ng"];
  if (!globalNg || !globalNg.ɵcompilerFacade) {
    throw new Error("Angular JIT compilation failed: '@angular/compiler' not loaded!\n" + "  - JIT compilation is discouraged for production use-cases! Consider AOT mode instead.\n" + "  - Did you bootstrap using '@angular/platform-browser-dynamic' or '@angular/platform-server'?\n" + "  - Alternatively provide the compiler with 'import \"@angular/compiler\";' before bootstrapping.");
  }
  return globalNg.ɵcompilerFacade;
}
var InjectionToken = (function () {
  function InjectionToken(_desc, options) {
    this._desc = _desc;
    this.ngMetadataName = "InjectionToken";
    this.ngInjectableDef = undefined;
    if (typeof options == "number") {
      this.__NG_ELEMENT_ID__ = options;
    } else if (options !== undefined) {
      this.ngInjectableDef = ɵɵdefineInjectable({
        token: this,
        providedIn: options.providedIn || "root",
        factory: options.factory
      });
    }
  }
  exports.InjectionToken = InjectionToken;
  InjectionToken.prototype.toString = function () {
    return "InjectionToken " + this._desc;
  };
  return InjectionToken;
})();
exports.InjectionToken = InjectionToken;
var INJECTOR = new InjectionToken("INJECTOR", -1);
exports.INJECTOR = INJECTOR;
var _THROW_IF_NOT_FOUND = new Object();
var THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
var NG_TEMP_TOKEN_PATH = "ngTempTokenPath";
var NG_TOKEN_PATH = "ngTokenPath";
var NEW_LINE = /\n/gm;
var NO_NEW_LINE = "ɵ";
var SOURCE = "__source";
var ɵ0$1 = getClosureSafeProperty;
var USE_VALUE = getClosureSafeProperty({
  provide: String,
  useValue: ɵ0$1
});
var _currentInjector = undefined;
function setCurrentInjector(injector) {
  var former = _currentInjector;
  _currentInjector = injector;
  return former;
}
exports.ɵsetCurrentInjector = setCurrentInjector;
var _injectImplementation;
function setInjectImplementation(impl) {
  var previous = _injectImplementation;
  _injectImplementation = impl;
  return previous;
}
function injectInjectorOnly(token, flags) {
  if (flags === void 0) {
    flags = InjectFlags.Default;
  }
  if (_currentInjector === undefined) {
    throw new Error("inject() must be called from an injection context");
  } else if (_currentInjector === null) {
    return injectRootLimpMode(token, undefined, flags);
  } else {
    return _currentInjector.get(token, flags & InjectFlags.Optional ? null : undefined, flags);
  }
}
exports.ɵangular_packages_core_core_a = injectInjectorOnly;
function ɵɵinject(token, flags) {
  if (flags === void 0) {
    flags = InjectFlags.Default;
  }
  return (_injectImplementation || injectInjectorOnly)(token, flags);
}
exports.ɵɵinject = ɵɵinject;
var inject = ɵɵinject;
exports.inject = inject;
function injectRootLimpMode(token, notFoundValue, flags) {
  var injectableDef = getInjectableDef(token);
  if (injectableDef && injectableDef.providedIn == "root") {
    return injectableDef.value === undefined ? injectableDef.value = injectableDef.factory() : injectableDef.value;
  }
  if (flags & InjectFlags.Optional) return null;
  if (notFoundValue !== undefined) return notFoundValue;
  throw new Error("Injector: NOT_FOUND [" + stringify(token) + "]");
}
function injectArgs(types) {
  var args = [];
  for (var i = 0; i < types.length; i++) {
    var arg = resolveForwardRef(types[i]);
    if (Array.isArray(arg)) {
      if (arg.length === 0) {
        throw new Error("Arguments array must have arguments.");
      }
      var type = undefined;
      var flags = InjectFlags.Default;
      for (var j = 0; j < arg.length; j++) {
        var meta = arg[j];
        if (meta instanceof Optional || meta.ngMetadataName === "Optional" || meta === Optional) {
          flags |= InjectFlags.Optional;
        } else if (meta instanceof SkipSelf || meta.ngMetadataName === "SkipSelf" || meta === SkipSelf) {
          flags |= InjectFlags.SkipSelf;
        } else if (meta instanceof Self || meta.ngMetadataName === "Self" || meta === Self) {
          flags |= InjectFlags.Self;
        } else if (meta instanceof Inject || meta === Inject) {
          type = meta.token;
        } else {
          type = meta;
        }
      }
      args.push(ɵɵinject(type, flags));
    } else {
      args.push(ɵɵinject(arg));
    }
  }
  return args;
}
var NullInjector = (function () {
  function NullInjector() {}
  exports.ɵangular_packages_core_core_b = NullInjector;
  NullInjector.prototype.get = function (token, notFoundValue) {
    if (notFoundValue === void 0) {
      notFoundValue = THROW_IF_NOT_FOUND;
    }
    if (notFoundValue === THROW_IF_NOT_FOUND) {
      var error = new Error("NullInjectorError: No provider for " + stringify(token) + "!");
      error.name = "NullInjectorError";
      throw error;
    }
    return notFoundValue;
  };
  return NullInjector;
})();
exports.ɵangular_packages_core_core_b = NullInjector;
function catchInjectorError(e, token, injectorErrorName, source) {
  var tokenPath = e[NG_TEMP_TOKEN_PATH];
  if (token[SOURCE]) {
    tokenPath.unshift(token[SOURCE]);
  }
  e.message = formatError("\n" + e.message, tokenPath, injectorErrorName, source);
  e[NG_TOKEN_PATH] = tokenPath;
  e[NG_TEMP_TOKEN_PATH] = null;
  throw e;
}
function formatError(text, obj, injectorErrorName, source) {
  if (source === void 0) {
    source = null;
  }
  text = text && text.charAt(0) === "\n" && text.charAt(1) == NO_NEW_LINE ? text.substr(2) : text;
  var context = stringify(obj);
  if (obj instanceof Array) {
    context = obj.map(stringify).join(" -> ");
  } else if (typeof obj === "object") {
    var parts = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var value = obj[key];
        parts.push(key + ":" + (typeof value === "string" ? JSON.stringify(value) : stringify(value)));
      }
    }
    context = "{" + parts.join(", ") + "}";
  }
  return "" + injectorErrorName + (source ? "(" + source + ")" : "") + "[" + context + "]: " + text.replace(NEW_LINE, "\n  ");
}
var angularCoreDiEnv = {
  "ɵɵdefineInjectable": ɵɵdefineInjectable,
  "ɵɵdefineInjector": ɵɵdefineInjector,
  "ɵɵinject": ɵɵinject,
  "ɵɵgetFactoryOf": getFactoryOf
};
function getFactoryOf(type) {
  var typeAny = type;
  var def = getInjectableDef(typeAny) || getInjectorDef(typeAny);
  if (!def || def.factory === undefined) {
    return null;
  }
  return def.factory;
}
var NgModuleRef = (function () {
  function NgModuleRef() {}
  exports.NgModuleRef = NgModuleRef;
  return NgModuleRef;
})();
exports.NgModuleRef = NgModuleRef;
var NgModuleFactory = (function () {
  function NgModuleFactory() {}
  exports.NgModuleFactory = NgModuleFactory;
  return NgModuleFactory;
})();
exports.NgModuleFactory = NgModuleFactory;
function addAllToArray(items, arr) {
  for (var i = 0; i < items.length; i++) {
    arr.push(items[i]);
  }
}
function flatten(list, dst) {
  if (dst === undefined) dst = list;
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    if (Array.isArray(item)) {
      if (dst === list) {
        dst = list.slice(0, i);
      }
      flatten(item, dst);
    } else if (dst !== list) {
      dst.push(item);
    }
  }
  return dst;
}
function deepForEach(input, fn) {
  input.forEach(function (value) {
    return Array.isArray(value) ? deepForEach(value, fn) : fn(value);
  });
}
function addToArray(arr, index, value) {
  if (index >= arr.length) {
    arr.push(value);
  } else {
    arr.splice(index, 0, value);
  }
}
function removeFromArray(arr, index) {
  if (index >= arr.length - 1) {
    return arr.pop();
  } else {
    return arr.splice(index, 1)[0];
  }
}
function assertNumber(actual, msg) {
  if (typeof actual != "number") {
    throwError(msg);
  }
}
function assertEqual(actual, expected, msg) {
  if (actual != expected) {
    throwError(msg);
  }
}
function assertNotEqual(actual, expected, msg) {
  if (actual == expected) {
    throwError(msg);
  }
}
function assertSame(actual, expected, msg) {
  if (actual !== expected) {
    throwError(msg);
  }
}
function assertNotSame(actual, expected, msg) {
  if (actual === expected) {
    throwError(msg);
  }
}
function assertLessThan(actual, expected, msg) {
  if (actual >= expected) {
    throwError(msg);
  }
}
function assertGreaterThan(actual, expected, msg) {
  if (actual <= expected) {
    throwError(msg);
  }
}
function assertNotDefined(actual, msg) {
  if (actual != null) {
    throwError(msg);
  }
}
function assertDefined(actual, msg) {
  if (actual == null) {
    throwError(msg);
  }
}
function throwError(msg) {
  debugger;

  throw new Error("ASSERTION ERROR: " + msg);
}
function assertDomNode(node) {
  assertEqual(typeof Node !== "undefined" && node instanceof Node || typeof node === "object" && node != null && node.constructor.name === "WebWorkerRenderNode", true, "The provided value must be an instance of a DOM Node but got " + stringify(node));
}
function assertDataInRange(arr, index) {
  var maxLen = arr ? arr.length : 0;
  assertLessThan(index, maxLen, "Index expected to be less than " + maxLen + " but got " + index);
}
function ngDevModeResetPerfCounters() {
  var locationString = typeof location !== "undefined" ? location.toString() : "";
  var newCounters = {
    namedConstructors: locationString.indexOf("ngDevMode=namedConstructors") != -1,
    firstTemplatePass: 0,
    tNode: 0,
    tView: 0,
    rendererCreateTextNode: 0,
    rendererSetText: 0,
    rendererCreateElement: 0,
    rendererAddEventListener: 0,
    rendererSetAttribute: 0,
    rendererRemoveAttribute: 0,
    rendererSetProperty: 0,
    rendererSetClassName: 0,
    rendererAddClass: 0,
    rendererRemoveClass: 0,
    rendererSetStyle: 0,
    rendererRemoveStyle: 0,
    rendererDestroy: 0,
    rendererDestroyNode: 0,
    rendererMoveNode: 0,
    rendererRemoveNode: 0,
    rendererAppendChild: 0,
    rendererInsertBefore: 0,
    rendererCreateComment: 0,
    styleMap: 0,
    styleMapCacheMiss: 0,
    classMap: 0,
    classMapCacheMiss: 0,
    styleProp: 0,
    stylePropCacheMiss: 0,
    classProp: 0,
    classPropCacheMiss: 0,
    flushStyling: 0,
    classesApplied: 0,
    stylesApplied: 0,
    stylingWritePersistedState: 0,
    stylingReadPersistedState: 0
  };
  var allowNgDevModeTrue = locationString.indexOf("ngDevMode=false") === -1;
  _global["ngDevMode"] = allowNgDevModeTrue && newCounters;
  return newCounters;
}
if (typeof ngDevMode === "undefined" || ngDevMode) {
  ngDevModeResetPerfCounters();
}
var ChangeDetectionStrategy;
exports.ChangeDetectionStrategy = ChangeDetectionStrategy;
(function (ChangeDetectionStrategy) {
  ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
  ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
})(ChangeDetectionStrategy || (ChangeDetectionStrategy = {}));
var ChangeDetectorStatus;
exports.ɵChangeDetectorStatus = ChangeDetectorStatus;
(function (ChangeDetectorStatus) {
  ChangeDetectorStatus[ChangeDetectorStatus["CheckOnce"] = 0] = "CheckOnce";
  ChangeDetectorStatus[ChangeDetectorStatus["Checked"] = 1] = "Checked";
  ChangeDetectorStatus[ChangeDetectorStatus["CheckAlways"] = 2] = "CheckAlways";
  ChangeDetectorStatus[ChangeDetectorStatus["Detached"] = 3] = "Detached";
  ChangeDetectorStatus[ChangeDetectorStatus["Errored"] = 4] = "Errored";
  ChangeDetectorStatus[ChangeDetectorStatus["Destroyed"] = 5] = "Destroyed";
})(ChangeDetectorStatus || (ChangeDetectorStatus = {}));
function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
  return changeDetectionStrategy == null || changeDetectionStrategy === ChangeDetectionStrategy.Default;
}
exports.ɵisDefaultChangeDetectionStrategy = isDefaultChangeDetectionStrategy;
var ViewEncapsulation;
exports.ViewEncapsulation = ViewEncapsulation;
(function (ViewEncapsulation) {
  ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
  ViewEncapsulation[ViewEncapsulation["Native"] = 1] = "Native";
  ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
  ViewEncapsulation[ViewEncapsulation["ShadowDom"] = 3] = "ShadowDom";
})(ViewEncapsulation || (ViewEncapsulation = {}));
function noSideEffects(fn) {
  return "" + ({
    toString: fn
  });
}
exports.ɵangular_packages_core_core_bk = noSideEffects;
var EMPTY_OBJ = {};
var EMPTY_ARRAY = [];
if (typeof ngDevMode !== "undefined" && ngDevMode) {
  Object.freeze(EMPTY_OBJ);
  Object.freeze(EMPTY_ARRAY);
}
var NG_COMPONENT_DEF = getClosureSafeProperty({
  ngComponentDef: getClosureSafeProperty
});
exports.ɵNG_COMPONENT_DEF = NG_COMPONENT_DEF;
var NG_DIRECTIVE_DEF = getClosureSafeProperty({
  ngDirectiveDef: getClosureSafeProperty
});
exports.ɵNG_DIRECTIVE_DEF = NG_DIRECTIVE_DEF;
var NG_PIPE_DEF = getClosureSafeProperty({
  ngPipeDef: getClosureSafeProperty
});
exports.ɵNG_PIPE_DEF = NG_PIPE_DEF;
var NG_MODULE_DEF = getClosureSafeProperty({
  ngModuleDef: getClosureSafeProperty
});
exports.ɵNG_MODULE_DEF = NG_MODULE_DEF;
var NG_LOCALE_ID_DEF = getClosureSafeProperty({
  ngLocaleIdDef: getClosureSafeProperty
});
var NG_BASE_DEF = getClosureSafeProperty({
  ngBaseDef: getClosureSafeProperty
});
exports.ɵNG_BASE_DEF = NG_BASE_DEF;
var NG_ELEMENT_ID = getClosureSafeProperty({
  __NG_ELEMENT_ID__: getClosureSafeProperty
});
exports.ɵNG_ELEMENT_ID = NG_ELEMENT_ID;
var _renderCompCount = 0;
function ɵɵdefineComponent(componentDefinition) {
  var type = componentDefinition.type;
  var typePrototype = type.prototype;
  var declaredInputs = {};
  var def = {
    type: type,
    providersResolver: null,
    consts: componentDefinition.consts,
    vars: componentDefinition.vars,
    factory: componentDefinition.factory,
    template: componentDefinition.template || null,
    ngContentSelectors: componentDefinition.ngContentSelectors,
    hostBindings: componentDefinition.hostBindings || null,
    contentQueries: componentDefinition.contentQueries || null,
    declaredInputs: declaredInputs,
    inputs: null,
    outputs: null,
    exportAs: componentDefinition.exportAs || null,
    onChanges: null,
    onInit: typePrototype.ngOnInit || null,
    doCheck: typePrototype.ngDoCheck || null,
    afterContentInit: typePrototype.ngAfterContentInit || null,
    afterContentChecked: typePrototype.ngAfterContentChecked || null,
    afterViewInit: typePrototype.ngAfterViewInit || null,
    afterViewChecked: typePrototype.ngAfterViewChecked || null,
    onDestroy: typePrototype.ngOnDestroy || null,
    onPush: componentDefinition.changeDetection === ChangeDetectionStrategy.OnPush,
    directiveDefs: null,
    pipeDefs: null,
    selectors: componentDefinition.selectors,
    viewQuery: componentDefinition.viewQuery || null,
    features: componentDefinition.features || null,
    data: componentDefinition.data || ({}),
    encapsulation: componentDefinition.encapsulation || ViewEncapsulation.Emulated,
    id: "c",
    styles: componentDefinition.styles || EMPTY_ARRAY,
    _: null,
    setInput: null,
    schemas: componentDefinition.schemas || null,
    tView: null
  };
  def._ = noSideEffects(function () {
    var directiveTypes = componentDefinition.directives;
    var feature = componentDefinition.features;
    var pipeTypes = componentDefinition.pipes;
    def.id += _renderCompCount++;
    (def.inputs = invertObject(componentDefinition.inputs, declaredInputs), def.outputs = invertObject(componentDefinition.outputs), feature && feature.forEach(function (fn) {
      return fn(def);
    }));
    def.directiveDefs = directiveTypes ? function () {
      return (typeof directiveTypes === "function" ? directiveTypes() : directiveTypes).map(extractDirectiveDef);
    } : null;
    def.pipeDefs = pipeTypes ? function () {
      return (typeof pipeTypes === "function" ? pipeTypes() : pipeTypes).map(extractPipeDef);
    } : null;
    if (!type.hasOwnProperty(NG_INJECTABLE_DEF)) {
      type[NG_INJECTABLE_DEF] = ɵɵdefineInjectable({
        token: type,
        factory: componentDefinition.factory
      });
    }
  });
  return def;
}
exports.ɵɵdefineComponent = ɵɵdefineComponent;
function ɵɵsetComponentScope(type, directives, pipes) {
  var def = type.ngComponentDef;
  def.directiveDefs = function () {
    return directives.map(extractDirectiveDef);
  };
  def.pipeDefs = function () {
    return pipes.map(extractPipeDef);
  };
}
exports.ɵɵsetComponentScope = ɵɵsetComponentScope;
function extractDirectiveDef(type) {
  var def = getComponentDef(type) || getDirectiveDef(type);
  if (ngDevMode && !def) {
    throw new Error("'" + type.name + "' is neither 'ComponentType' or 'DirectiveType'.");
  }
  return def;
}
function extractPipeDef(type) {
  var def = getPipeDef(type);
  if (ngDevMode && !def) {
    throw new Error("'" + type.name + "' is not a 'PipeType'.");
  }
  return def;
}
function ɵɵdefineNgModule(def) {
  var res = {
    type: def.type,
    bootstrap: def.bootstrap || EMPTY_ARRAY,
    declarations: def.declarations || EMPTY_ARRAY,
    imports: def.imports || EMPTY_ARRAY,
    exports: def.exports || EMPTY_ARRAY,
    transitiveCompileScopes: null,
    schemas: def.schemas || null,
    id: def.id || null
  };
  return res;
}
exports.ɵɵdefineNgModule = ɵɵdefineNgModule;
function ɵɵsetNgModuleScope(type, scope) {
  return noSideEffects(function () {
    var ngModuleDef = getNgModuleDef(type, true);
    ngModuleDef.declarations = scope.declarations || EMPTY_ARRAY;
    ngModuleDef.imports = scope.imports || EMPTY_ARRAY;
    ngModuleDef.exports = scope.exports || EMPTY_ARRAY;
  });
}
exports.ɵɵsetNgModuleScope = ɵɵsetNgModuleScope;
function invertObject(obj, secondary) {
  if (obj == null) return EMPTY_OBJ;
  var newLookup = {};
  for (var minifiedKey in obj) {
    if (obj.hasOwnProperty(minifiedKey)) {
      var publicName = obj[minifiedKey];
      var declaredName = publicName;
      if (Array.isArray(publicName)) {
        declaredName = publicName[1];
        publicName = publicName[0];
      }
      newLookup[publicName] = minifiedKey;
      if (secondary) {
        secondary[publicName] = declaredName;
      }
    }
  }
  return newLookup;
}
function ɵɵdefineBase(baseDefinition) {
  var declaredInputs = {};
  return {
    inputs: invertObject(baseDefinition.inputs, declaredInputs),
    declaredInputs: declaredInputs,
    outputs: invertObject(baseDefinition.outputs),
    viewQuery: baseDefinition.viewQuery || null,
    contentQueries: baseDefinition.contentQueries || null,
    hostBindings: baseDefinition.hostBindings || null
  };
}
exports.ɵɵdefineBase = ɵɵdefineBase;
var ɵɵdefineDirective = ɵɵdefineComponent;
exports.ɵɵdefineDirective = ɵɵdefineDirective;
function ɵɵdefinePipe(pipeDef) {
  return {
    name: pipeDef.name,
    factory: pipeDef.factory,
    pure: pipeDef.pure !== false,
    onDestroy: pipeDef.type.prototype.ngOnDestroy || null
  };
}
exports.ɵɵdefinePipe = ɵɵdefinePipe;
function getComponentDef(type) {
  return type[NG_COMPONENT_DEF] || null;
}
function getDirectiveDef(type) {
  return type[NG_DIRECTIVE_DEF] || null;
}
function getPipeDef(type) {
  return type[NG_PIPE_DEF] || null;
}
function getBaseDef(type) {
  return type[NG_BASE_DEF] || null;
}
function getNgModuleDef(type, throwNotFound) {
  var ngModuleDef = type[NG_MODULE_DEF] || null;
  if (!ngModuleDef && throwNotFound === true) {
    throw new Error("Type " + stringify(type) + " does not have 'ngModuleDef' property.");
  }
  return ngModuleDef;
}
function getNgLocaleIdDef(type) {
  return type[NG_LOCALE_ID_DEF] || null;
}
var HOST = 0;
var TVIEW = 1;
var FLAGS = 2;
var PARENT = 3;
var NEXT = 4;
var QUERIES = 5;
var T_HOST = 6;
var BINDING_INDEX = 7;
var CLEANUP = 8;
var CONTEXT = 9;
var INJECTOR$1 = 10;
var RENDERER_FACTORY = 11;
var RENDERER = 12;
var SANITIZER = 13;
var CHILD_HEAD = 14;
var CHILD_TAIL = 15;
var DECLARATION_VIEW = 16;
var DECLARATION_LCONTAINER = 17;
var PREORDER_HOOK_FLAGS = 18;
var HEADER_OFFSET = 19;
var unusedValueExportToPlacateAjd = 1;
var TYPE = 1;
var ACTIVE_INDEX = 2;
var MOVED_VIEWS = 5;
var NATIVE = 7;
var VIEW_REFS = 8;
var CONTAINER_HEADER_OFFSET = 9;
var unusedValueExportToPlacateAjd$1 = 1;
function isLView(value) {
  return Array.isArray(value) && typeof value[TYPE] === "object";
}
function isLContainer(value) {
  return Array.isArray(value) && value[TYPE] === true;
}
function isContentQueryHost(tNode) {
  return (tNode.flags & 4) !== 0;
}
function isComponent(tNode) {
  return (tNode.flags & 1) === 1;
}
function isComponentDef(def) {
  return def.template !== null;
}
function isRootView(target) {
  return (target[FLAGS] & 512) !== 0;
}
function assertTNodeForLView(tNode, lView) {
  tNode.hasOwnProperty("tView_") && assertEqual(tNode.tView_, lView[TVIEW], "This TNode does not belong to this LView.");
}
function assertComponentType(actual, msg) {
  if (msg === void 0) {
    msg = "Type passed in is not ComponentType, it does not have 'ngComponentDef' property.";
  }
  if (!getComponentDef(actual)) {
    throwError(msg);
  }
}
function assertNgModuleType(actual, msg) {
  if (msg === void 0) {
    msg = "Type passed in is not NgModuleType, it does not have 'ngModuleDef' property.";
  }
  if (!getNgModuleDef(actual)) {
    throwError(msg);
  }
}
function assertPreviousIsParent(isParent) {
  assertEqual(isParent, true, "previousOrParentTNode should be a parent");
}
function assertHasParent(tNode) {
  assertDefined(tNode, "previousOrParentTNode should exist!");
  assertDefined(tNode.parent, "previousOrParentTNode should have a parent");
}
function assertDataNext(lView, index, arr) {
  if (arr == null) arr = lView;
  assertEqual(arr.length, index, "index " + index + " expected to be at the end of arr (length " + arr.length + ")");
}
function assertLContainerOrUndefined(value) {
  value && assertEqual(isLContainer(value), true, "Expecting LContainer or undefined or null");
}
function assertLContainer(value) {
  assertDefined(value, "LContainer must be defined");
  assertEqual(isLContainer(value), true, "Expecting LContainer");
}
function assertLViewOrUndefined(value) {
  value && assertEqual(isLView(value), true, "Expecting LView or undefined or null");
}
function assertLView(value) {
  assertDefined(value, "LView must be defined");
  assertEqual(isLView(value), true, "Expecting LView");
}
function assertFirstTemplatePass(tView, errMessage) {
  assertEqual(tView.firstTemplatePass, true, errMessage);
}
var TNODE = 8;
var PARENT_INJECTOR = 8;
var INJECTOR_BLOOM_PARENT_SIZE = 9;
var NO_PARENT_INJECTOR = -1;
var NodeInjectorFactory = (function () {
  function NodeInjectorFactory(factory, isViewProvider, injectImplementation) {
    this.factory = factory;
    this.resolving = false;
    this.canSeeViewProviders = isViewProvider;
    this.injectImpl = injectImplementation;
  }
  return NodeInjectorFactory;
})();
function isFactory(obj) {
  return obj !== null && typeof obj == "object" && Object.getPrototypeOf(obj) == NodeInjectorFactory.prototype;
}
var unusedValueExportToPlacateAjd$2 = 1;
function assertNodeType(tNode, type) {
  assertDefined(tNode, "should be called with a TNode");
  assertEqual(tNode.type, type, "should be a " + typeName(type));
}
function assertNodeOfPossibleTypes(tNode) {
  var types = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    types[_i - 1] = arguments[_i];
  }
  assertDefined(tNode, "should be called with a TNode");
  var found = types.some(function (type) {
    return tNode.type === type;
  });
  assertEqual(found, true, "Should be one of " + types.map(typeName).join(", ") + " but got " + typeName(tNode.type));
}
function typeName(type) {
  if (type == 1) return "Projection";
  if (type == 0) return "Container";
  if (type == 2) return "View";
  if (type == 3) return "Element";
  if (type == 4) return "ElementContainer";
  return "<unknown>";
}
function registerPreOrderHooks(directiveIndex, directiveDef, tView, nodeIndex, initialPreOrderHooksLength, initialPreOrderCheckHooksLength) {
  ngDevMode && assertEqual(tView.firstTemplatePass, true, "Should only be called on first template pass");
  var onChanges = directiveDef.onChanges, onInit = directiveDef.onInit, doCheck = directiveDef.doCheck;
  if (initialPreOrderHooksLength >= 0 && (!tView.preOrderHooks || initialPreOrderHooksLength === tView.preOrderHooks.length) && (onChanges || onInit || doCheck)) {
    (tView.preOrderHooks || (tView.preOrderHooks = [])).push(nodeIndex);
  }
  if (initialPreOrderCheckHooksLength >= 0 && (!tView.preOrderCheckHooks || initialPreOrderCheckHooksLength === tView.preOrderCheckHooks.length) && (onChanges || doCheck)) {
    (tView.preOrderCheckHooks || (tView.preOrderCheckHooks = [])).push(nodeIndex);
  }
  if (onChanges) {
    (tView.preOrderHooks || (tView.preOrderHooks = [])).push(directiveIndex, onChanges);
    (tView.preOrderCheckHooks || (tView.preOrderCheckHooks = [])).push(directiveIndex, onChanges);
  }
  if (onInit) {
    (tView.preOrderHooks || (tView.preOrderHooks = [])).push(-directiveIndex, onInit);
  }
  if (doCheck) {
    (tView.preOrderHooks || (tView.preOrderHooks = [])).push(directiveIndex, doCheck);
    (tView.preOrderCheckHooks || (tView.preOrderCheckHooks = [])).push(directiveIndex, doCheck);
  }
}
function registerPostOrderHooks(tView, tNode) {
  if (tView.firstTemplatePass) {
    for (var i = tNode.directiveStart, end = tNode.directiveEnd; i < end; i++) {
      var directiveDef = tView.data[i];
      exports.ɵdid = directiveDef;
      if (directiveDef.afterContentInit) {
        (tView.contentHooks || (tView.contentHooks = [])).push(-i, directiveDef.afterContentInit);
      }
      if (directiveDef.afterContentChecked) {
        (tView.contentHooks || (tView.contentHooks = [])).push(i, directiveDef.afterContentChecked);
        (tView.contentCheckHooks || (tView.contentCheckHooks = [])).push(i, directiveDef.afterContentChecked);
      }
      if (directiveDef.afterViewInit) {
        (tView.viewHooks || (tView.viewHooks = [])).push(-i, directiveDef.afterViewInit);
      }
      if (directiveDef.afterViewChecked) {
        (tView.viewHooks || (tView.viewHooks = [])).push(i, directiveDef.afterViewChecked);
        (tView.viewCheckHooks || (tView.viewCheckHooks = [])).push(i, directiveDef.afterViewChecked);
      }
      if (directiveDef.onDestroy != null) {
        (tView.destroyHooks || (tView.destroyHooks = [])).push(i, directiveDef.onDestroy);
      }
    }
  }
}
function executePreOrderHooks(currentView, tView, checkNoChangesMode, currentNodeIndex) {
  if (!checkNoChangesMode) {
    executeHooks(currentView, tView.preOrderHooks, tView.preOrderCheckHooks, checkNoChangesMode, 0, currentNodeIndex !== undefined ? currentNodeIndex : null);
  }
}
function executeHooks(currentView, firstPassHooks, checkHooks, checkNoChangesMode, initPhaseState, currentNodeIndex) {
  if (checkNoChangesMode) return;
  var hooksToCall = (currentView[FLAGS] & 3) === initPhaseState ? firstPassHooks : checkHooks;
  if (hooksToCall) {
    callHooks(currentView, hooksToCall, initPhaseState, currentNodeIndex);
  }
  if (currentNodeIndex == null && (currentView[FLAGS] & 3) === initPhaseState && initPhaseState !== 3) {
    currentView[FLAGS] &= 1023;
    currentView[FLAGS] += 1;
  }
}
function callHooks(currentView, arr, initPhase, currentNodeIndex) {
  var startIndex = currentNodeIndex !== undefined ? currentView[PREORDER_HOOK_FLAGS] & 65535 : 0;
  var nodeIndexLimit = currentNodeIndex != null ? currentNodeIndex : -1;
  var lastNodeIndexFound = 0;
  for (var i = startIndex; i < arr.length; i++) {
    var hook = arr[i + 1];
    if (typeof hook === "number") {
      lastNodeIndexFound = arr[i];
      if (currentNodeIndex != null && lastNodeIndexFound >= currentNodeIndex) {
        break;
      }
    } else {
      var isInitHook = arr[i] < 0;
      if (isInitHook) currentView[PREORDER_HOOK_FLAGS] += 65536;
      if (lastNodeIndexFound < nodeIndexLimit || nodeIndexLimit == -1) {
        callHook(currentView, initPhase, arr, i);
        currentView[PREORDER_HOOK_FLAGS] = (currentView[PREORDER_HOOK_FLAGS] & 4294901760) + i + 2;
      }
      i++;
    }
  }
}
function callHook(currentView, initPhase, arr, i) {
  var isInitHook = arr[i] < 0;
  var hook = arr[i + 1];
  var directiveIndex = isInitHook ? -arr[i] : arr[i];
  var directive = currentView[directiveIndex];
  if (isInitHook) {
    var indexWithintInitPhase = currentView[FLAGS] >> 10;
    if (indexWithintInitPhase < currentView[PREORDER_HOOK_FLAGS] >> 16 && (currentView[FLAGS] & 3) === initPhase) {
      currentView[FLAGS] += 1024;
      hook.call(directive);
    }
  } else {
    hook.call(directive);
  }
}
var _stylingState = null;
var _stateStorage = new Map();
var _stylingElement = null;
var STYLING_INDEX_START_VALUE = 1;
var BIT_MASK_START_VALUE = 0;
function getStylingState(element, readFromMap) {
  if (!_stylingElement || element !== _stylingElement) {
    _stylingElement = element;
    if (readFromMap) {
      _stylingState = _stateStorage.get(element) || null;
      ngDevMode && ngDevMode.stylingReadPersistedState++;
    }
    _stylingState = _stylingState || ({
      classesBitMask: BIT_MASK_START_VALUE,
      classesIndex: STYLING_INDEX_START_VALUE,
      stylesBitMask: BIT_MASK_START_VALUE,
      stylesIndex: STYLING_INDEX_START_VALUE
    });
  }
  return _stylingState;
}
function resetStylingState() {
  _stylingState = null;
  _stylingElement = null;
}
function storeStylingState(element, state) {
  ngDevMode && ngDevMode.stylingWritePersistedState++;
  _stateStorage.set(element, state);
}
function deleteStylingStateFromStorage(element) {
  _stateStorage.delete(element);
}
function resetAllStylingState() {
  resetStylingState();
  _stateStorage.clear();
}
var MONKEY_PATCH_KEY_NAME = "__ngContext__";
function unwrapRNode(value) {
  while (Array.isArray(value)) {
    value = value[HOST];
  }
  return value;
}
function unwrapLView(value) {
  while (Array.isArray(value)) {
    if (typeof value[TYPE] === "object") return value;
    value = value[HOST];
  }
  return null;
}
function unwrapLContainer(value) {
  while (Array.isArray(value)) {
    if (value[TYPE] === true) return value;
    value = value[HOST];
  }
  return null;
}
function getNativeByIndex(index, lView) {
  return unwrapRNode(lView[index + HEADER_OFFSET]);
}
function getNativeByTNode(tNode, lView) {
  ngDevMode && assertTNodeForLView(tNode, lView);
  ngDevMode && assertDataInRange(lView, tNode.index);
  var node = unwrapRNode(lView[tNode.index]);
  ngDevMode && assertDomNode(node);
  return node;
}
function getNativeByTNodeOrNull(tNode, lView) {
  ngDevMode && assertTNodeForLView(tNode, lView);
  var index = tNode.index;
  var node = index == -1 ? null : unwrapRNode(lView[index]);
  ngDevMode && node !== null && assertDomNode(node);
  return node;
}
function hasDirectives(tNode) {
  return tNode.directiveEnd > tNode.directiveStart;
}
function getTNode(index, view) {
  ngDevMode && assertGreaterThan(index, -1, "wrong index for TNode");
  ngDevMode && assertLessThan(index, view[TVIEW].data.length, "wrong index for TNode");
  return view[TVIEW].data[index + HEADER_OFFSET];
}
function loadInternal(view, index) {
  ngDevMode && assertDataInRange(view, index + HEADER_OFFSET);
  return view[index + HEADER_OFFSET];
}
exports.ɵangular_packages_core_core_bl = loadInternal;
function getComponentViewByIndex(nodeIndex, hostView) {
  var slotValue = hostView[nodeIndex];
  var lView = isLView(slotValue) ? slotValue : slotValue[HOST];
  return lView;
}
function readPatchedData(target) {
  ngDevMode && assertDefined(target, "Target expected");
  return target[MONKEY_PATCH_KEY_NAME];
}
function readPatchedLView(target) {
  var value = readPatchedData(target);
  if (value) {
    return Array.isArray(value) ? value : value.lView;
  }
  return null;
}
function viewAttachedToChangeDetector(view) {
  return (view[FLAGS] & 128) === 128;
}
function viewAttachedToContainer(view) {
  return isLContainer(view[PARENT]);
}
function resetPreOrderHookFlags(lView) {
  lView[PREORDER_HOOK_FLAGS] = 0;
}
var elementDepthCount;
function getElementDepthCount() {
  return elementDepthCount;
}
function increaseElementDepthCount() {
  elementDepthCount++;
}
function decreaseElementDepthCount() {
  elementDepthCount--;
}
var currentDirectiveDef = null;
function getCurrentDirectiveDef() {
  return currentDirectiveDef;
}
function setCurrentDirectiveDef(def) {
  currentDirectiveDef = def;
}
var bindingsEnabled;
function getBindingsEnabled() {
  return bindingsEnabled;
}
function ɵɵenableBindings() {
  bindingsEnabled = true;
}
exports.ɵɵenableBindings = ɵɵenableBindings;
function ɵɵdisableBindings() {
  bindingsEnabled = false;
}
exports.ɵɵdisableBindings = ɵɵdisableBindings;
function getLView() {
  return lView;
}
exports.ɵangular_packages_core_core_bc = getLView;
var MIN_DIRECTIVE_ID = 1;
var activeDirectiveId = MIN_DIRECTIVE_ID;
var activeDirectiveSuperClassDepthPosition = 0;
var activeDirectiveSuperClassHeight = 0;
function setActiveHostElement(elementIndex) {
  if (elementIndex === void 0) {
    elementIndex = null;
  }
  if (_selectedIndex !== elementIndex) {
    setSelectedIndex(elementIndex == null ? -1 : elementIndex);
    activeDirectiveId = elementIndex == null ? 0 : MIN_DIRECTIVE_ID;
    activeDirectiveSuperClassDepthPosition = 0;
    activeDirectiveSuperClassHeight = 0;
  }
}
function getActiveDirectiveId() {
  return activeDirectiveId;
}
function incrementActiveDirectiveId() {
  activeDirectiveId += 1 + activeDirectiveSuperClassHeight;
  activeDirectiveSuperClassDepthPosition = 0;
  activeDirectiveSuperClassHeight = 0;
}
function adjustActiveDirectiveSuperClassDepthPosition(delta) {
  activeDirectiveSuperClassDepthPosition += delta;
  activeDirectiveSuperClassHeight = Math.max(activeDirectiveSuperClassHeight, activeDirectiveSuperClassDepthPosition);
}
function getActiveDirectiveSuperClassHeight() {
  return activeDirectiveSuperClassHeight;
}
function getActiveDirectiveSuperClassDepth() {
  return activeDirectiveSuperClassDepthPosition;
}
function ɵɵrestoreView(viewToRestore) {
  contextLView = viewToRestore;
}
exports.ɵɵrestoreView = ɵɵrestoreView;
var previousOrParentTNode;
function getPreviousOrParentTNode() {
  return previousOrParentTNode;
}
exports.ɵangular_packages_core_core_bd = getPreviousOrParentTNode;
function setPreviousOrParentTNode(tNode, _isParent) {
  previousOrParentTNode = tNode;
  isParent = _isParent;
}
function setTNodeAndViewData(tNode, view) {
  ngDevMode && assertLViewOrUndefined(view);
  previousOrParentTNode = tNode;
  lView = view;
}
var isParent;
function getIsParent() {
  return isParent;
}
function setIsNotParent() {
  isParent = false;
}
function setIsParent() {
  isParent = true;
}
function isCreationMode(view) {
  if (view === void 0) {
    view = lView;
  }
  return (view[FLAGS] & 4) === 4;
}
var lView;
var contextLView = null;
function getContextLView() {
  return contextLView;
}
var checkNoChangesMode = false;
function getCheckNoChangesMode() {
  return checkNoChangesMode;
}
function setCheckNoChangesMode(mode) {
  checkNoChangesMode = mode;
}
var bindingRootIndex = -1;
function getBindingRoot() {
  return bindingRootIndex;
}
function setBindingRoot(value) {
  bindingRootIndex = value;
}
var currentQueryIndex = 0;
function getCurrentQueryIndex() {
  return currentQueryIndex;
}
function setCurrentQueryIndex(value) {
  currentQueryIndex = value;
}
function enterView(newView, hostTNode) {
  ngDevMode && assertLViewOrUndefined(newView);
  var oldView = lView;
  if (newView) {
    var tView = newView[TVIEW];
    bindingRootIndex = tView.bindingStartIndex;
  }
  previousOrParentTNode = hostTNode;
  isParent = true;
  lView = contextLView = newView;
  return oldView;
}
function nextContextImpl(level) {
  if (level === void 0) {
    level = 1;
  }
  contextLView = walkUpViews(level, contextLView);
  return contextLView[CONTEXT];
}
exports.ɵangular_packages_core_core_be = nextContextImpl;
function walkUpViews(nestingLevel, currentView) {
  while (nestingLevel > 0) {
    ngDevMode && assertDefined(currentView[DECLARATION_VIEW], "Declaration view should be defined if nesting level is greater than 0.");
    currentView = currentView[DECLARATION_VIEW];
    nestingLevel--;
  }
  return currentView;
}
function resetComponentState() {
  isParent = false;
  previousOrParentTNode = null;
  elementDepthCount = 0;
  bindingsEnabled = true;
  setCurrentStyleSanitizer(null);
  resetAllStylingState();
}
function leaveView(newView, safeToRunHooks) {
  var tView = lView[TVIEW];
  if (isCreationMode(lView)) {
    lView[FLAGS] &= ~4;
  } else {
    try {
      resetPreOrderHookFlags(lView);
      safeToRunHooks && executeHooks(lView, tView.viewHooks, tView.viewCheckHooks, checkNoChangesMode, 2, undefined);
    } finally {
      lView[FLAGS] &= ~(64 | 8);
      lView[BINDING_INDEX] = tView.bindingStartIndex;
    }
  }
  enterView(newView, null);
}
var _selectedIndex = -1;
function getSelectedIndex() {
  return _selectedIndex;
}
function setSelectedIndex(index) {
  _selectedIndex = index;
  resetStylingState();
}
var _currentNamespace = null;
function ɵɵnamespaceSVG() {
  _currentNamespace = "http://www.w3.org/2000/svg";
}
exports.ɵɵnamespaceSVG = ɵɵnamespaceSVG;
function ɵɵnamespaceMathML() {
  _currentNamespace = "http://www.w3.org/1998/MathML/";
}
exports.ɵɵnamespaceMathML = ɵɵnamespaceMathML;
function ɵɵnamespaceHTML() {
  namespaceHTMLInternal();
}
exports.ɵɵnamespaceHTML = ɵɵnamespaceHTML;
function namespaceHTMLInternal() {
  _currentNamespace = null;
}
function getNamespace() {
  return _currentNamespace;
}
var _currentSanitizer;
function setCurrentStyleSanitizer(sanitizer) {
  _currentSanitizer = sanitizer;
}
function getCurrentStyleSanitizer() {
  return _currentSanitizer;
}
function isDifferent(a, b) {
  return !(a !== a && b !== b) && a !== b;
}
function renderStringify(value) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return "" + value;
}
function stringifyForError(value) {
  if (typeof value === "function") return value.name || value.toString();
  if (typeof value === "object" && value != null && typeof value.type === "function") {
    return value.type.name || value.type.toString();
  }
  return renderStringify(value);
}
var ɵ0$2 = function () {
  return (typeof requestAnimationFrame !== "undefined" && requestAnimationFrame || setTimeout).bind(_global);
};
var defaultScheduler = ɵ0$2();
function ɵɵresolveWindow(element) {
  return {
    name: "window",
    target: element.ownerDocument.defaultView
  };
}
exports.ɵɵresolveWindow = ɵɵresolveWindow;
function ɵɵresolveDocument(element) {
  return {
    name: "document",
    target: element.ownerDocument
  };
}
exports.ɵɵresolveDocument = ɵɵresolveDocument;
function ɵɵresolveBody(element) {
  return {
    name: "body",
    target: element.ownerDocument.body
  };
}
exports.ɵɵresolveBody = ɵɵresolveBody;
var INTERPOLATION_DELIMITER = "�";
function isPropMetadataString(str) {
  return str.indexOf(INTERPOLATION_DELIMITER) >= 0;
}
function maybeUnwrapFn(value) {
  if (value instanceof Function) {
    return value();
  } else {
    return value;
  }
}
var MAP_BASED_ENTRY_PROP_NAME = "--MAP--";
var TEMPLATE_DIRECTIVE_INDEX = 0;
function allocTStylingContext(initialStyling) {
  var mapBasedConfig = 1;
  return [initialStyling || [""], 0, TEMPLATE_DIRECTIVE_INDEX, mapBasedConfig, 0, MAP_BASED_ENTRY_PROP_NAME];
}
function updateLastDirectiveIndex(context, lastDirectiveIndex) {
  if (lastDirectiveIndex === TEMPLATE_DIRECTIVE_INDEX) {
    var currentValue = context[2];
    if (currentValue > TEMPLATE_DIRECTIVE_INDEX) {
      markContextToPersistState(context);
    }
  } else {
    context[2] = lastDirectiveIndex;
  }
}
function getConfig(context) {
  return context[1];
}
function setConfig(context, value) {
  context[1] = value;
}
function getProp(context, index) {
  return context[index + 2];
}
function getPropConfig(context, index) {
  return context[index + 0] & 1;
}
function isSanitizationRequired(context, index) {
  return (getPropConfig(context, index) & 1) > 0;
}
function getGuardMask(context, index) {
  var configGuardValue = context[index + 0];
  return configGuardValue >> 1;
}
function setGuardMask(context, index, maskValue) {
  var config = getPropConfig(context, index);
  var guardMask = maskValue << 1;
  context[index + 0] = config | guardMask;
}
function getValuesCount(context, index) {
  return context[index + 1];
}
function getBindingValue(context, index, offset) {
  return context[index + 3 + offset];
}
function getDefaultValue(context, index) {
  var valuesCount = getValuesCount(context, index);
  return context[index + 3 + valuesCount - 1];
}
function allowStylingFlush(context, index) {
  return context && index === context[2] ? true : false;
}
function lockContext(context) {
  setConfig(context, getConfig(context) | 1);
}
function isContextLocked(context) {
  return (getConfig(context) & 1) > 0;
}
function stateIsPersisted(context) {
  return (getConfig(context) & 2) > 0;
}
function markContextToPersistState(context) {
  setConfig(context, getConfig(context) | 2);
}
function getPropValuesStartPosition(context) {
  return 6 + context[4];
}
function isMapBased(prop) {
  return prop === MAP_BASED_ENTRY_PROP_NAME;
}
function hasValueChanged(a, b) {
  var compareValueA = Array.isArray(a) ? a[0] : a;
  var compareValueB = Array.isArray(b) ? b[0] : b;
  if (compareValueA instanceof String) {
    compareValueA = compareValueA.toString();
  }
  if (compareValueB instanceof String) {
    compareValueB = compareValueB.toString();
  }
  return isDifferent(compareValueA, compareValueB);
}
function isStylingValueDefined(value) {
  return value != null && value !== "";
}
function concatString(a, b, separator) {
  if (separator === void 0) {
    separator = " ";
  }
  return a + (b.length && a.length ? separator : "") + b;
}
function hyphenate(value) {
  return value.replace(/[a-z][A-Z]/g, function (v) {
    return v.charAt(0) + "-" + v.charAt(1);
  }).toLowerCase();
}
function getStylingMapArray(value) {
  return isStylingContext(value) ? value[0] : value;
}
function isStylingContext(value) {
  return Array.isArray(value) && value.length >= 6 && typeof value[1] !== "string";
}
function getInitialStylingValue(context) {
  var map = getStylingMapArray(context);
  return map && map[0] || "";
}
function hasClassInput(tNode) {
  return (tNode.flags & 8) !== 0;
}
function hasStyleInput(tNode) {
  return (tNode.flags & 16) !== 0;
}
function getMapProp(map, index) {
  return map[index + 0];
}
function setMapValue(map, index, value) {
  map[index + 1] = value;
}
function getMapValue(map, index) {
  return map[index + 1];
}
function forceClassesAsString(classes) {
  if (classes && typeof classes !== "string") {
    classes = Object.keys(classes).join(" ");
  }
  return classes || "";
}
function forceStylesAsString(styles) {
  var str = "";
  if (styles) {
    var props = Object.keys(styles);
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      str = concatString(str, prop + ":" + styles[prop], ";");
    }
  }
  return str;
}
var RendererStyleFlags3;
(function (RendererStyleFlags3) {
  RendererStyleFlags3[RendererStyleFlags3["Important"] = 1] = "Important";
  RendererStyleFlags3[RendererStyleFlags3["DashCase"] = 2] = "DashCase";
})(RendererStyleFlags3 || (RendererStyleFlags3 = {}));
function isProceduralRenderer(renderer) {
  return !!renderer.listen;
}
var ɵ0$3 = function (hostElement, rendererType) {
  return document;
};
var domRendererFactory3 = {
  createRenderer: ɵ0$3
};
var unusedValueExportToPlacateAjd$3 = 1;
function setUpAttributes(native, attrs) {
  var renderer = getLView()[RENDERER];
  var isProc = isProceduralRenderer(renderer);
  var i = 0;
  while (i < attrs.length) {
    var value = attrs[i];
    if (typeof value === "number") {
      if (value !== 0) {
        break;
      }
      i++;
      var namespaceURI = attrs[i++];
      var attrName = attrs[i++];
      var attrVal = attrs[i++];
      ngDevMode && ngDevMode.rendererSetAttribute++;
      isProc ? renderer.setAttribute(native, attrName, attrVal, namespaceURI) : native.setAttributeNS(namespaceURI, attrName, attrVal);
    } else {
      var attrName = value;
      var attrVal = attrs[++i];
      ngDevMode && ngDevMode.rendererSetAttribute++;
      if (isAnimationProp(attrName)) {
        if (isProc) {
          renderer.setProperty(native, attrName, attrVal);
        }
      } else {
        isProc ? renderer.setAttribute(native, attrName, attrVal) : native.setAttribute(attrName, attrVal);
      }
      i++;
    }
  }
  return i;
}
function attrsStylingIndexOf(attrs, startIndex) {
  for (var i = startIndex; i < attrs.length; i++) {
    var val = attrs[i];
    if (val === 1 || val === 2) {
      return i;
    }
  }
  return -1;
}
function isNameOnlyAttributeMarker(marker) {
  return marker === 3 || marker === 4 || marker === 6;
}
var ANIMATION_PROP_PREFIX = "@";
function isAnimationProp(name) {
  return name[0] === ANIMATION_PROP_PREFIX;
}
function hasParentInjector(parentLocation) {
  return parentLocation !== NO_PARENT_INJECTOR;
}
function getParentInjectorIndex(parentLocation) {
  return parentLocation & 32767;
}
function getParentInjectorViewOffset(parentLocation) {
  return parentLocation >> 16;
}
function getParentInjectorView(location, startView) {
  var viewOffset = getParentInjectorViewOffset(location);
  var parentView = startView;
  while (viewOffset > 0) {
    parentView = parentView[DECLARATION_VIEW];
    viewOffset--;
  }
  return parentView;
}
function getLViewParent(lView) {
  ngDevMode && assertLView(lView);
  var parent = lView[PARENT];
  return isLContainer(parent) ? parent[PARENT] : parent;
}
function getRootView(componentOrLView) {
  ngDevMode && assertDefined(componentOrLView, "component");
  var lView = isLView(componentOrLView) ? componentOrLView : readPatchedLView(componentOrLView);
  while (lView && !(lView[FLAGS] & 512)) {
    lView = getLViewParent(lView);
  }
  ngDevMode && assertLView(lView);
  return lView;
}
function findComponentView(lView) {
  var rootTNode = lView[T_HOST];
  while (rootTNode !== null && rootTNode.type === 2) {
    ngDevMode && assertDefined(lView[DECLARATION_VIEW], "lView[DECLARATION_VIEW]");
    lView = lView[DECLARATION_VIEW];
    rootTNode = lView[T_HOST];
  }
  ngDevMode && assertLView(lView);
  return lView;
}
function getRootContext(viewOrComponent) {
  var rootView = getRootView(viewOrComponent);
  ngDevMode && assertDefined(rootView[CONTEXT], "RootView has no context. Perhaps it is disconnected?");
  return rootView[CONTEXT];
}
exports.ɵangular_packages_core_core_bm = getRootContext;
var includeViewProviders = true;
function setIncludeViewProviders(v) {
  var oldValue = includeViewProviders;
  includeViewProviders = v;
  return oldValue;
}
var BLOOM_SIZE = 256;
var BLOOM_MASK = BLOOM_SIZE - 1;
var nextNgElementId = 0;
function bloomAdd(injectorIndex, tView, type) {
  ngDevMode && assertEqual(tView.firstTemplatePass, true, "expected firstTemplatePass to be true");
  var id = typeof type !== "string" ? type[NG_ELEMENT_ID] : type.charCodeAt(0) || 0;
  if (id == null) {
    id = type[NG_ELEMENT_ID] = nextNgElementId++;
  }
  var bloomBit = id & BLOOM_MASK;
  var mask = 1 << bloomBit;
  var b7 = bloomBit & 128;
  var b6 = bloomBit & 64;
  var b5 = bloomBit & 32;
  var tData = tView.data;
  if (b7) {
    b6 ? b5 ? tData[injectorIndex + 7] |= mask : tData[injectorIndex + 6] |= mask : b5 ? tData[injectorIndex + 5] |= mask : tData[injectorIndex + 4] |= mask;
  } else {
    b6 ? b5 ? tData[injectorIndex + 3] |= mask : tData[injectorIndex + 2] |= mask : b5 ? tData[injectorIndex + 1] |= mask : tData[injectorIndex] |= mask;
  }
}
function getOrCreateNodeInjectorForNode(tNode, hostView) {
  var existingInjectorIndex = getInjectorIndex(tNode, hostView);
  if (existingInjectorIndex !== -1) {
    return existingInjectorIndex;
  }
  var tView = hostView[TVIEW];
  if (tView.firstTemplatePass) {
    tNode.injectorIndex = hostView.length;
    insertBloom(tView.data, tNode);
    insertBloom(hostView, null);
    insertBloom(tView.blueprint, null);
    ngDevMode && assertEqual(tNode.flags === 0 || tNode.flags === 1, true, "expected tNode.flags to not be initialized");
  }
  var parentLoc = getParentInjectorLocation(tNode, hostView);
  var parentIndex = getParentInjectorIndex(parentLoc);
  var parentLView = getParentInjectorView(parentLoc, hostView);
  var injectorIndex = tNode.injectorIndex;
  if (hasParentInjector(parentLoc)) {
    var parentData = parentLView[TVIEW].data;
    for (var i = 0; i < 8; i++) {
      hostView[injectorIndex + i] = parentLView[parentIndex + i] | parentData[parentIndex + i];
    }
  }
  hostView[injectorIndex + PARENT_INJECTOR] = parentLoc;
  return injectorIndex;
}
function insertBloom(arr, footer) {
  arr.push(0, 0, 0, 0, 0, 0, 0, 0, footer);
}
function getInjectorIndex(tNode, hostView) {
  if (tNode.injectorIndex === -1 || tNode.parent && tNode.parent.injectorIndex === tNode.injectorIndex || hostView[tNode.injectorIndex + PARENT_INJECTOR] == null) {
    return -1;
  } else {
    return tNode.injectorIndex;
  }
}
function getParentInjectorLocation(tNode, view) {
  if (tNode.parent && tNode.parent.injectorIndex !== -1) {
    return tNode.parent.injectorIndex;
  }
  var hostTNode = view[T_HOST];
  var viewOffset = 1;
  while (hostTNode && hostTNode.injectorIndex === -1) {
    view = view[DECLARATION_VIEW];
    hostTNode = view ? view[T_HOST] : null;
    viewOffset++;
  }
  return hostTNode ? hostTNode.injectorIndex | viewOffset << 16 : -1;
}
function diPublicInInjector(injectorIndex, tView, token) {
  bloomAdd(injectorIndex, tView, token);
}
function injectAttributeImpl(tNode, attrNameToInject) {
  ngDevMode && assertNodeOfPossibleTypes(tNode, 0, 3, 4);
  ngDevMode && assertDefined(tNode, "expecting tNode");
  if (attrNameToInject === "class") {
    return getInitialStylingValue(tNode.classes);
  }
  if (attrNameToInject === "style") {
    return getInitialStylingValue(tNode.styles);
  }
  var attrs = tNode.attrs;
  if (attrs) {
    var attrsLength = attrs.length;
    var i = 0;
    while (i < attrsLength) {
      var value = attrs[i];
      if (isNameOnlyAttributeMarker(value)) break;
      if (value === 0) {
        i = i + 2;
      } else if (typeof value === "number") {
        i++;
        while (i < attrsLength && typeof attrs[i] === "string") {
          i++;
        }
      } else if (value === attrNameToInject) {
        return attrs[i + 1];
      } else {
        i = i + 2;
      }
    }
  }
  return null;
}
exports.ɵangular_packages_core_core_bb = injectAttributeImpl;
function getOrCreateInjectable(tNode, lView, token, flags, notFoundValue) {
  if (flags === void 0) {
    flags = InjectFlags.Default;
  }
  if (tNode) {
    var bloomHash = bloomHashBitOrFactory(token);
    if (typeof bloomHash === "function") {
      var savePreviousOrParentTNode = getPreviousOrParentTNode();
      var saveLView = getLView();
      setTNodeAndViewData(tNode, lView);
      try {
        var value = bloomHash();
        if (value == null && !(flags & InjectFlags.Optional)) {
          throw new Error("No provider for " + stringifyForError(token) + "!");
        } else {
          return value;
        }
      } finally {
        setTNodeAndViewData(savePreviousOrParentTNode, saveLView);
      }
    } else if (typeof bloomHash == "number") {
      if (bloomHash === -1) {
        return new NodeInjector(tNode, lView);
      }
      var previousTView = null;
      var injectorIndex = getInjectorIndex(tNode, lView);
      var parentLocation = NO_PARENT_INJECTOR;
      var hostTElementNode = flags & InjectFlags.Host ? findComponentView(lView)[T_HOST] : null;
      if (injectorIndex === -1 || flags & InjectFlags.SkipSelf) {
        parentLocation = injectorIndex === -1 ? getParentInjectorLocation(tNode, lView) : lView[injectorIndex + PARENT_INJECTOR];
        if (!shouldSearchParent(flags, false)) {
          injectorIndex = -1;
        } else {
          previousTView = lView[TVIEW];
          injectorIndex = getParentInjectorIndex(parentLocation);
          lView = getParentInjectorView(parentLocation, lView);
        }
      }
      while (injectorIndex !== -1) {
        parentLocation = lView[injectorIndex + PARENT_INJECTOR];
        var tView = lView[TVIEW];
        if (bloomHasToken(bloomHash, injectorIndex, tView.data)) {
          var instance = searchTokensOnInjector(injectorIndex, lView, token, previousTView, flags, hostTElementNode);
          if (instance !== NOT_FOUND) {
            return instance;
          }
        }
        if (shouldSearchParent(flags, lView[TVIEW].data[injectorIndex + TNODE] === hostTElementNode) && bloomHasToken(bloomHash, injectorIndex, lView)) {
          previousTView = tView;
          injectorIndex = getParentInjectorIndex(parentLocation);
          lView = getParentInjectorView(parentLocation, lView);
        } else {
          injectorIndex = -1;
        }
      }
    }
  }
  if (flags & InjectFlags.Optional && notFoundValue === undefined) {
    notFoundValue = null;
  }
  if ((flags & (InjectFlags.Self | InjectFlags.Host)) === 0) {
    var moduleInjector = lView[INJECTOR$1];
    var previousInjectImplementation = setInjectImplementation(undefined);
    try {
      if (moduleInjector) {
        return moduleInjector.get(token, notFoundValue, flags & InjectFlags.Optional);
      } else {
        return injectRootLimpMode(token, notFoundValue, flags & InjectFlags.Optional);
      }
    } finally {
      setInjectImplementation(previousInjectImplementation);
    }
  }
  if (flags & InjectFlags.Optional) {
    return notFoundValue;
  } else {
    throw new Error("NodeInjector: NOT_FOUND [" + stringifyForError(token) + "]");
  }
}
var NOT_FOUND = {};
function searchTokensOnInjector(injectorIndex, lView, token, previousTView, flags, hostTElementNode) {
  var currentTView = lView[TVIEW];
  var tNode = currentTView.data[injectorIndex + TNODE];
  var canAccessViewProviders = previousTView == null ? isComponent(tNode) && includeViewProviders : previousTView != currentTView && tNode.type === 3;
  var isHostSpecialCase = flags & InjectFlags.Host && hostTElementNode === tNode;
  var injectableIdx = locateDirectiveOrProvider(tNode, currentTView, token, canAccessViewProviders, isHostSpecialCase);
  if (injectableIdx !== null) {
    return getNodeInjectable(currentTView.data, lView, injectableIdx, tNode);
  } else {
    return NOT_FOUND;
  }
}
function locateDirectiveOrProvider(tNode, tView, token, canAccessViewProviders, isHostSpecialCase) {
  var nodeProviderIndexes = tNode.providerIndexes;
  var tInjectables = tView.data;
  var injectablesStart = nodeProviderIndexes & 65535;
  var directivesStart = tNode.directiveStart;
  var directiveEnd = tNode.directiveEnd;
  var cptViewProvidersCount = nodeProviderIndexes >> 16;
  var startingIndex = canAccessViewProviders ? injectablesStart : injectablesStart + cptViewProvidersCount;
  var endIndex = isHostSpecialCase ? injectablesStart + cptViewProvidersCount : directiveEnd;
  for (var i = startingIndex; i < endIndex; i++) {
    var providerTokenOrDef = tInjectables[i];
    if (i < directivesStart && token === providerTokenOrDef || i >= directivesStart && providerTokenOrDef.type === token) {
      return i;
    }
  }
  if (isHostSpecialCase) {
    var dirDef = tInjectables[directivesStart];
    if (dirDef && isComponentDef(dirDef) && dirDef.type === token) {
      return directivesStart;
    }
  }
  return null;
}
function getNodeInjectable(tData, lData, index, tNode) {
  var value = lData[index];
  if (isFactory(value)) {
    var factory = value;
    if (factory.resolving) {
      throw new Error("Circular dep for " + stringifyForError(tData[index]));
    }
    var previousIncludeViewProviders = setIncludeViewProviders(factory.canSeeViewProviders);
    factory.resolving = true;
    var previousInjectImplementation = void 0;
    if (factory.injectImpl) {
      previousInjectImplementation = setInjectImplementation(factory.injectImpl);
    }
    var savePreviousOrParentTNode = getPreviousOrParentTNode();
    var saveLView = getLView();
    setTNodeAndViewData(tNode, lData);
    try {
      value = lData[index] = factory.factory(undefined, tData, lData, tNode);
    } finally {
      if (factory.injectImpl) setInjectImplementation(previousInjectImplementation);
      setIncludeViewProviders(previousIncludeViewProviders);
      factory.resolving = false;
      setTNodeAndViewData(savePreviousOrParentTNode, saveLView);
    }
  }
  return value;
}
function bloomHashBitOrFactory(token) {
  ngDevMode && assertDefined(token, "token must be defined");
  if (typeof token === "string") {
    return token.charCodeAt(0) || 0;
  }
  var tokenId = token[NG_ELEMENT_ID];
  return typeof tokenId === "number" && tokenId > 0 ? tokenId & BLOOM_MASK : tokenId;
}
function bloomHasToken(bloomHash, injectorIndex, injectorView) {
  var mask = 1 << bloomHash;
  var b7 = bloomHash & 128;
  var b6 = bloomHash & 64;
  var b5 = bloomHash & 32;
  var value;
  if (b7) {
    value = b6 ? b5 ? injectorView[injectorIndex + 7] : injectorView[injectorIndex + 6] : b5 ? injectorView[injectorIndex + 5] : injectorView[injectorIndex + 4];
  } else {
    value = b6 ? b5 ? injectorView[injectorIndex + 3] : injectorView[injectorIndex + 2] : b5 ? injectorView[injectorIndex + 1] : injectorView[injectorIndex];
  }
  return !!(value & mask);
}
function shouldSearchParent(flags, isFirstHostTNode) {
  return !(flags & InjectFlags.Self) && !(flags & InjectFlags.Host && isFirstHostTNode);
}
var NodeInjector = (function () {
  function NodeInjector(_tNode, _lView) {
    this._tNode = _tNode;
    this._lView = _lView;
  }
  NodeInjector.prototype.get = function (token, notFoundValue) {
    return getOrCreateInjectable(this._tNode, this._lView, token, undefined, notFoundValue);
  };
  return NodeInjector;
})();
function ɵɵgetFactoryOf(type) {
  var typeAny = type;
  var def = getComponentDef(typeAny) || getDirectiveDef(typeAny) || getPipeDef(typeAny) || getInjectableDef(typeAny) || getInjectorDef(typeAny);
  if (!def || def.factory === undefined) {
    return null;
  }
  return def.factory;
}
exports.ɵɵgetFactoryOf = ɵɵgetFactoryOf;
function ɵɵgetInheritedFactory(type) {
  var proto = Object.getPrototypeOf(type.prototype).constructor;
  var factory = ɵɵgetFactoryOf(proto);
  if (factory !== null) {
    return factory;
  } else {
    return function (t) {
      return new t();
    };
  }
}
exports.ɵɵgetInheritedFactory = ɵɵgetInheritedFactory;
var ERROR_TYPE = "ngType";
var ERROR_DEBUG_CONTEXT = "ngDebugContext";
var ERROR_ORIGINAL_ERROR = "ngOriginalError";
var ERROR_LOGGER = "ngErrorLogger";
function wrappedError(message, originalError) {
  var msg = message + " caused by: " + (originalError instanceof Error ? originalError.message : originalError);
  var error = Error(msg);
  error[ERROR_ORIGINAL_ERROR] = originalError;
  return error;
}
function getType(error) {
  return error[ERROR_TYPE];
}
function getDebugContext(error) {
  return error[ERROR_DEBUG_CONTEXT];
}
function getOriginalError(error) {
  return error[ERROR_ORIGINAL_ERROR];
}
function getErrorLogger(error) {
  return error[ERROR_LOGGER] || defaultErrorLogger;
}
function defaultErrorLogger(console) {
  var values = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    values[_i - 1] = arguments[_i];
  }
  console.error.apply(console, tslib_1.__spread(values));
}
var ErrorHandler = (function () {
  function ErrorHandler() {
    this._console = console;
  }
  exports.ErrorHandler = ErrorHandler;
  ErrorHandler.prototype.handleError = function (error) {
    var originalError = this._findOriginalError(error);
    var context = this._findContext(error);
    var errorLogger = getErrorLogger(error);
    errorLogger(this._console, "ERROR", error);
    if (originalError) {
      errorLogger(this._console, "ORIGINAL ERROR", originalError);
    }
    if (context) {
      errorLogger(this._console, "ERROR CONTEXT", context);
    }
  };
  ErrorHandler.prototype._findContext = function (error) {
    if (error) {
      return getDebugContext(error) ? getDebugContext(error) : this._findContext(getOriginalError(error));
    }
    return null;
  };
  ErrorHandler.prototype._findOriginalError = function (error) {
    var e = getOriginalError(error);
    while (e && getOriginalError(e)) {
      e = getOriginalError(e);
    }
    return e;
  };
  return ErrorHandler;
})();
exports.ErrorHandler = ErrorHandler;
var CUSTOM_ELEMENTS_SCHEMA = {
  name: "custom-elements"
};
exports.CUSTOM_ELEMENTS_SCHEMA = CUSTOM_ELEMENTS_SCHEMA;
var NO_ERRORS_SCHEMA = {
  name: "no-errors-schema"
};
exports.NO_ERRORS_SCHEMA = NO_ERRORS_SCHEMA;
var BRAND = "__SANITIZER_TRUSTED_BRAND__";
function allowSanitizationBypass(value, type) {
  return value instanceof String && value[BRAND] === type;
}
function bypassSanitizationTrustHtml(trustedHtml) {
  return bypassSanitizationTrustString(trustedHtml, "Html");
}
exports.ɵbypassSanitizationTrustHtml = bypassSanitizationTrustHtml;
function bypassSanitizationTrustStyle(trustedStyle) {
  return bypassSanitizationTrustString(trustedStyle, "Style");
}
exports.ɵbypassSanitizationTrustStyle = bypassSanitizationTrustStyle;
function bypassSanitizationTrustScript(trustedScript) {
  return bypassSanitizationTrustString(trustedScript, "Script");
}
exports.ɵbypassSanitizationTrustScript = bypassSanitizationTrustScript;
function bypassSanitizationTrustUrl(trustedUrl) {
  return bypassSanitizationTrustString(trustedUrl, "Url");
}
exports.ɵbypassSanitizationTrustUrl = bypassSanitizationTrustUrl;
function bypassSanitizationTrustResourceUrl(trustedResourceUrl) {
  return bypassSanitizationTrustString(trustedResourceUrl, "ResourceUrl");
}
exports.ɵbypassSanitizationTrustResourceUrl = bypassSanitizationTrustResourceUrl;
function bypassSanitizationTrustString(trustedString, mode) {
  var trusted = new String(trustedString);
  trusted[BRAND] = mode;
  return trusted;
}
var _devMode = true;
var _runModeLocked = false;
function isDevMode() {
  _runModeLocked = true;
  return _devMode;
}
exports.isDevMode = isDevMode;
function enableProdMode() {
  if (_runModeLocked) {
    throw new Error("Cannot enable prod mode after platform setup.");
  }
  _devMode = false;
}
exports.enableProdMode = enableProdMode;
var InertBodyHelper = (function () {
  function InertBodyHelper(defaultDoc) {
    this.defaultDoc = defaultDoc;
    this.inertDocument = this.defaultDoc.implementation.createHTMLDocument("sanitization-inert");
    this.inertBodyElement = this.inertDocument.body;
    if (this.inertBodyElement == null) {
      var inertHtml = this.inertDocument.createElement("html");
      this.inertDocument.appendChild(inertHtml);
      this.inertBodyElement = this.inertDocument.createElement("body");
      inertHtml.appendChild(this.inertBodyElement);
    }
    this.inertBodyElement.innerHTML = "<svg><g onload=\"this.parentNode.remove()\"></g></svg>";
    if (this.inertBodyElement.querySelector && !this.inertBodyElement.querySelector("svg")) {
      this.getInertBodyElement = this.getInertBodyElement_XHR;
      return;
    }
    this.inertBodyElement.innerHTML = "<svg><p><style><img src=\"</style><img src=x onerror=alert(1)//\">";
    if (this.inertBodyElement.querySelector && this.inertBodyElement.querySelector("svg img")) {
      if (isDOMParserAvailable()) {
        this.getInertBodyElement = this.getInertBodyElement_DOMParser;
        return;
      }
    }
    this.getInertBodyElement = this.getInertBodyElement_InertDocument;
  }
  InertBodyHelper.prototype.getInertBodyElement_XHR = function (html) {
    html = "<body><remove></remove>" + html + "</body>";
    try {
      html = encodeURI(html);
    } catch (_a) {
      return null;
    }
    var xhr = new XMLHttpRequest();
    xhr.responseType = "document";
    xhr.open("GET", "data:text/html;charset=utf-8," + html, false);
    xhr.send(undefined);
    var body = xhr.response.body;
    body.removeChild(body.firstChild);
    return body;
  };
  InertBodyHelper.prototype.getInertBodyElement_DOMParser = function (html) {
    html = "<body><remove></remove>" + html + "</body>";
    try {
      var body = new window.DOMParser().parseFromString(html, "text/html").body;
      body.removeChild(body.firstChild);
      return body;
    } catch (_a) {
      return null;
    }
  };
  InertBodyHelper.prototype.getInertBodyElement_InertDocument = function (html) {
    var templateEl = this.inertDocument.createElement("template");
    if (("content" in templateEl)) {
      templateEl.innerHTML = html;
      return templateEl;
    }
    this.inertBodyElement.innerHTML = html;
    if (this.defaultDoc.documentMode) {
      this.stripCustomNsAttrs(this.inertBodyElement);
    }
    return this.inertBodyElement;
  };
  InertBodyHelper.prototype.stripCustomNsAttrs = function (el) {
    var elAttrs = el.attributes;
    for (var i = elAttrs.length - 1; 0 < i; i--) {
      var attrib = elAttrs.item(i);
      var attrName = attrib.name;
      if (attrName === "xmlns:ns1" || attrName.indexOf("ns1:") === 0) {
        el.removeAttribute(attrName);
      }
    }
    var childNode = el.firstChild;
    while (childNode) {
      if (childNode.nodeType === Node.ELEMENT_NODE) this.stripCustomNsAttrs(childNode);
      childNode = childNode.nextSibling;
    }
  };
  return InertBodyHelper;
})();
function isDOMParserAvailable() {
  try {
    return !!window.DOMParser;
  } catch (_a) {
    return false;
  }
}
var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
var SAFE_SRCSET_PATTERN = /^(?:(?:https?|file):|[^&:/?#]*(?:[/?#]|$))/gi;
var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
function _sanitizeUrl(url) {
  url = String(url);
  if (url.match(SAFE_URL_PATTERN) || url.match(DATA_URL_PATTERN)) return url;
  if (isDevMode()) {
    console.warn("WARNING: sanitizing unsafe URL value " + url + " (see http://g.co/ng/security#xss)");
  }
  return "unsafe:" + url;
}
exports.ɵ_sanitizeUrl = _sanitizeUrl;
function sanitizeSrcset(srcset) {
  srcset = String(srcset);
  return srcset.split(",").map(function (srcset) {
    return _sanitizeUrl(srcset.trim());
  }).join(", ");
}
function tagSet(tags) {
  var e_1, _a;
  var res = {};
  try {
    for (var _b = tslib_1.__values(tags.split(",")), _c = _b.next(); !_c.done; _c = _b.next()) {
      var t = _c.value;
      res[t] = true;
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  return res;
}
function merge() {
  var e_2, _a;
  var sets = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sets[_i] = arguments[_i];
  }
  var res = {};
  try {
    for (var sets_1 = tslib_1.__values(sets), sets_1_1 = sets_1.next(); !sets_1_1.done; sets_1_1 = sets_1.next()) {
      var s = sets_1_1.value;
      for (var v in s) {
        if (s.hasOwnProperty(v)) res[v] = true;
      }
    }
  } catch (e_2_1) {
    e_2 = {
      error: e_2_1
    };
  } finally {
    try {
      if (sets_1_1 && !sets_1_1.done && (_a = sets_1.return)) _a.call(sets_1);
    } finally {
      if (e_2) throw e_2.error;
    }
  }
  return res;
}
var VOID_ELEMENTS = tagSet("area,br,col,hr,img,wbr");
var OPTIONAL_END_TAG_BLOCK_ELEMENTS = tagSet("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr");
var OPTIONAL_END_TAG_INLINE_ELEMENTS = tagSet("rp,rt");
var OPTIONAL_END_TAG_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, OPTIONAL_END_TAG_BLOCK_ELEMENTS);
var BLOCK_ELEMENTS = merge(OPTIONAL_END_TAG_BLOCK_ELEMENTS, tagSet("address,article," + "aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," + "h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"));
var INLINE_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, tagSet("a,abbr,acronym,audio,b," + "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s," + "samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"));
var VALID_ELEMENTS = merge(VOID_ELEMENTS, BLOCK_ELEMENTS, INLINE_ELEMENTS, OPTIONAL_END_TAG_ELEMENTS);
var URI_ATTRS = tagSet("background,cite,href,itemtype,longdesc,poster,src,xlink:href");
var SRCSET_ATTRS = tagSet("srcset");
var HTML_ATTRS = tagSet("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan," + "compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace," + "ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules," + "scope,scrolling,shape,size,sizes,span,srclang,start,summary,tabindex,target,title,translate,type,usemap," + "valign,value,vspace,width");
var ARIA_ATTRS = tagSet("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex," + "aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect," + "aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid," + "aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline," + "aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly," + "aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected," + "aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext");
var VALID_ATTRS = merge(URI_ATTRS, SRCSET_ATTRS, HTML_ATTRS, ARIA_ATTRS);
var SKIP_TRAVERSING_CONTENT_IF_INVALID_ELEMENTS = tagSet("script,style,template");
var SanitizingHtmlSerializer = (function () {
  function SanitizingHtmlSerializer() {
    this.sanitizedSomething = false;
    this.buf = [];
  }
  SanitizingHtmlSerializer.prototype.sanitizeChildren = function (el) {
    var current = el.firstChild;
    var traverseContent = true;
    while (current) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        traverseContent = this.startElement(current);
      } else if (current.nodeType === Node.TEXT_NODE) {
        this.chars(current.nodeValue);
      } else {
        this.sanitizedSomething = true;
      }
      if (traverseContent && current.firstChild) {
        current = current.firstChild;
        continue;
      }
      while (current) {
        if (current.nodeType === Node.ELEMENT_NODE) {
          this.endElement(current);
        }
        var next = this.checkClobberedElement(current, current.nextSibling);
        if (next) {
          current = next;
          break;
        }
        current = this.checkClobberedElement(current, current.parentNode);
      }
    }
    return this.buf.join("");
  };
  SanitizingHtmlSerializer.prototype.startElement = function (element) {
    var tagName = element.nodeName.toLowerCase();
    if (!VALID_ELEMENTS.hasOwnProperty(tagName)) {
      this.sanitizedSomething = true;
      return !SKIP_TRAVERSING_CONTENT_IF_INVALID_ELEMENTS.hasOwnProperty(tagName);
    }
    this.buf.push("<");
    this.buf.push(tagName);
    var elAttrs = element.attributes;
    for (var i = 0; i < elAttrs.length; i++) {
      var elAttr = elAttrs.item(i);
      var attrName = elAttr.name;
      var lower = attrName.toLowerCase();
      if (!VALID_ATTRS.hasOwnProperty(lower)) {
        this.sanitizedSomething = true;
        continue;
      }
      var value = elAttr.value;
      if (URI_ATTRS[lower]) value = _sanitizeUrl(value);
      if (SRCSET_ATTRS[lower]) value = sanitizeSrcset(value);
      this.buf.push(" ", attrName, "=\"", encodeEntities(value), "\"");
    }
    this.buf.push(">");
    return true;
  };
  SanitizingHtmlSerializer.prototype.endElement = function (current) {
    var tagName = current.nodeName.toLowerCase();
    if (VALID_ELEMENTS.hasOwnProperty(tagName) && !VOID_ELEMENTS.hasOwnProperty(tagName)) {
      this.buf.push("</");
      this.buf.push(tagName);
      this.buf.push(">");
    }
  };
  SanitizingHtmlSerializer.prototype.chars = function (chars) {
    this.buf.push(encodeEntities(chars));
  };
  SanitizingHtmlSerializer.prototype.checkClobberedElement = function (node, nextNode) {
    if (nextNode && (node.compareDocumentPosition(nextNode) & Node.DOCUMENT_POSITION_CONTAINED_BY) === Node.DOCUMENT_POSITION_CONTAINED_BY) {
      throw new Error("Failed to sanitize html because the element is clobbered: " + node.outerHTML);
    }
    return nextNode;
  };
  return SanitizingHtmlSerializer;
})();
var SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
var NON_ALPHANUMERIC_REGEXP = /([^\#-~ |!])/g;
function encodeEntities(value) {
  return value.replace(/&/g, "&amp;").replace(SURROGATE_PAIR_REGEXP, function (match) {
    var hi = match.charCodeAt(0);
    var low = match.charCodeAt(1);
    return "&#" + ((hi - 55296) * 1024 + (low - 56320) + 65536) + ";";
  }).replace(NON_ALPHANUMERIC_REGEXP, function (match) {
    return "&#" + match.charCodeAt(0) + ";";
  }).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var inertBodyHelper;
function _sanitizeHtml(defaultDoc, unsafeHtmlInput) {
  var inertBodyElement = null;
  try {
    inertBodyHelper = inertBodyHelper || new InertBodyHelper(defaultDoc);
    var unsafeHtml = unsafeHtmlInput ? String(unsafeHtmlInput) : "";
    inertBodyElement = inertBodyHelper.getInertBodyElement(unsafeHtml);
    var mXSSAttempts = 5;
    var parsedHtml = unsafeHtml;
    do {
      if (mXSSAttempts === 0) {
        throw new Error("Failed to sanitize html because the input is unstable");
      }
      mXSSAttempts--;
      unsafeHtml = parsedHtml;
      parsedHtml = inertBodyElement.innerHTML;
      inertBodyElement = inertBodyHelper.getInertBodyElement(unsafeHtml);
    } while (unsafeHtml !== parsedHtml);
    var sanitizer = new SanitizingHtmlSerializer();
    var safeHtml = sanitizer.sanitizeChildren(getTemplateContent(inertBodyElement) || inertBodyElement);
    if (isDevMode() && sanitizer.sanitizedSomething) {
      console.warn("WARNING: sanitizing HTML stripped some content, see http://g.co/ng/security#xss");
    }
    return safeHtml;
  } finally {
    if (inertBodyElement) {
      var parent_1 = getTemplateContent(inertBodyElement) || inertBodyElement;
      while (parent_1.firstChild) {
        parent_1.removeChild(parent_1.firstChild);
      }
    }
  }
}
exports.ɵ_sanitizeHtml = _sanitizeHtml;
function getTemplateContent(el) {
  return ("content" in el) && isTemplateElement(el) ? el.content : null;
}
function isTemplateElement(el) {
  return el.nodeType === Node.ELEMENT_NODE && el.nodeName === "TEMPLATE";
}
var SecurityContext;
exports.SecurityContext = SecurityContext;
(function (SecurityContext) {
  SecurityContext[SecurityContext["NONE"] = 0] = "NONE";
  SecurityContext[SecurityContext["HTML"] = 1] = "HTML";
  SecurityContext[SecurityContext["STYLE"] = 2] = "STYLE";
  SecurityContext[SecurityContext["SCRIPT"] = 3] = "SCRIPT";
  SecurityContext[SecurityContext["URL"] = 4] = "URL";
  SecurityContext[SecurityContext["RESOURCE_URL"] = 5] = "RESOURCE_URL";
})(SecurityContext || (SecurityContext = {}));
var Sanitizer = (function () {
  function Sanitizer() {}
  exports.Sanitizer = Sanitizer;
  return Sanitizer;
})();
exports.Sanitizer = Sanitizer;
var VALUES = "[-,.\"'%_!# a-zA-Z0-9]+";
var TRANSFORMATION_FNS = "(?:matrix|translate|scale|rotate|skew|perspective)(?:X|Y|Z|3d)?";
var COLOR_FNS = "(?:rgb|hsl)a?";
var GRADIENTS = "(?:repeating-)?(?:linear|radial)-gradient";
var CSS3_FNS = "(?:calc|attr)";
var FN_ARGS = "\\([-0-9.%, #a-zA-Z]+\\)";
var SAFE_STYLE_VALUE = new RegExp("^(" + VALUES + "|" + ("(?:" + TRANSFORMATION_FNS + "|" + COLOR_FNS + "|" + GRADIENTS + "|" + CSS3_FNS + ")") + (FN_ARGS + ")$"), "g");
var URL_RE = /^url\(([^)]+)\)$/;
function hasBalancedQuotes(value) {
  var outsideSingle = true;
  var outsideDouble = true;
  for (var i = 0; i < value.length; i++) {
    var c = value.charAt(i);
    if (c === "'" && outsideDouble) {
      outsideSingle = !outsideSingle;
    } else if (c === "\"" && outsideSingle) {
      outsideDouble = !outsideDouble;
    }
  }
  return outsideSingle && outsideDouble;
}
function _sanitizeStyle(value) {
  value = String(value).trim();
  if (!value) return "";
  var urlMatch = value.match(URL_RE);
  if (urlMatch && _sanitizeUrl(urlMatch[1]) === urlMatch[1] || value.match(SAFE_STYLE_VALUE) && hasBalancedQuotes(value)) {
    return value;
  }
  if (isDevMode()) {
    console.warn("WARNING: sanitizing unsafe style value " + value + " (see http://g.co/ng/security#xss).");
  }
  return "unsafe";
}
exports.ɵ_sanitizeStyle = _sanitizeStyle;
function ɵɵsanitizeHtml(unsafeHtml) {
  var sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.HTML, unsafeHtml) || "";
  }
  if (allowSanitizationBypass(unsafeHtml, "Html")) {
    return unsafeHtml.toString();
  }
  return _sanitizeHtml(document, renderStringify(unsafeHtml));
}
exports.ɵɵsanitizeHtml = ɵɵsanitizeHtml;
function ɵɵsanitizeStyle(unsafeStyle) {
  var sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.STYLE, unsafeStyle) || "";
  }
  if (allowSanitizationBypass(unsafeStyle, "Style")) {
    return unsafeStyle.toString();
  }
  return _sanitizeStyle(renderStringify(unsafeStyle));
}
exports.ɵɵsanitizeStyle = ɵɵsanitizeStyle;
function ɵɵsanitizeUrl(unsafeUrl) {
  var sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.URL, unsafeUrl) || "";
  }
  if (allowSanitizationBypass(unsafeUrl, "Url")) {
    return unsafeUrl.toString();
  }
  return _sanitizeUrl(renderStringify(unsafeUrl));
}
exports.ɵɵsanitizeUrl = ɵɵsanitizeUrl;
function ɵɵsanitizeResourceUrl(unsafeResourceUrl) {
  var sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.RESOURCE_URL, unsafeResourceUrl) || "";
  }
  if (allowSanitizationBypass(unsafeResourceUrl, "ResourceUrl")) {
    return unsafeResourceUrl.toString();
  }
  throw new Error("unsafe value used in a resource URL context (see http://g.co/ng/security#xss)");
}
exports.ɵɵsanitizeResourceUrl = ɵɵsanitizeResourceUrl;
function ɵɵsanitizeScript(unsafeScript) {
  var sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.SCRIPT, unsafeScript) || "";
  }
  if (allowSanitizationBypass(unsafeScript, "Script")) {
    return unsafeScript.toString();
  }
  throw new Error("unsafe value used in a script context");
}
exports.ɵɵsanitizeScript = ɵɵsanitizeScript;
function getUrlSanitizer(tag, prop) {
  if (prop === "src" && (tag === "embed" || tag === "frame" || tag === "iframe" || tag === "media" || tag === "script") || prop === "href" && (tag === "base" || tag === "link")) {
    return ɵɵsanitizeResourceUrl;
  }
  return ɵɵsanitizeUrl;
}
exports.ɵangular_packages_core_core_bg = getUrlSanitizer;
function ɵɵsanitizeUrlOrResourceUrl(unsafeUrl, tag, prop) {
  return getUrlSanitizer(tag, prop)(unsafeUrl);
}
exports.ɵɵsanitizeUrlOrResourceUrl = ɵɵsanitizeUrlOrResourceUrl;
var ɵɵdefaultStyleSanitizer = function (prop, value, mode) {
  mode = mode || 3;
  var doSanitizeValue = true;
  if (mode & 1) {
    doSanitizeValue = prop === "background-image" || prop === "background" || prop === "border-image" || prop === "filter" || prop === "list-style" || prop === "list-style-image" || prop === "clip-path";
  }
  if (mode & 2) {
    return doSanitizeValue ? ɵɵsanitizeStyle(value) : value;
  } else {
    return doSanitizeValue;
  }
};
exports.ɵɵdefaultStyleSanitizer = ɵɵdefaultStyleSanitizer;
function validateAgainstEventProperties(name) {
  if (name.toLowerCase().startsWith("on")) {
    var msg = "Binding to event property '" + name + "' is disallowed for security reasons, " + ("please use (" + name.slice(2) + ")=...") + ("\nIf '" + name + "' is a directive input, make sure the directive is imported by the") + " current module.";
    throw new Error(msg);
  }
}
function validateAgainstEventAttributes(name) {
  if (name.toLowerCase().startsWith("on")) {
    var msg = "Binding to event attribute '" + name + "' is disallowed for security reasons, " + ("please use (" + name.slice(2) + ")=...");
    throw new Error(msg);
  }
}
function getSanitizer() {
  var lView = getLView();
  return lView && lView[SANITIZER];
}
function createNamedArrayType(name) {
  if (ngDevMode) {
    try {
      var FunctionConstructor = createNamedArrayType.constructor;
      return new FunctionConstructor("Array", "return class ABC extends Array{}")(Array);
    } catch (e) {
      return Array;
    }
  } else {
    throw new Error("Looks like we are in 'prod mode', but we are creating a named Array type, which is wrong! Check your code");
  }
}
function normalizeDebugBindingName(name) {
  name = camelCaseToDashCase(name.replace(/[$@]/g, "_"));
  return "ng-reflect-" + name;
}
var CAMEL_CASE_REGEXP = /([A-Z])/g;
function camelCaseToDashCase(input) {
  return input.replace(CAMEL_CASE_REGEXP, function () {
    var m = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      m[_i] = arguments[_i];
    }
    return "-" + m[1].toLowerCase();
  });
}
function normalizeDebugBindingValue(value) {
  try {
    return value != null ? value.toString().slice(0, 30) : value;
  } catch (e) {
    return "[ERROR] Exception while trying to serialize the value";
  }
}
function getLContext(target) {
  var mpValue = readPatchedData(target);
  if (mpValue) {
    if (Array.isArray(mpValue)) {
      var lView = mpValue;
      var nodeIndex = void 0;
      var component = undefined;
      var directives = undefined;
      if (isComponentInstance(target)) {
        nodeIndex = findViaComponent(lView, target);
        if (nodeIndex == -1) {
          throw new Error("The provided component was not found in the application");
        }
        component = target;
      } else if (isDirectiveInstance(target)) {
        nodeIndex = findViaDirective(lView, target);
        if (nodeIndex == -1) {
          throw new Error("The provided directive was not found in the application");
        }
        directives = getDirectivesAtNodeIndex(nodeIndex, lView, false);
      } else {
        nodeIndex = findViaNativeElement(lView, target);
        if (nodeIndex == -1) {
          return null;
        }
      }
      var native = unwrapRNode(lView[nodeIndex]);
      var existingCtx = readPatchedData(native);
      var context = existingCtx && !Array.isArray(existingCtx) ? existingCtx : createLContext(lView, nodeIndex, native);
      if (component && context.component === undefined) {
        context.component = component;
        attachPatchData(context.component, context);
      }
      if (directives && context.directives === undefined) {
        context.directives = directives;
        for (var i = 0; i < directives.length; i++) {
          attachPatchData(directives[i], context);
        }
      }
      attachPatchData(context.native, context);
      mpValue = context;
    }
  } else {
    var rElement = target;
    ngDevMode && assertDomNode(rElement);
    var parent_1 = rElement;
    while (parent_1 = parent_1.parentNode) {
      var parentContext = readPatchedData(parent_1);
      if (parentContext) {
        var lView = void 0;
        if (Array.isArray(parentContext)) {
          lView = parentContext;
        } else {
          lView = parentContext.lView;
        }
        if (!lView) {
          return null;
        }
        var index = findViaNativeElement(lView, rElement);
        if (index >= 0) {
          var native = unwrapRNode(lView[index]);
          var context = createLContext(lView, index, native);
          attachPatchData(native, context);
          mpValue = context;
          break;
        }
      }
    }
  }
  return mpValue || null;
}
exports.ɵgetLContext = getLContext;
function createLContext(lView, nodeIndex, native) {
  return {
    lView: lView,
    nodeIndex: nodeIndex,
    native: native,
    component: undefined,
    directives: undefined,
    localRefs: undefined
  };
}
function getComponentViewByInstance(componentInstance) {
  var lView = readPatchedData(componentInstance);
  var view;
  if (Array.isArray(lView)) {
    var nodeIndex = findViaComponent(lView, componentInstance);
    view = getComponentViewByIndex(nodeIndex, lView);
    var context = createLContext(lView, nodeIndex, view[HOST]);
    context.component = componentInstance;
    attachPatchData(componentInstance, context);
    attachPatchData(context.native, context);
  } else {
    var context = lView;
    view = getComponentViewByIndex(context.nodeIndex, context.lView);
  }
  return view;
}
function attachPatchData(target, data) {
  target[MONKEY_PATCH_KEY_NAME] = data;
}
function isComponentInstance(instance) {
  return instance && instance.constructor && instance.constructor.ngComponentDef;
}
function isDirectiveInstance(instance) {
  return instance && instance.constructor && instance.constructor.ngDirectiveDef;
}
function findViaNativeElement(lView, target) {
  var tNode = lView[TVIEW].firstChild;
  while (tNode) {
    var native = getNativeByTNodeOrNull(tNode, lView);
    if (native === target) {
      return tNode.index;
    }
    tNode = traverseNextElement(tNode);
  }
  return -1;
}
function traverseNextElement(tNode) {
  if (tNode.child) {
    return tNode.child;
  } else if (tNode.next) {
    return tNode.next;
  } else {
    while (tNode.parent && !tNode.parent.next) {
      tNode = tNode.parent;
    }
    return tNode.parent && tNode.parent.next;
  }
}
function findViaComponent(lView, componentInstance) {
  var componentIndices = lView[TVIEW].components;
  if (componentIndices) {
    for (var i = 0; i < componentIndices.length; i++) {
      var elementComponentIndex = componentIndices[i];
      var componentView = getComponentViewByIndex(elementComponentIndex, lView);
      if (componentView[CONTEXT] === componentInstance) {
        return elementComponentIndex;
      }
    }
  } else {
    var rootComponentView = getComponentViewByIndex(HEADER_OFFSET, lView);
    var rootComponent = rootComponentView[CONTEXT];
    if (rootComponent === componentInstance) {
      return HEADER_OFFSET;
    }
  }
  return -1;
}
function findViaDirective(lView, directiveInstance) {
  var tNode = lView[TVIEW].firstChild;
  while (tNode) {
    var directiveIndexStart = tNode.directiveStart;
    var directiveIndexEnd = tNode.directiveEnd;
    for (var i = directiveIndexStart; i < directiveIndexEnd; i++) {
      if (lView[i] === directiveInstance) {
        return tNode.index;
      }
    }
    tNode = traverseNextElement(tNode);
  }
  return -1;
}
function getDirectivesAtNodeIndex(nodeIndex, lView, includeComponents) {
  var tNode = lView[TVIEW].data[nodeIndex];
  var directiveStartIndex = tNode.directiveStart;
  if (directiveStartIndex == 0) return EMPTY_ARRAY;
  var directiveEndIndex = tNode.directiveEnd;
  if (!includeComponents && tNode.flags & 1) directiveStartIndex++;
  return lView.slice(directiveStartIndex, directiveEndIndex);
}
function getComponentAtNodeIndex(nodeIndex, lView) {
  var tNode = lView[TVIEW].data[nodeIndex];
  var directiveStartIndex = tNode.directiveStart;
  return tNode.flags & 1 ? lView[directiveStartIndex] : null;
}
function discoverLocalRefs(lView, nodeIndex) {
  var tNode = lView[TVIEW].data[nodeIndex];
  if (tNode && tNode.localNames) {
    var result = {};
    var localIndex = tNode.index + 1;
    for (var i = 0; i < tNode.localNames.length; i += 2) {
      result[tNode.localNames[i]] = lView[localIndex];
      localIndex++;
    }
    return result;
  }
  return null;
}
function throwCyclicDependencyError(token) {
  throw new Error("Cannot instantiate cyclic dependency! " + token);
}
function throwMultipleComponentError(tNode) {
  throw new Error("Multiple components match node with tagname " + tNode.tagName);
}
function throwErrorIfNoChangesMode(creationMode, oldValue, currValue) {
  var msg = "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: '" + oldValue + "'. Current value: '" + currValue + "'.";
  if (creationMode) {
    msg += " It seems like the view has been created after its parent and its children have been dirty checked." + " Has it been created in a change detection hook ?";
  }
  throw new Error(msg);
}
function throwMixedMultiProviderError() {
  throw new Error("Cannot mix multi providers and regular providers");
}
function throwInvalidProviderError(ngModuleType, providers, provider) {
  var ngModuleDetail = "";
  if (ngModuleType && providers) {
    var providerDetail = providers.map(function (v) {
      return v == provider ? "?" + provider + "?" : "...";
    });
    ngModuleDetail = " - only instances of Provider and Type are allowed, got: [" + providerDetail.join(", ") + "]";
  }
  throw new Error("Invalid provider for the NgModule '" + stringify(ngModuleType) + "'" + ngModuleDetail);
}
var unusedValueExportToPlacateAjd$4 = 1;
var unusedValueExportToPlacateAjd$5 = 1;
var unusedValueToPlacateAjd = unusedValueExportToPlacateAjd$4 + unusedValueExportToPlacateAjd$5;
var NG_TEMPLATE_SELECTOR = "ng-template";
function isCssClassMatching(nodeClassAttrVal, cssClassToMatch) {
  var nodeClassesLen = nodeClassAttrVal.length;
  var matchIndex = nodeClassAttrVal.indexOf(cssClassToMatch);
  var matchEndIdx = matchIndex + cssClassToMatch.length;
  if (matchIndex === -1 || matchIndex > 0 && nodeClassAttrVal[matchIndex - 1] !== " " || matchEndIdx < nodeClassesLen && nodeClassAttrVal[matchEndIdx] !== " ") {
    return false;
  }
  return true;
}
function hasTagAndTypeMatch(tNode, currentSelector, isProjectionMode) {
  var tagNameToCompare = tNode.type === 0 && !isProjectionMode ? NG_TEMPLATE_SELECTOR : tNode.tagName;
  return currentSelector === tagNameToCompare;
}
function isNodeMatchingSelector(tNode, selector, isProjectionMode) {
  ngDevMode && assertDefined(selector[0], "Selector should have a tag name");
  var mode = 4;
  var nodeAttrs = tNode.attrs || [];
  var nameOnlyMarkerIdx = getNameOnlyMarkerIndex(nodeAttrs);
  var skipToNextSelector = false;
  for (var i = 0; i < selector.length; i++) {
    var current = selector[i];
    if (typeof current === "number") {
      if (!skipToNextSelector && !isPositive(mode) && !isPositive(current)) {
        return false;
      }
      if (skipToNextSelector && isPositive(current)) continue;
      skipToNextSelector = false;
      mode = current | mode & 1;
      continue;
    }
    if (skipToNextSelector) continue;
    if (mode & 4) {
      mode = 2 | mode & 1;
      if (current !== "" && !hasTagAndTypeMatch(tNode, current, isProjectionMode) || current === "" && selector.length === 1) {
        if (isPositive(mode)) return false;
        skipToNextSelector = true;
      }
    } else {
      var selectorAttrValue = mode & 8 ? current : selector[++i];
      if (mode & 8 && tNode.classes) {
        if (!isCssClassMatching(getInitialStylingValue(tNode.classes), selectorAttrValue)) {
          if (isPositive(mode)) return false;
          skipToNextSelector = true;
        }
        continue;
      }
      var isInlineTemplate = tNode.type == 0 && tNode.tagName !== NG_TEMPLATE_SELECTOR;
      var attrName = mode & 8 ? "class" : current;
      var attrIndexInNode = findAttrIndexInNode(attrName, nodeAttrs, isInlineTemplate, isProjectionMode);
      if (attrIndexInNode === -1) {
        if (isPositive(mode)) return false;
        skipToNextSelector = true;
        continue;
      }
      if (selectorAttrValue !== "") {
        var nodeAttrValue = void 0;
        if (attrIndexInNode > nameOnlyMarkerIdx) {
          nodeAttrValue = "";
        } else {
          ngDevMode && assertNotEqual(nodeAttrs[attrIndexInNode], 0, "We do not match directives on namespaced attributes");
          nodeAttrValue = nodeAttrs[attrIndexInNode + 1];
        }
        var compareAgainstClassName = mode & 8 ? nodeAttrValue : null;
        if (compareAgainstClassName && !isCssClassMatching(compareAgainstClassName, selectorAttrValue) || mode & 2 && selectorAttrValue !== nodeAttrValue) {
          if (isPositive(mode)) return false;
          skipToNextSelector = true;
        }
      }
    }
  }
  return isPositive(mode) || skipToNextSelector;
}
function isPositive(mode) {
  return (mode & 1) === 0;
}
function findAttrIndexInNode(name, attrs, isInlineTemplate, isProjectionMode) {
  if (attrs === null) return -1;
  var i = 0;
  if (isProjectionMode || !isInlineTemplate) {
    var bindingsMode = false;
    while (i < attrs.length) {
      var maybeAttrName = attrs[i];
      if (maybeAttrName === name) {
        return i;
      } else if (maybeAttrName === 3 || maybeAttrName === 6) {
        bindingsMode = true;
      } else if (maybeAttrName === 1) {
        var value = attrs[++i];
        while (typeof value === "string") {
          value = attrs[++i];
        }
        continue;
      } else if (maybeAttrName === 4) {
        break;
      } else if (maybeAttrName === 0) {
        i += 4;
        continue;
      }
      i += bindingsMode ? 1 : 2;
    }
    return -1;
  } else {
    return matchTemplateAttribute(attrs, name);
  }
}
function isNodeMatchingSelectorList(tNode, selector, isProjectionMode) {
  if (isProjectionMode === void 0) {
    isProjectionMode = false;
  }
  for (var i = 0; i < selector.length; i++) {
    if (isNodeMatchingSelector(tNode, selector[i], isProjectionMode)) {
      return true;
    }
  }
  return false;
}
function getProjectAsAttrValue(tNode) {
  var nodeAttrs = tNode.attrs;
  if (nodeAttrs != null) {
    var ngProjectAsAttrIdx = nodeAttrs.indexOf(5);
    if ((ngProjectAsAttrIdx & 1) === 0) {
      return nodeAttrs[ngProjectAsAttrIdx + 1];
    }
  }
  return null;
}
function getNameOnlyMarkerIndex(nodeAttrs) {
  for (var i = 0; i < nodeAttrs.length; i++) {
    var nodeAttr = nodeAttrs[i];
    if (isNameOnlyAttributeMarker(nodeAttr)) {
      return i;
    }
  }
  return nodeAttrs.length;
}
function matchTemplateAttribute(attrs, name) {
  var i = attrs.indexOf(4);
  if (i > -1) {
    i++;
    while (i < attrs.length) {
      if (attrs[i] === name) return i;
      i++;
    }
  }
  return -1;
}
function isSelectorInSelectorList(selector, list) {
  selectorListLoop: for (var i = 0; i < list.length; i++) {
    var currentSelectorInList = list[i];
    if (selector.length !== currentSelectorInList.length) {
      continue;
    }
    for (var j = 0; j < selector.length; j++) {
      if (selector[j] !== currentSelectorInList[j]) {
        continue selectorListLoop;
      }
    }
    return true;
  }
  return false;
}
var DEFAULT_GUARD_MASK_VALUE = 1;
var STYLING_INDEX_FOR_MAP_BINDING = 0;
var DEFAULT_BINDING_VALUE = null;
var DEFAULT_SIZE_VALUE = 1;
var deferredBindingQueue = [];
function updateClassBinding(context, data, element, prop, bindingIndex, value, deferRegistration, forceUpdate) {
  var isMapBased = !prop;
  var state = getStylingState(element, stateIsPersisted(context));
  var index = isMapBased ? STYLING_INDEX_FOR_MAP_BINDING : state.classesIndex++;
  var updated = updateBindingData(context, data, index, prop, bindingIndex, value, deferRegistration, forceUpdate, false);
  if (updated || forceUpdate) {
    state.classesBitMask |= 1 << index;
    return true;
  }
  return false;
}
function updateStyleBinding(context, data, element, prop, bindingIndex, value, sanitizer, deferRegistration, forceUpdate) {
  var isMapBased = !prop;
  var state = getStylingState(element, stateIsPersisted(context));
  var index = isMapBased ? STYLING_INDEX_FOR_MAP_BINDING : state.stylesIndex++;
  var sanitizationRequired = isMapBased ? true : sanitizer ? sanitizer(prop, null, 1) : false;
  var updated = updateBindingData(context, data, index, prop, bindingIndex, value, deferRegistration, forceUpdate, sanitizationRequired);
  if (updated || forceUpdate) {
    state.stylesBitMask |= 1 << index;
    return true;
  }
  return false;
}
function updateBindingData(context, data, counterIndex, prop, bindingIndex, value, deferRegistration, forceUpdate, sanitizationRequired) {
  if (!isContextLocked(context)) {
    if (deferRegistration) {
      deferBindingRegistration(context, counterIndex, prop, bindingIndex, sanitizationRequired);
    } else {
      deferredBindingQueue.length && flushDeferredBindings();
      registerBinding(context, counterIndex, prop, bindingIndex, sanitizationRequired);
    }
  }
  var changed = forceUpdate || hasValueChanged(data[bindingIndex], value);
  if (changed) {
    data[bindingIndex] = value;
  }
  return changed;
}
function deferBindingRegistration(context, counterIndex, prop, bindingIndex, sanitizationRequired) {
  deferredBindingQueue.unshift(context, counterIndex, prop, bindingIndex, sanitizationRequired);
}
function flushDeferredBindings() {
  var i = 0;
  while (i < deferredBindingQueue.length) {
    var context = deferredBindingQueue[i++];
    var count = deferredBindingQueue[i++];
    var prop = deferredBindingQueue[i++];
    var bindingIndex = deferredBindingQueue[i++];
    var sanitizationRequired = deferredBindingQueue[i++];
    registerBinding(context, count, prop, bindingIndex, sanitizationRequired);
  }
  deferredBindingQueue.length = 0;
}
function registerBinding(context, countId, prop, bindingValue, sanitizationRequired) {
  var registered = false;
  if (prop) {
    var found = false;
    var i = getPropValuesStartPosition(context);
    while (i < context.length) {
      var valuesCount = getValuesCount(context, i);
      var p = getProp(context, i);
      found = prop <= p;
      if (found) {
        if (prop < p) {
          allocateNewContextEntry(context, i, prop, sanitizationRequired);
        }
        addBindingIntoContext(context, false, i, bindingValue, countId);
        break;
      }
      i += 3 + valuesCount;
    }
    if (!found) {
      allocateNewContextEntry(context, context.length, prop, sanitizationRequired);
      addBindingIntoContext(context, false, i, bindingValue, countId);
      registered = true;
    }
  } else {
    addBindingIntoContext(context, true, 3, bindingValue, countId);
    registered = true;
  }
  return registered;
}
function allocateNewContextEntry(context, index, prop, sanitizationRequired) {
  var config = sanitizationRequired ? 1 : 0;
  context.splice(index, 0, config, DEFAULT_SIZE_VALUE, prop, DEFAULT_BINDING_VALUE);
  setGuardMask(context, index, DEFAULT_GUARD_MASK_VALUE);
}
function addBindingIntoContext(context, isMapBased, index, bindingValue, countId) {
  var valuesCount = getValuesCount(context, index);
  var firstValueIndex = index + 3;
  var lastValueIndex = firstValueIndex + valuesCount;
  if (!isMapBased) {
    lastValueIndex--;
  }
  if (typeof bindingValue === "number") {
    for (var i = firstValueIndex; i <= lastValueIndex; i++) {
      var indexAtPosition = context[i];
      if (indexAtPosition === bindingValue) return;
    }
    context.splice(lastValueIndex, 0, bindingValue);
    context[index + 1]++;
    var guardMask = getGuardMask(context, index) | 1 << countId;
    setGuardMask(context, index, guardMask);
  } else if (bindingValue !== null && context[lastValueIndex] == null) {
    context[lastValueIndex] = bindingValue;
  }
}
function flushStyling(renderer, data, classesContext, stylesContext, element, directiveIndex, styleSanitizer) {
  ngDevMode && ngDevMode.flushStyling++;
  var persistState = classesContext ? stateIsPersisted(classesContext) : stylesContext ? stateIsPersisted(stylesContext) : false;
  var allowFlushClasses = allowStylingFlush(classesContext, directiveIndex);
  var allowFlushStyles = allowStylingFlush(stylesContext, directiveIndex);
  if (deferredBindingQueue.length && (allowFlushClasses || allowFlushStyles)) {
    flushDeferredBindings();
  }
  var state = getStylingState(element, persistState);
  var classesFlushed = maybeApplyStyling(renderer, element, data, classesContext, allowFlushClasses, state.classesBitMask, setClass, null);
  var stylesFlushed = maybeApplyStyling(renderer, element, data, stylesContext, allowFlushStyles, state.stylesBitMask, setStyle, styleSanitizer);
  if (classesFlushed && stylesFlushed) {
    resetStylingState();
    if (persistState) {
      deleteStylingStateFromStorage(element);
    }
  } else if (persistState) {
    storeStylingState(element, state);
  }
}
function maybeApplyStyling(renderer, element, data, context, allowFlush, bitMask, styleSetter, styleSanitizer) {
  if (allowFlush && context) {
    lockAndFinalizeContext(context);
    if (contextHasUpdates(context, bitMask)) {
      ngDevMode && (styleSanitizer ? ngDevMode.stylesApplied++ : ngDevMode.classesApplied++);
      applyStyling(context, renderer, element, data, bitMask, styleSetter, styleSanitizer);
      return true;
    }
  }
  return allowFlush;
}
function contextHasUpdates(context, bitMask) {
  return context && bitMask > BIT_MASK_START_VALUE;
}
function lockAndFinalizeContext(context) {
  if (!isContextLocked(context)) {
    var initialValues = getStylingMapArray(context);
    if (initialValues) {
      updateInitialStylingOnContext(context, initialValues);
    }
    lockContext(context);
  }
}
function applyStyling(context, renderer, element, bindingData, bitMaskValue, applyStylingFn, sanitizer) {
  var bitMask = normalizeBitMaskValue(bitMaskValue);
  var stylingMapsSyncFn = getStylingMapsSyncFn();
  var mapsGuardMask = getGuardMask(context, 3);
  var applyAllValues = (bitMask & mapsGuardMask) > 0;
  var mapsMode = applyAllValues ? 1 : 0;
  var i = getPropValuesStartPosition(context);
  while (i < context.length) {
    var valuesCount = getValuesCount(context, i);
    var guardMask = getGuardMask(context, i);
    if (bitMask & guardMask) {
      var valueApplied = false;
      var prop = getProp(context, i);
      var valuesCountUpToDefault = valuesCount - 1;
      var defaultValue = getBindingValue(context, i, valuesCountUpToDefault);
      for (var j = 0; j < valuesCountUpToDefault; j++) {
        var bindingIndex = getBindingValue(context, i, j);
        var value = bindingData[bindingIndex];
        if (isStylingValueDefined(value)) {
          var finalValue = sanitizer && isSanitizationRequired(context, i) ? sanitizer(prop, value, 2) : value;
          applyStylingFn(renderer, element, prop, finalValue, bindingIndex);
          valueApplied = true;
          break;
        }
      }
      if (stylingMapsSyncFn) {
        var mode = mapsMode | (valueApplied ? 4 : 2);
        var valueAppliedWithinMap = stylingMapsSyncFn(context, renderer, element, bindingData, applyStylingFn, sanitizer, mode, prop, defaultValue);
        valueApplied = valueApplied || valueAppliedWithinMap;
      }
      if (!valueApplied) {
        applyStylingFn(renderer, element, prop, defaultValue);
      }
    }
    i += 3 + valuesCount;
  }
  if (stylingMapsSyncFn) {
    stylingMapsSyncFn(context, renderer, element, bindingData, applyStylingFn, sanitizer, mapsMode);
  }
}
function normalizeBitMaskValue(value) {
  if (value === true) return -1;
  if (value === false) return 0;
  return value;
}
var _activeStylingMapApplyFn = null;
function getStylingMapsSyncFn() {
  return _activeStylingMapApplyFn;
}
function setStylingMapsSyncFn(fn) {
  _activeStylingMapApplyFn = fn;
}
var setStyle = function (renderer, native, prop, value) {
  var nativeStyle = native.style;
  if (value) {
    value = value.toString();
    ngDevMode && ngDevMode.rendererSetStyle++;
    renderer && isProceduralRenderer(renderer) ? renderer.setStyle(native, prop, value, RendererStyleFlags3.DashCase) : nativeStyle && nativeStyle.setProperty(prop, value);
  } else {
    ngDevMode && ngDevMode.rendererRemoveStyle++;
    renderer && isProceduralRenderer(renderer) ? renderer.removeStyle(native, prop, RendererStyleFlags3.DashCase) : nativeStyle && nativeStyle.removeProperty(prop);
  }
};
var ɵ0$4 = setStyle;
var setClass = function (renderer, native, className, value) {
  if (className !== "") {
    var classList = native.classList;
    if (value) {
      ngDevMode && ngDevMode.rendererAddClass++;
      renderer && isProceduralRenderer(renderer) ? renderer.addClass(native, className) : classList && classList.add(className);
    } else {
      ngDevMode && ngDevMode.rendererRemoveClass++;
      renderer && isProceduralRenderer(renderer) ? renderer.removeClass(native, className) : classList && classList.remove(className);
    }
  }
};
var ɵ1$1 = setClass;
function renderStylingMap(renderer, element, stylingValues, isClassBased) {
  var stylingMapArr = getStylingMapArray(stylingValues);
  if (stylingMapArr) {
    for (var i = 1; i < stylingMapArr.length; i += 2) {
      var prop = getMapProp(stylingMapArr, i);
      var value = getMapValue(stylingMapArr, i);
      if (isClassBased) {
        setClass(renderer, element, prop, value, null);
      } else {
        setStyle(renderer, element, prop, value, null);
      }
    }
  }
}
function updateInitialStylingOnContext(context, initialStyling) {
  var INITIAL_STYLING_COUNT_ID = -1;
  for (var i = 1; i < initialStyling.length; i += 2) {
    var value = getMapValue(initialStyling, i);
    if (value) {
      var prop = getMapProp(initialStyling, i);
      registerBinding(context, INITIAL_STYLING_COUNT_ID, prop, value, false);
    }
  }
}
var NO_CHANGE = {};
exports.ɵNO_CHANGE = NO_CHANGE;
var ELEMENT_MARKER = {
  marker: "element"
};
var COMMENT_MARKER = {
  marker: "comment"
};
var unusedValueExportToPlacateAjd$6 = 1;
function attachDebugObject(obj, debug) {
  Object.defineProperty(obj, "debug", {
    value: debug,
    enumerable: false
  });
}
var syncStylingMap = function (context, renderer, element, data, applyStylingFn, sanitizer, mode, targetProp, defaultValue) {
  var targetPropValueWasApplied = false;
  var totalMaps = getValuesCount(context, 3);
  if (totalMaps) {
    var runTheSyncAlgorithm = true;
    var loopUntilEnd = !targetProp;
    if (loopUntilEnd && mode & ~1) {
      runTheSyncAlgorithm = false;
      targetPropValueWasApplied = true;
    }
    if (runTheSyncAlgorithm) {
      targetPropValueWasApplied = innerSyncStylingMap(context, renderer, element, data, applyStylingFn, sanitizer, mode, targetProp || null, 0, defaultValue || null);
    }
    if (loopUntilEnd) {
      resetSyncCursors();
    }
  }
  return targetPropValueWasApplied;
};
function innerSyncStylingMap(context, renderer, element, data, applyStylingFn, sanitizer, mode, targetProp, currentMapIndex, defaultValue) {
  var targetPropValueWasApplied = false;
  var totalMaps = getValuesCount(context, 3);
  if (currentMapIndex < totalMaps) {
    var bindingIndex = getBindingValue(context, 3, currentMapIndex);
    var stylingMapArr = data[bindingIndex];
    var cursor = getCurrentSyncCursor(currentMapIndex);
    while (cursor < stylingMapArr.length) {
      var prop = getMapProp(stylingMapArr, cursor);
      var iteratedTooFar = targetProp && prop > targetProp;
      var isTargetPropMatched = !iteratedTooFar && prop === targetProp;
      var value = getMapValue(stylingMapArr, cursor);
      var valueIsDefined = isStylingValueDefined(value);
      var innerMode = iteratedTooFar ? mode : resolveInnerMapMode(mode, valueIsDefined, isTargetPropMatched);
      var innerProp = iteratedTooFar ? targetProp : prop;
      var valueApplied = innerSyncStylingMap(context, renderer, element, data, applyStylingFn, sanitizer, innerMode, innerProp, currentMapIndex + 1, defaultValue);
      if (iteratedTooFar) {
        if (!targetPropValueWasApplied) {
          targetPropValueWasApplied = valueApplied;
        }
        break;
      }
      if (!valueApplied && isValueAllowedToBeApplied(mode, isTargetPropMatched)) {
        var useDefault = isTargetPropMatched && !valueIsDefined;
        var valueToApply = useDefault ? defaultValue : value;
        var bindingIndexToApply = useDefault ? bindingIndex : null;
        var finalValue = sanitizer ? sanitizer(prop, valueToApply, 3) : valueToApply;
        applyStylingFn(renderer, element, prop, finalValue, bindingIndexToApply);
        valueApplied = true;
      }
      targetPropValueWasApplied = valueApplied && isTargetPropMatched;
      cursor += 2;
    }
    setCurrentSyncCursor(currentMapIndex, cursor);
    if (stylingMapArr.length === 1 || !targetProp) {
      return innerSyncStylingMap(context, renderer, element, data, applyStylingFn, sanitizer, mode, targetProp, currentMapIndex + 1, defaultValue);
    }
  }
  return targetPropValueWasApplied;
}
function activateStylingMapFeature() {
  setStylingMapsSyncFn(syncStylingMap);
}
function resolveInnerMapMode(currentMode, valueIsDefined, isExactMatch) {
  var innerMode = currentMode;
  if (!valueIsDefined && !(currentMode & 4) && (isExactMatch || currentMode & 1)) {
    innerMode |= 2;
    innerMode &= ~4;
  } else {
    innerMode |= 4;
    innerMode &= ~2;
  }
  return innerMode;
}
function isValueAllowedToBeApplied(mode, isTargetPropMatched) {
  var doApplyValue = (mode & 1) > 0;
  if (!doApplyValue) {
    if (mode & 2) {
      doApplyValue = isTargetPropMatched;
    }
  } else if (mode & 4 && isTargetPropMatched) {
    doApplyValue = false;
  }
  return doApplyValue;
}
var MAP_CURSORS = [];
function resetSyncCursors() {
  for (var i = 0; i < MAP_CURSORS.length; i++) {
    MAP_CURSORS[i] = 1;
  }
}
function getCurrentSyncCursor(mapIndex) {
  if (mapIndex >= MAP_CURSORS.length) {
    MAP_CURSORS.push(1);
  }
  return MAP_CURSORS[mapIndex];
}
function setCurrentSyncCursor(mapIndex, indexValue) {
  MAP_CURSORS[mapIndex] = indexValue;
}
function normalizeIntoStylingMap(bindingValue, newValues, normalizeProps) {
  var stylingMapArr = Array.isArray(bindingValue) ? bindingValue : [null];
  stylingMapArr[0] = newValues || null;
  for (var j = 1; j < stylingMapArr.length; j += 2) {
    setMapValue(stylingMapArr, j, null);
  }
  var props = null;
  var map;
  var allValuesTrue = false;
  if (typeof newValues === "string") {
    if (newValues.length) {
      props = newValues.split(/\s+/);
      allValuesTrue = true;
    }
  } else {
    props = newValues ? Object.keys(newValues) : null;
    map = newValues;
  }
  if (props) {
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var newProp = normalizeProps ? hyphenate(prop) : prop;
      var value = allValuesTrue ? true : map[prop];
      addItemToStylingMap(stylingMapArr, newProp, value, true);
    }
  }
  return stylingMapArr;
}
function addItemToStylingMap(stylingMapArr, prop, value, allowOverwrite) {
  for (var j = 1; j < stylingMapArr.length; j += 2) {
    var propAtIndex = getMapProp(stylingMapArr, j);
    if (prop <= propAtIndex) {
      var applied = false;
      if (propAtIndex === prop) {
        var valueAtIndex = stylingMapArr[j];
        if (allowOverwrite || !isStylingValueDefined(valueAtIndex)) {
          applied = true;
          setMapValue(stylingMapArr, j, value);
        }
      } else {
        applied = true;
        stylingMapArr.splice(j, 0, prop, value);
      }
      return applied;
    }
  }
  stylingMapArr.push(prop, value);
  return true;
}
function stylingMapToString(map, isClassBased) {
  var str = "";
  for (var i = 1; i < map.length; i += 2) {
    var prop = getMapProp(map, i);
    var value = getMapValue(map, i);
    var attrValue = concatString(prop, isClassBased ? "" : value, ":");
    str = concatString(str, attrValue, isClassBased ? " " : "; ");
  }
  return str;
}
function stylingMapToStringMap(map) {
  var stringMap = {};
  if (map) {
    for (var i = 1; i < map.length; i += 2) {
      var prop = getMapProp(map, i);
      var value = getMapValue(map, i);
      stringMap[prop] = value;
    }
  }
  return stringMap;
}
function attachStylingDebugObject(context) {
  var debug = new TStylingContextDebug(context);
  attachDebugObject(context, debug);
  return debug;
}
var TStylingContextDebug = (function () {
  function TStylingContextDebug(context) {
    this.context = context;
  }
  Object.defineProperty(TStylingContextDebug.prototype, "isLocked", {
    get: function () {
      return isContextLocked(this.context);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(TStylingContextDebug.prototype, "entries", {
    get: function () {
      var context = this.context;
      var entries = {};
      var start = 3;
      var i = start;
      while (i < context.length) {
        var valuesCount = getValuesCount(context, i);
        if (valuesCount) {
          var prop = getProp(context, i);
          var guardMask = getGuardMask(context, i);
          var defaultValue = getDefaultValue(context, i);
          var sanitizationRequired = isSanitizationRequired(context, i);
          var bindingsStartPosition = i + 3;
          var sources = [];
          for (var j = 0; j < valuesCount; j++) {
            sources.push(context[bindingsStartPosition + j]);
          }
          entries[prop] = {
            prop: prop,
            guardMask: guardMask,
            sanitizationRequired: sanitizationRequired,
            valuesCount: valuesCount,
            defaultValue: defaultValue,
            sources: sources
          };
        }
        i += 3 + valuesCount;
      }
      return entries;
    },
    enumerable: true,
    configurable: true
  });
  return TStylingContextDebug;
})();
var NodeStylingDebug = (function () {
  function NodeStylingDebug(context, _data, _isClassBased) {
    this.context = context;
    this._data = _data;
    this._isClassBased = _isClassBased;
    this._sanitizer = null;
  }
  NodeStylingDebug.prototype.overrideSanitizer = function (sanitizer) {
    this._sanitizer = sanitizer;
  };
  Object.defineProperty(NodeStylingDebug.prototype, "summary", {
    get: function () {
      var entries = {};
      this._mapValues(function (prop, value, bindingIndex) {
        entries[prop] = {
          prop: prop,
          value: value,
          bindingIndex: bindingIndex
        };
      });
      return entries;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(NodeStylingDebug.prototype, "values", {
    get: function () {
      var entries = {};
      this._mapValues(function (prop, value) {
        entries[prop] = value;
      });
      return entries;
    },
    enumerable: true,
    configurable: true
  });
  NodeStylingDebug.prototype._mapValues = function (fn) {
    var mockElement = {};
    var hasMaps = getValuesCount(this.context, 3) > 0;
    if (hasMaps) {
      activateStylingMapFeature();
    }
    var mapFn = function (renderer, element, prop, value, bindingIndex) {
      fn(prop, value, bindingIndex || null);
    };
    var sanitizer = this._isClassBased ? null : this._sanitizer || getCurrentStyleSanitizer();
    applyStyling(this.context, null, mockElement, this._data, true, mapFn, sanitizer);
  };
  return NodeStylingDebug;
})();
var LViewArray = ngDevMode && createNamedArrayType("LView");
var LVIEW_EMPTY;
function cloneToLView(list) {
  if (LVIEW_EMPTY === undefined) LVIEW_EMPTY = new LViewArray();
  return LVIEW_EMPTY.concat(list);
}
var TViewConstructor = (function () {
  function TView(id, blueprint, template, queries, viewQuery, node, data, bindingStartIndex, expandoStartIndex, expandoInstructions, firstTemplatePass, staticViewQueries, staticContentQueries, preOrderHooks, preOrderCheckHooks, contentHooks, contentCheckHooks, viewHooks, viewCheckHooks, destroyHooks, cleanup, contentQueries, components, directiveRegistry, pipeRegistry, firstChild, schemas) {
    this.id = id;
    this.blueprint = blueprint;
    this.template = template;
    this.queries = queries;
    this.viewQuery = viewQuery;
    this.node = node;
    this.data = data;
    this.bindingStartIndex = bindingStartIndex;
    this.expandoStartIndex = expandoStartIndex;
    this.expandoInstructions = expandoInstructions;
    this.firstTemplatePass = firstTemplatePass;
    this.staticViewQueries = staticViewQueries;
    this.staticContentQueries = staticContentQueries;
    this.preOrderHooks = preOrderHooks;
    this.preOrderCheckHooks = preOrderCheckHooks;
    this.contentHooks = contentHooks;
    this.contentCheckHooks = contentCheckHooks;
    this.viewHooks = viewHooks;
    this.viewCheckHooks = viewCheckHooks;
    this.destroyHooks = destroyHooks;
    this.cleanup = cleanup;
    this.contentQueries = contentQueries;
    this.components = components;
    this.directiveRegistry = directiveRegistry;
    this.pipeRegistry = pipeRegistry;
    this.firstChild = firstChild;
    this.schemas = schemas;
  }
  return TView;
})();
var TNodeConstructor = (function () {
  function TNode(tView_, type, index, injectorIndex, directiveStart, directiveEnd, propertyMetadataStartIndex, propertyMetadataEndIndex, flags, providerIndexes, tagName, attrs, localNames, initialInputs, inputs, outputs, tViews, next, projectionNext, child, parent, projection, styles, classes) {
    this.tView_ = tView_;
    this.type = type;
    this.index = index;
    this.injectorIndex = injectorIndex;
    this.directiveStart = directiveStart;
    this.directiveEnd = directiveEnd;
    this.propertyMetadataStartIndex = propertyMetadataStartIndex;
    this.propertyMetadataEndIndex = propertyMetadataEndIndex;
    this.flags = flags;
    this.providerIndexes = providerIndexes;
    this.tagName = tagName;
    this.attrs = attrs;
    this.localNames = localNames;
    this.initialInputs = initialInputs;
    this.inputs = inputs;
    this.outputs = outputs;
    this.tViews = tViews;
    this.next = next;
    this.projectionNext = projectionNext;
    this.child = child;
    this.parent = parent;
    this.projection = projection;
    this.styles = styles;
    this.classes = classes;
  }
  Object.defineProperty(TNode.prototype, "type_", {
    get: function () {
      switch (this.type) {
        case 0:
          return "TNodeType.Container";
        case 3:
          return "TNodeType.Element";
        case 4:
          return "TNodeType.ElementContainer";
        case 5:
          return "TNodeType.IcuContainer";
        case 1:
          return "TNodeType.Projection";
        case 2:
          return "TNodeType.View";
        default:
          return "TNodeType.???";
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(TNode.prototype, "flags_", {
    get: function () {
      var flags = [];
      if (this.flags & 8) flags.push("TNodeFlags.hasClassInput");
      if (this.flags & 4) flags.push("TNodeFlags.hasContentQuery");
      if (this.flags & 16) flags.push("TNodeFlags.hasStyleInput");
      if (this.flags & 1) flags.push("TNodeFlags.isComponent");
      if (this.flags & 32) flags.push("TNodeFlags.isDetached");
      if (this.flags & 2) flags.push("TNodeFlags.isProjected");
      return flags.join("|");
    },
    enumerable: true,
    configurable: true
  });
  return TNode;
})();
var TViewData = ngDevMode && createNamedArrayType("TViewData");
var TVIEWDATA_EMPTY;
function cloneToTViewData(list) {
  if (TVIEWDATA_EMPTY === undefined) TVIEWDATA_EMPTY = new TViewData();
  return TVIEWDATA_EMPTY.concat(list);
}
var LViewBlueprint = ngDevMode && createNamedArrayType("LViewBlueprint");
var MatchesArray = ngDevMode && createNamedArrayType("MatchesArray");
var TViewComponents = ngDevMode && createNamedArrayType("TViewComponents");
var TNodeLocalNames = ngDevMode && createNamedArrayType("TNodeLocalNames");
var TNodeInitialInputs = ngDevMode && createNamedArrayType("TNodeInitialInputs");
var TNodeInitialData = ngDevMode && createNamedArrayType("TNodeInitialData");
var LCleanup = ngDevMode && createNamedArrayType("LCleanup");
var TCleanup = ngDevMode && createNamedArrayType("TCleanup");
function attachLViewDebug(lView) {
  attachDebugObject(lView, new LViewDebug(lView));
}
function attachLContainerDebug(lContainer) {
  attachDebugObject(lContainer, new LContainerDebug(lContainer));
}
function toDebug(obj) {
  if (obj) {
    var debug = obj.debug;
    assertDefined(debug, "Object does not have a debug representation.");
    return debug;
  } else {
    return obj;
  }
}
function toHtml(value, includeChildren) {
  if (includeChildren === void 0) {
    includeChildren = false;
  }
  var node = unwrapRNode(value);
  if (node) {
    var isTextNode = node.nodeType === Node.TEXT_NODE;
    var outerHTML = (isTextNode ? node.textContent : node.outerHTML) || "";
    if (includeChildren || isTextNode) {
      return outerHTML;
    } else {
      var innerHTML = node.innerHTML;
      return outerHTML.split(innerHTML)[0] || null;
    }
  } else {
    return null;
  }
}
var LViewDebug = (function () {
  function LViewDebug(_raw_lView) {
    this._raw_lView = _raw_lView;
  }
  Object.defineProperty(LViewDebug.prototype, "flags", {
    get: function () {
      var flags = this._raw_lView[FLAGS];
      return {
        __raw__flags__: flags,
        initPhaseState: flags & 3,
        creationMode: !!(flags & 4),
        firstViewPass: !!(flags & 8),
        checkAlways: !!(flags & 16),
        dirty: !!(flags & 64),
        attached: !!(flags & 128),
        destroyed: !!(flags & 256),
        isRoot: !!(flags & 512),
        indexWithinInitPhase: flags >> 10
      };
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LViewDebug.prototype, "parent", {
    get: function () {
      return toDebug(this._raw_lView[PARENT]);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LViewDebug.prototype, "host", {
    get: function () {
      return toHtml(this._raw_lView[HOST], true);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LViewDebug.prototype, "context", {
    get: function () {
      return this._raw_lView[CONTEXT];
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LViewDebug.prototype, "nodes", {
    get: function () {
      var lView = this._raw_lView;
      var tNode = lView[TVIEW].firstChild;
      return toDebugNodes(tNode, lView);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LViewDebug.prototype, "__other__", {
    get: function () {
      return {
        tView: this._raw_lView[TVIEW],
        cleanup: this._raw_lView[CLEANUP],
        injector: this._raw_lView[INJECTOR$1],
        rendererFactory: this._raw_lView[RENDERER_FACTORY],
        renderer: this._raw_lView[RENDERER],
        sanitizer: this._raw_lView[SANITIZER],
        childHead: toDebug(this._raw_lView[CHILD_HEAD]),
        next: toDebug(this._raw_lView[NEXT]),
        childTail: toDebug(this._raw_lView[CHILD_TAIL]),
        declarationView: toDebug(this._raw_lView[DECLARATION_VIEW]),
        queries: null,
        tHost: this._raw_lView[T_HOST],
        bindingIndex: this._raw_lView[BINDING_INDEX]
      };
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LViewDebug.prototype, "childViews", {
    get: function () {
      var childViews = [];
      var child = this.__other__.childHead;
      while (child) {
        childViews.push(child);
        child = child.__other__.next;
      }
      return childViews;
    },
    enumerable: true,
    configurable: true
  });
  return LViewDebug;
})();
function toDebugNodes(tNode, lView) {
  if (tNode) {
    var debugNodes = [];
    var tNodeCursor = tNode;
    while (tNodeCursor) {
      var rawValue = lView[tNode.index];
      var native = unwrapRNode(rawValue);
      var componentLViewDebug = toDebug(readLViewValue(rawValue));
      var styles = isStylingContext(tNode.styles) ? new NodeStylingDebug(tNode.styles, lView) : null;
      var classes = isStylingContext(tNode.classes) ? new NodeStylingDebug(tNode.classes, lView, true) : null;
      debugNodes.push({
        html: toHtml(native),
        native: native,
        styles: styles,
        classes: classes,
        nodes: toDebugNodes(tNode.child, lView),
        component: componentLViewDebug
      });
      tNodeCursor = tNodeCursor.next;
    }
    return debugNodes;
  } else {
    return null;
  }
}
var LContainerDebug = (function () {
  function LContainerDebug(_raw_lContainer) {
    this._raw_lContainer = _raw_lContainer;
  }
  Object.defineProperty(LContainerDebug.prototype, "activeIndex", {
    get: function () {
      return this._raw_lContainer[ACTIVE_INDEX];
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LContainerDebug.prototype, "views", {
    get: function () {
      return this._raw_lContainer.slice(CONTAINER_HEADER_OFFSET).map(toDebug);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LContainerDebug.prototype, "parent", {
    get: function () {
      return toDebug(this._raw_lContainer[PARENT]);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LContainerDebug.prototype, "movedViews", {
    get: function () {
      return this._raw_lContainer[MOVED_VIEWS];
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LContainerDebug.prototype, "host", {
    get: function () {
      return this._raw_lContainer[HOST];
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LContainerDebug.prototype, "native", {
    get: function () {
      return this._raw_lContainer[NATIVE];
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(LContainerDebug.prototype, "__other__", {
    get: function () {
      return {
        next: toDebug(this._raw_lContainer[NEXT])
      };
    },
    enumerable: true,
    configurable: true
  });
  return LContainerDebug;
})();
function readLViewValue(value) {
  while (Array.isArray(value)) {
    if (value.length >= HEADER_OFFSET - 1) return value;
    value = value[HOST];
  }
  return null;
}
var I18NDebugItem = (function () {
  function I18NDebugItem(__raw_opCode, _lView, nodeIndex, type) {
    this.__raw_opCode = __raw_opCode;
    this._lView = _lView;
    this.nodeIndex = nodeIndex;
    this.type = type;
  }
  Object.defineProperty(I18NDebugItem.prototype, "tNode", {
    get: function () {
      return getTNode(this.nodeIndex, this._lView);
    },
    enumerable: true,
    configurable: true
  });
  return I18NDebugItem;
})();
function attachI18nOpCodesDebug(mutateOpCodes, updateOpCodes, icus, lView) {
  attachDebugObject(mutateOpCodes, new I18nMutateOpCodesDebug(mutateOpCodes, lView));
  attachDebugObject(updateOpCodes, new I18nUpdateOpCodesDebug(updateOpCodes, icus, lView));
  if (icus) {
    icus.forEach(function (icu) {
      icu.create.forEach(function (icuCase) {
        attachDebugObject(icuCase, new I18nMutateOpCodesDebug(icuCase, lView));
      });
      icu.update.forEach(function (icuCase) {
        attachDebugObject(icuCase, new I18nUpdateOpCodesDebug(icuCase, icus, lView));
      });
    });
  }
}
var I18nMutateOpCodesDebug = (function () {
  function I18nMutateOpCodesDebug(__raw_opCodes, __lView) {
    this.__raw_opCodes = __raw_opCodes;
    this.__lView = __lView;
  }
  Object.defineProperty(I18nMutateOpCodesDebug.prototype, "operations", {
    get: function () {
      var _a = this, __lView = _a.__lView, __raw_opCodes = _a.__raw_opCodes;
      var results = [];
      for (var i = 0; i < __raw_opCodes.length; i++) {
        var opCode = __raw_opCodes[i];
        var result = void 0;
        if (typeof opCode === "string") {
          result = {
            __raw_opCode: opCode,
            type: "Create Text Node",
            nodeIndex: __raw_opCodes[++i],
            text: opCode
          };
        }
        if (typeof opCode === "number") {
          switch (opCode & 7) {
            case 1:
              var destinationNodeIndex = opCode >>> 17;
              result = new I18NDebugItem(opCode, __lView, destinationNodeIndex, "AppendChild");
              break;
            case 0:
              var nodeIndex = opCode >>> 3;
              result = new I18NDebugItem(opCode, __lView, nodeIndex, "Select");
              break;
            case 5:
              var elementIndex = opCode >>> 3;
              result = new I18NDebugItem(opCode, __lView, elementIndex, "ElementEnd");
              break;
            case 4:
              elementIndex = opCode >>> 3;
              result = new I18NDebugItem(opCode, __lView, elementIndex, "Attr");
              result["attrName"] = __raw_opCodes[++i];
              result["attrValue"] = __raw_opCodes[++i];
              break;
          }
        }
        if (!result) {
          switch (opCode) {
            case COMMENT_MARKER:
              result = {
                __raw_opCode: opCode,
                type: "COMMENT_MARKER",
                commentValue: __raw_opCodes[++i],
                nodeIndex: __raw_opCodes[++i]
              };
              break;
            case ELEMENT_MARKER:
              result = {
                __raw_opCode: opCode,
                type: "ELEMENT_MARKER"
              };
              break;
          }
        }
        if (!result) {
          result = {
            __raw_opCode: opCode,
            type: "Unknown Op Code",
            code: opCode
          };
        }
        results.push(result);
      }
      return results;
    },
    enumerable: true,
    configurable: true
  });
  return I18nMutateOpCodesDebug;
})();
var I18nUpdateOpCodesDebug = (function () {
  function I18nUpdateOpCodesDebug(__raw_opCodes, icus, __lView) {
    this.__raw_opCodes = __raw_opCodes;
    this.icus = icus;
    this.__lView = __lView;
  }
  Object.defineProperty(I18nUpdateOpCodesDebug.prototype, "operations", {
    get: function () {
      var _a = this, __lView = _a.__lView, __raw_opCodes = _a.__raw_opCodes, icus = _a.icus;
      var results = [];
      for (var i = 0; i < __raw_opCodes.length; i++) {
        var checkBit = __raw_opCodes[i];
        var skipCodes = __raw_opCodes[++i];
        var value = "";
        for (var j = i + 1; j <= i + skipCodes; j++) {
          var opCode = __raw_opCodes[j];
          if (typeof opCode === "string") {
            value += opCode;
          } else if (typeof opCode == "number") {
            if (opCode < 0) {
              value += "�" + (-opCode - 1) + "�";
            } else {
              var nodeIndex = opCode >>> 2;
              var tIcuIndex = void 0;
              var tIcu = void 0;
              switch (opCode & 3) {
                case 1:
                  var attrName = __raw_opCodes[++j];
                  var sanitizeFn = __raw_opCodes[++j];
                  results.push({
                    __raw_opCode: opCode,
                    checkBit: checkBit,
                    type: "Attr",
                    attrValue: value,
                    attrName: attrName,
                    sanitizeFn: sanitizeFn
                  });
                  break;
                case 0:
                  results.push({
                    __raw_opCode: opCode,
                    checkBit: checkBit,
                    type: "Text",
                    nodeIndex: nodeIndex,
                    text: value
                  });
                  break;
                case 2:
                  tIcuIndex = __raw_opCodes[++j];
                  tIcu = icus[tIcuIndex];
                  var result = new I18NDebugItem(opCode, __lView, nodeIndex, "IcuSwitch");
                  result["tIcuIndex"] = tIcuIndex;
                  result["checkBit"] = checkBit;
                  result["mainBinding"] = value;
                  result["tIcu"] = tIcu;
                  results.push(result);
                  break;
                case 3:
                  tIcuIndex = __raw_opCodes[++j];
                  tIcu = icus[tIcuIndex];
                  result = new I18NDebugItem(opCode, __lView, nodeIndex, "IcuUpdate");
                  result["tIcuIndex"] = tIcuIndex;
                  result["checkBit"] = checkBit;
                  result["tIcu"] = tIcu;
                  results.push(result);
                  break;
              }
            }
          }
        }
        i += skipCodes;
      }
      return results;
    },
    enumerable: true,
    configurable: true
  });
  return I18nUpdateOpCodesDebug;
})();
function ɵɵselect(index) {
  ngDevMode && assertGreaterThan(index, -1, "Invalid index");
  ngDevMode && assertLessThan(index, getLView().length - HEADER_OFFSET, "Should be within range for the view data");
  var lView = getLView();
  selectInternal(lView, index);
}
exports.ɵɵselect = ɵɵselect;
function selectInternal(lView, index) {
  executePreOrderHooks(lView, lView[TVIEW], getCheckNoChangesMode(), index);
  setSelectedIndex(index);
}
var ɵ0$5 = function () {
  return Promise.resolve(null);
};
var _CLEAN_PROMISE = ɵ0$5();
function refreshDescendantViews(lView) {
  var tView = lView[TVIEW];
  var creationMode = isCreationMode(lView);
  tView.firstTemplatePass = false;
  lView[BINDING_INDEX] = tView.bindingStartIndex;
  if (!creationMode) {
    var checkNoChangesMode = getCheckNoChangesMode();
    executePreOrderHooks(lView, tView, checkNoChangesMode, undefined);
    refreshDynamicEmbeddedViews(lView);
    refreshContentQueries(tView, lView);
    resetPreOrderHookFlags(lView);
    executeHooks(lView, tView.contentHooks, tView.contentCheckHooks, checkNoChangesMode, 1, undefined);
    setHostBindings(tView, lView);
  }
  if (creationMode && tView.staticContentQueries) {
    refreshContentQueries(tView, lView);
  }
  if (!creationMode || tView.staticViewQueries) {
    executeViewQueryFn(2, tView, lView[CONTEXT]);
  }
  refreshChildComponents(lView, tView.components);
}
function setHostBindings(tView, viewData) {
  var selectedIndex = getSelectedIndex();
  try {
    if (tView.expandoInstructions) {
      var bindingRootIndex = viewData[BINDING_INDEX] = tView.expandoStartIndex;
      setBindingRoot(bindingRootIndex);
      var currentDirectiveIndex = -1;
      var currentElementIndex = -1;
      for (var i = 0; i < tView.expandoInstructions.length; i++) {
        var instruction = tView.expandoInstructions[i];
        if (typeof instruction === "number") {
          if (instruction <= 0) {
            currentElementIndex = -instruction;
            setActiveHostElement(currentElementIndex);
            var providerCount = tView.expandoInstructions[++i];
            bindingRootIndex += INJECTOR_BLOOM_PARENT_SIZE + providerCount;
            currentDirectiveIndex = bindingRootIndex;
          } else {
            bindingRootIndex += instruction;
          }
          setBindingRoot(bindingRootIndex);
        } else {
          if (instruction !== null) {
            viewData[BINDING_INDEX] = bindingRootIndex;
            var hostCtx = unwrapRNode(viewData[currentDirectiveIndex]);
            instruction(2, hostCtx, currentElementIndex);
            incrementActiveDirectiveId();
          }
          currentDirectiveIndex++;
        }
      }
    }
  } finally {
    setActiveHostElement(selectedIndex);
  }
}
function refreshContentQueries(tView, lView) {
  var contentQueries = tView.contentQueries;
  if (contentQueries !== null) {
    for (var i = 0; i < contentQueries.length; i += 2) {
      var queryStartIdx = contentQueries[i];
      var directiveDefIdx = contentQueries[i + 1];
      if (directiveDefIdx !== -1) {
        var directiveDef = tView.data[directiveDefIdx];
        exports.ɵdid = directiveDef;
        ngDevMode && assertDefined(directiveDef.contentQueries, "contentQueries function should be defined");
        setCurrentQueryIndex(queryStartIdx);
        directiveDef.contentQueries(2, lView[directiveDefIdx], directiveDefIdx);
      }
    }
  }
}
function refreshChildComponents(hostLView, components) {
  if (components != null) {
    for (var i = 0; i < components.length; i++) {
      componentRefresh(hostLView, components[i]);
    }
  }
}
function elementCreate(name, overriddenRenderer) {
  var native;
  var rendererToUse = overriddenRenderer || getLView()[RENDERER];
  var namespace = getNamespace();
  if (isProceduralRenderer(rendererToUse)) {
    native = rendererToUse.createElement(name, namespace);
  } else {
    if (namespace === null) {
      native = rendererToUse.createElement(name);
    } else {
      native = rendererToUse.createElementNS(namespace, name);
    }
  }
  return native;
}
function createLView(parentLView, tView, context, flags, host, tHostNode, rendererFactory, renderer, sanitizer, injector) {
  var lView = ngDevMode ? cloneToLView(tView.blueprint) : tView.blueprint.slice();
  lView[HOST] = host;
  lView[FLAGS] = flags | 4 | 128 | 8;
  resetPreOrderHookFlags(lView);
  lView[PARENT] = lView[DECLARATION_VIEW] = parentLView;
  lView[CONTEXT] = context;
  lView[RENDERER_FACTORY] = rendererFactory || parentLView && parentLView[RENDERER_FACTORY];
  ngDevMode && assertDefined(lView[RENDERER_FACTORY], "RendererFactory is required");
  lView[RENDERER] = renderer || parentLView && parentLView[RENDERER];
  ngDevMode && assertDefined(lView[RENDERER], "Renderer is required");
  lView[SANITIZER] = sanitizer || parentLView && parentLView[SANITIZER] || null;
  lView[INJECTOR$1] = injector || parentLView && parentLView[INJECTOR$1] || null;
  lView[T_HOST] = tHostNode;
  ngDevMode && attachLViewDebug(lView);
  return lView;
}
function getOrCreateTNode(tView, tHostNode, index, type, name, attrs) {
  var adjustedIndex = index + HEADER_OFFSET;
  var tNode = tView.data[adjustedIndex] || createTNodeAtIndex(tView, tHostNode, adjustedIndex, type, name, attrs, index);
  setPreviousOrParentTNode(tNode, true);
  return tNode;
}
function createTNodeAtIndex(tView, tHostNode, adjustedIndex, type, name, attrs, index) {
  var previousOrParentTNode = getPreviousOrParentTNode();
  var isParent = getIsParent();
  var parent = isParent ? previousOrParentTNode : previousOrParentTNode && previousOrParentTNode.parent;
  var parentInSameView = parent && parent !== tHostNode;
  var tParentNode = parentInSameView ? parent : null;
  var tNode = tView.data[adjustedIndex] = createTNode(tView, tParentNode, type, adjustedIndex, name, attrs);
  if (index === 0 || !tView.firstChild) {
    tView.firstChild = tNode;
  }
  if (previousOrParentTNode) {
    if (isParent && previousOrParentTNode.child == null && (tNode.parent !== null || previousOrParentTNode.type === 2)) {
      previousOrParentTNode.child = tNode;
    } else if (!isParent) {
      previousOrParentTNode.next = tNode;
    }
  }
  return tNode;
}
function assignTViewNodeToLView(tView, tParentNode, index, lView) {
  var tNode = tView.node;
  if (tNode == null) {
    ngDevMode && tParentNode && assertNodeOfPossibleTypes(tParentNode, 3, 0);
    tView.node = tNode = createTNode(tView, tParentNode, 2, index, null, null);
  }
  return lView[T_HOST] = tNode;
}
function allocExpando(view, numSlotsToAlloc) {
  ngDevMode && assertGreaterThan(numSlotsToAlloc, 0, "The number of slots to alloc should be greater than 0");
  if (numSlotsToAlloc > 0) {
    var tView = view[TVIEW];
    if (tView.firstTemplatePass) {
      for (var i = 0; i < numSlotsToAlloc; i++) {
        tView.blueprint.push(null);
        tView.data.push(null);
        view.push(null);
      }
      if (!tView.expandoInstructions) {
        tView.expandoStartIndex += numSlotsToAlloc;
      } else {
        tView.expandoInstructions.push(numSlotsToAlloc);
      }
    }
  }
}
function createEmbeddedViewAndNode(tView, context, declarationView, injectorIndex) {
  var _isParent = getIsParent();
  var _previousOrParentTNode = getPreviousOrParentTNode();
  setPreviousOrParentTNode(null, true);
  var lView = createLView(declarationView, tView, context, 16, null, null);
  lView[DECLARATION_VIEW] = declarationView;
  assignTViewNodeToLView(tView, null, -1, lView);
  if (tView.firstTemplatePass) {
    tView.node.injectorIndex = injectorIndex;
  }
  setPreviousOrParentTNode(_previousOrParentTNode, _isParent);
  return lView;
}
function renderEmbeddedTemplate(viewToRender, tView, context) {
  var _isParent = getIsParent();
  var _previousOrParentTNode = getPreviousOrParentTNode();
  var oldView;
  if (viewToRender[FLAGS] & 512) {
    tickRootContext(getRootContext(viewToRender));
  } else {
    var safeToRunHooks = false;
    try {
      setPreviousOrParentTNode(null, true);
      oldView = enterView(viewToRender, viewToRender[T_HOST]);
      resetPreOrderHookFlags(viewToRender);
      executeTemplate(viewToRender, tView.template, getRenderFlags(viewToRender), context);
      tView.firstTemplatePass = false;
      refreshDescendantViews(viewToRender);
      safeToRunHooks = true;
    } finally {
      leaveView(oldView, safeToRunHooks);
      setPreviousOrParentTNode(_previousOrParentTNode, _isParent);
    }
  }
}
function renderComponentOrTemplate(hostView, context, templateFn) {
  var rendererFactory = hostView[RENDERER_FACTORY];
  var oldView = enterView(hostView, hostView[T_HOST]);
  var normalExecutionPath = !getCheckNoChangesMode();
  var creationModeIsActive = isCreationMode(hostView);
  var safeToRunHooks = false;
  try {
    if (normalExecutionPath && !creationModeIsActive && rendererFactory.begin) {
      rendererFactory.begin();
    }
    if (creationModeIsActive) {
      templateFn && executeTemplate(hostView, templateFn, 1, context);
      refreshDescendantViews(hostView);
      hostView[FLAGS] &= ~4;
    }
    resetPreOrderHookFlags(hostView);
    templateFn && executeTemplate(hostView, templateFn, 2, context);
    refreshDescendantViews(hostView);
    safeToRunHooks = true;
  } finally {
    if (normalExecutionPath && !creationModeIsActive && rendererFactory.end) {
      rendererFactory.end();
    }
    leaveView(oldView, safeToRunHooks);
  }
}
function executeTemplate(lView, templateFn, rf, context) {
  namespaceHTMLInternal();
  var prevSelectedIndex = getSelectedIndex();
  try {
    setActiveHostElement(null);
    if (rf & 2) {
      selectInternal(lView, 0);
    }
    templateFn(rf, context);
  } finally {
    setSelectedIndex(prevSelectedIndex);
  }
}
function getRenderFlags(view) {
  return isCreationMode(view) ? 1 : 2;
}
function executeContentQueries(tView, tNode, lView) {
  if (isContentQueryHost(tNode)) {
    var start = tNode.directiveStart;
    var end = tNode.directiveEnd;
    for (var directiveIndex = start; directiveIndex < end; directiveIndex++) {
      var def = tView.data[directiveIndex];
      if (def.contentQueries) {
        def.contentQueries(1, lView[directiveIndex], directiveIndex);
      }
    }
  }
}
function createDirectivesAndLocals(tView, lView, tNode, localRefExtractor) {
  if (localRefExtractor === void 0) {
    localRefExtractor = getNativeByTNode;
  }
  if (!getBindingsEnabled()) return;
  instantiateAllDirectives(tView, lView, tNode);
  invokeDirectivesHostBindings(tView, lView, tNode);
  saveResolvedLocalsInData(lView, tNode, localRefExtractor);
  setActiveHostElement(null);
}
function saveResolvedLocalsInData(viewData, tNode, localRefExtractor) {
  var localNames = tNode.localNames;
  if (localNames) {
    var localIndex = tNode.index + 1;
    for (var i = 0; i < localNames.length; i += 2) {
      var index = localNames[i + 1];
      var value = index === -1 ? localRefExtractor(tNode, viewData) : viewData[index];
      viewData[localIndex++] = value;
    }
  }
}
function getOrCreateTView(def) {
  return def.tView || (def.tView = createTView(-1, def.template, def.consts, def.vars, def.directiveDefs, def.pipeDefs, def.viewQuery, def.schemas));
}
function createTView(viewIndex, templateFn, consts, vars, directives, pipes, viewQuery, schemas) {
  ngDevMode && ngDevMode.tView++;
  var bindingStartIndex = HEADER_OFFSET + consts;
  var initialViewLength = bindingStartIndex + vars;
  var blueprint = createViewBlueprint(bindingStartIndex, initialViewLength);
  return blueprint[TVIEW] = ngDevMode ? new TViewConstructor(viewIndex, blueprint, templateFn, null, viewQuery, null, cloneToTViewData(blueprint).fill(null, bindingStartIndex), bindingStartIndex, initialViewLength, null, true, false, false, null, null, null, null, null, null, null, null, null, null, typeof directives === "function" ? directives() : directives, typeof pipes === "function" ? pipes() : pipes, null, schemas) : {
    id: viewIndex,
    blueprint: blueprint,
    template: templateFn,
    queries: null,
    viewQuery: viewQuery,
    node: null,
    data: blueprint.slice().fill(null, bindingStartIndex),
    bindingStartIndex: bindingStartIndex,
    expandoStartIndex: initialViewLength,
    expandoInstructions: null,
    firstTemplatePass: true,
    staticViewQueries: false,
    staticContentQueries: false,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof directives === "function" ? directives() : directives,
    pipeRegistry: typeof pipes === "function" ? pipes() : pipes,
    firstChild: null,
    schemas: schemas
  };
}
function createViewBlueprint(bindingStartIndex, initialViewLength) {
  var blueprint = new (ngDevMode ? LViewBlueprint : Array)(initialViewLength).fill(null, 0, bindingStartIndex).fill(NO_CHANGE, bindingStartIndex);
  blueprint[BINDING_INDEX] = bindingStartIndex;
  return blueprint;
}
function createError(text, token) {
  return new Error("Renderer: " + text + " [" + stringifyForError(token) + "]");
}
function locateHostElement(factory, elementOrSelector) {
  var defaultRenderer = factory.createRenderer(null, null);
  var rNode = typeof elementOrSelector === "string" ? isProceduralRenderer(defaultRenderer) ? defaultRenderer.selectRootElement(elementOrSelector) : defaultRenderer.querySelector(elementOrSelector) : elementOrSelector;
  if (ngDevMode && !rNode) {
    if (typeof elementOrSelector === "string") {
      throw createError("Host node with selector not found:", elementOrSelector);
    } else {
      throw createError("Host node is required:", elementOrSelector);
    }
  }
  return rNode;
}
function storeCleanupWithContext(lView, context, cleanupFn) {
  var lCleanup = getCleanup(lView);
  lCleanup.push(context);
  if (lView[TVIEW].firstTemplatePass) {
    getTViewCleanup(lView).push(cleanupFn, lCleanup.length - 1);
  }
}
function storeCleanupFn(view, cleanupFn) {
  getCleanup(view).push(cleanupFn);
  if (view[TVIEW].firstTemplatePass) {
    getTViewCleanup(view).push(view[CLEANUP].length - 1, null);
  }
}
function createTNode(tView, tParent, type, adjustedIndex, tagName, attrs) {
  ngDevMode && ngDevMode.tNode++;
  var injectorIndex = tParent ? tParent.injectorIndex : -1;
  return ngDevMode ? new TNodeConstructor(tView, type, adjustedIndex, injectorIndex, -1, -1, -1, -1, 0, 0, tagName, attrs, null, undefined, undefined, undefined, null, null, null, null, tParent, null, null, null) : {
    type: type,
    index: adjustedIndex,
    injectorIndex: injectorIndex,
    directiveStart: -1,
    directiveEnd: -1,
    propertyMetadataStartIndex: -1,
    propertyMetadataEndIndex: -1,
    flags: 0,
    providerIndexes: 0,
    tagName: tagName,
    attrs: attrs,
    localNames: null,
    initialInputs: undefined,
    inputs: undefined,
    outputs: undefined,
    tViews: null,
    next: null,
    projectionNext: null,
    child: null,
    parent: tParent,
    projection: null,
    styles: null,
    classes: null
  };
}
function generatePropertyAliases(tNode, direction) {
  var tView = getLView()[TVIEW];
  var propStore = null;
  var start = tNode.directiveStart;
  var end = tNode.directiveEnd;
  if (end > start) {
    var isInput = direction === 0;
    var defs = tView.data;
    for (var i = start; i < end; i++) {
      var directiveDef = defs[i];
      exports.ɵdid = directiveDef;
      var propertyAliasMap = isInput ? directiveDef.inputs : directiveDef.outputs;
      for (var publicName in propertyAliasMap) {
        if (propertyAliasMap.hasOwnProperty(publicName)) {
          propStore = propStore || ({});
          var internalName = propertyAliasMap[publicName];
          var hasProperty = propStore.hasOwnProperty(publicName);
          hasProperty ? propStore[publicName].push(i, publicName, internalName) : propStore[publicName] = [i, publicName, internalName];
        }
      }
    }
  }
  return propStore;
}
var ATTR_TO_PROP = {
  "class": "className",
  "for": "htmlFor",
  "formaction": "formAction",
  "innerHtml": "innerHTML",
  "readonly": "readOnly",
  "tabindex": "tabIndex"
};
function elementPropertyInternal(index, propName, value, sanitizer, nativeOnly, loadRendererFn) {
  ngDevMode && assertNotSame(value, NO_CHANGE, "Incoming value should never be NO_CHANGE.");
  var lView = getLView();
  var element = getNativeByIndex(index, lView);
  var tNode = getTNode(index, lView);
  var inputData;
  var dataValue;
  if (!nativeOnly && (inputData = initializeTNodeInputs(tNode)) && (dataValue = inputData[propName])) {
    setInputsForProperty(lView, dataValue, value);
    if (isComponent(tNode)) markDirtyIfOnPush(lView, index + HEADER_OFFSET);
    if (ngDevMode) {
      if (tNode.type === 3 || tNode.type === 0) {
        for (var i = 0; i < dataValue.length; i += 3) {
          setNgReflectProperty(lView, element, tNode.type, dataValue[i + 2], value);
        }
      }
    }
  } else if (tNode.type === 3) {
    propName = ATTR_TO_PROP[propName] || propName;
    if (ngDevMode) {
      validateAgainstEventProperties(propName);
      validateAgainstUnknownProperties(lView, element, propName, tNode);
      ngDevMode.rendererSetProperty++;
    }
    savePropertyDebugData(tNode, lView, propName, lView[TVIEW].data, nativeOnly);
    var renderer = loadRendererFn ? loadRendererFn(tNode, lView) : lView[RENDERER];
    value = sanitizer != null ? sanitizer(value, tNode.tagName || "", propName) : value;
    if (isProceduralRenderer(renderer)) {
      renderer.setProperty(element, propName, value);
    } else if (!isAnimationProp(propName)) {
      element.setProperty ? element.setProperty(propName, value) : element[propName] = value;
    }
  } else if (tNode.type === 0) {
    if (ngDevMode && !matchingSchemas(lView, tNode.tagName)) {
      throw createUnknownPropertyError(propName, tNode);
    }
  }
}
function markDirtyIfOnPush(lView, viewIndex) {
  ngDevMode && assertLView(lView);
  var childComponentLView = getComponentViewByIndex(viewIndex, lView);
  if (!(childComponentLView[FLAGS] & 16)) {
    childComponentLView[FLAGS] |= 64;
  }
}
function setNgReflectProperty(lView, element, type, attrName, value) {
  var _a;
  var renderer = lView[RENDERER];
  attrName = normalizeDebugBindingName(attrName);
  var debugValue = normalizeDebugBindingValue(value);
  if (type === 3) {
    if (value == null) {
      isProceduralRenderer(renderer) ? renderer.removeAttribute(element, attrName) : element.removeAttribute(attrName);
    } else {
      isProceduralRenderer(renderer) ? renderer.setAttribute(element, attrName, debugValue) : element.setAttribute(attrName, debugValue);
    }
  } else {
    var textContent = "bindings=" + JSON.stringify((_a = {}, _a[attrName] = debugValue, _a), null, 2);
    if (isProceduralRenderer(renderer)) {
      renderer.setValue(element, textContent);
    } else {
      element.textContent = textContent;
    }
  }
}
function validateAgainstUnknownProperties(hostView, element, propName, tNode) {
  if (matchingSchemas(hostView, tNode.tagName)) {
    return;
  }
  if (!((propName in element)) && typeof Node === "function" && element instanceof Node && propName[0] !== ANIMATION_PROP_PREFIX) {
    throw createUnknownPropertyError(propName, tNode);
  }
}
function matchingSchemas(hostView, tagName) {
  var schemas = hostView[TVIEW].schemas;
  if (schemas !== null) {
    for (var i = 0; i < schemas.length; i++) {
      var schema = schemas[i];
      if (schema === NO_ERRORS_SCHEMA || schema === CUSTOM_ELEMENTS_SCHEMA && tagName && tagName.indexOf("-") > -1) {
        return true;
      }
    }
  }
  return false;
}
function savePropertyDebugData(tNode, lView, propName, tData, nativeOnly) {
  var lastBindingIndex = lView[BINDING_INDEX] - 1;
  var bindingMetadata = tData[lastBindingIndex];
  if (bindingMetadata[0] == INTERPOLATION_DELIMITER) {
    tData[lastBindingIndex] = propName + bindingMetadata;
    if (!nativeOnly) {
      if (tNode.propertyMetadataStartIndex == -1) {
        tNode.propertyMetadataStartIndex = lastBindingIndex;
      }
      tNode.propertyMetadataEndIndex = lastBindingIndex + 1;
    }
  }
}
function createUnknownPropertyError(propName, tNode) {
  return new Error("Template error: Can't bind to '" + propName + "' since it isn't a known property of '" + tNode.tagName + "'.");
}
function instantiateRootComponent(tView, viewData, def) {
  var rootTNode = getPreviousOrParentTNode();
  if (tView.firstTemplatePass) {
    if (def.providersResolver) def.providersResolver(def);
    generateExpandoInstructionBlock(tView, rootTNode, 1);
    baseResolveDirective(tView, viewData, def, def.factory);
  }
  var directive = getNodeInjectable(tView.data, viewData, viewData.length - 1, rootTNode);
  postProcessBaseDirective(viewData, rootTNode, directive);
  return directive;
}
function resolveDirectives(tView, lView, tNode, localRefs) {
  ngDevMode && assertEqual(tView.firstTemplatePass, true, "should run on first template pass only");
  if (!getBindingsEnabled()) return;
  var directives = findDirectiveMatches(tView, lView, tNode);
  var exportsMap = localRefs ? {
    "": -1
  } : null;
  if (directives) {
    initNodeFlags(tNode, tView.data.length, directives.length);
    for (var i = 0; i < directives.length; i++) {
      var def = directives[i];
      if (def.providersResolver) def.providersResolver(def);
    }
    generateExpandoInstructionBlock(tView, tNode, directives.length);
    var initialPreOrderHooksLength = tView.preOrderHooks && tView.preOrderHooks.length || 0;
    var initialPreOrderCheckHooksLength = tView.preOrderCheckHooks && tView.preOrderCheckHooks.length || 0;
    var nodeIndex = tNode.index - HEADER_OFFSET;
    for (var i = 0; i < directives.length; i++) {
      var def = directives[i];
      var directiveDefIdx = tView.data.length;
      baseResolveDirective(tView, lView, def, def.factory);
      saveNameToExportMap(tView.data.length - 1, def, exportsMap);
      registerPreOrderHooks(directiveDefIdx, def, tView, nodeIndex, initialPreOrderHooksLength, initialPreOrderCheckHooksLength);
    }
  }
  if (exportsMap) cacheMatchingLocalNames(tNode, localRefs, exportsMap);
}
function instantiateAllDirectives(tView, lView, tNode) {
  var start = tNode.directiveStart;
  var end = tNode.directiveEnd;
  if (!tView.firstTemplatePass && start < end) {
    getOrCreateNodeInjectorForNode(tNode, lView);
  }
  for (var i = start; i < end; i++) {
    var def = tView.data[i];
    if (isComponentDef(def)) {
      addComponentLogic(lView, tNode, def);
    }
    var directive = getNodeInjectable(tView.data, lView, i, tNode);
    postProcessDirective(lView, directive, def, i);
  }
}
function invokeDirectivesHostBindings(tView, viewData, tNode) {
  var start = tNode.directiveStart;
  var end = tNode.directiveEnd;
  var expando = tView.expandoInstructions;
  var firstTemplatePass = tView.firstTemplatePass;
  var elementIndex = tNode.index - HEADER_OFFSET;
  var selectedIndex = getSelectedIndex();
  try {
    setActiveHostElement(elementIndex);
    for (var i = start; i < end; i++) {
      var def = tView.data[i];
      var directive = viewData[i];
      if (def.hostBindings) {
        invokeHostBindingsInCreationMode(def, expando, directive, tNode, firstTemplatePass);
        incrementActiveDirectiveId();
      } else if (firstTemplatePass) {
        expando.push(null);
      }
    }
  } finally {
    setActiveHostElement(selectedIndex);
  }
}
function invokeHostBindingsInCreationMode(def, expando, directive, tNode, firstTemplatePass) {
  var previousExpandoLength = expando.length;
  setCurrentDirectiveDef(def);
  var elementIndex = tNode.index - HEADER_OFFSET;
  def.hostBindings(1, directive, elementIndex);
  setCurrentDirectiveDef(null);
  if (previousExpandoLength === expando.length && firstTemplatePass) {
    expando.push(def.hostBindings);
  }
}
function generateExpandoInstructionBlock(tView, tNode, directiveCount) {
  ngDevMode && assertEqual(tView.firstTemplatePass, true, "Expando block should only be generated on first template pass.");
  var elementIndex = -(tNode.index - HEADER_OFFSET);
  var providerStartIndex = tNode.providerIndexes & 65535;
  var providerCount = tView.data.length - providerStartIndex;
  (tView.expandoInstructions || (tView.expandoInstructions = [])).push(elementIndex, providerCount, directiveCount);
}
function postProcessDirective(viewData, directive, def, directiveDefIdx) {
  var previousOrParentTNode = getPreviousOrParentTNode();
  postProcessBaseDirective(viewData, previousOrParentTNode, directive);
  ngDevMode && assertDefined(previousOrParentTNode, "previousOrParentTNode");
  if (previousOrParentTNode && previousOrParentTNode.attrs) {
    setInputsFromAttrs(directiveDefIdx, directive, def, previousOrParentTNode);
  }
  if (viewData[TVIEW].firstTemplatePass && def.contentQueries) {
    previousOrParentTNode.flags |= 4;
  }
  if (isComponentDef(def)) {
    var componentView = getComponentViewByIndex(previousOrParentTNode.index, viewData);
    componentView[CONTEXT] = directive;
  }
}
function postProcessBaseDirective(lView, previousOrParentTNode, directive) {
  var native = getNativeByTNode(previousOrParentTNode, lView);
  ngDevMode && assertEqual(lView[BINDING_INDEX], lView[TVIEW].bindingStartIndex, "directives should be created before any bindings");
  ngDevMode && assertPreviousIsParent(getIsParent());
  attachPatchData(directive, lView);
  if (native) {
    attachPatchData(native, lView);
  }
}
function findDirectiveMatches(tView, viewData, tNode) {
  ngDevMode && assertEqual(tView.firstTemplatePass, true, "should run on first template pass only");
  var registry = tView.directiveRegistry;
  var matches = null;
  if (registry) {
    for (var i = 0; i < registry.length; i++) {
      var def = registry[i];
      if (isNodeMatchingSelectorList(tNode, def.selectors, false)) {
        matches || (matches = ngDevMode ? new MatchesArray() : []);
        diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, viewData), tView, def.type);
        if (isComponentDef(def)) {
          if (tNode.flags & 1) throwMultipleComponentError(tNode);
          tNode.flags = 1;
          matches.unshift(def);
        } else {
          matches.push(def);
        }
      }
    }
  }
  return matches;
}
function queueComponentIndexForCheck(previousOrParentTNode) {
  var tView = getLView()[TVIEW];
  ngDevMode && assertEqual(tView.firstTemplatePass, true, "Should only be called in first template pass.");
  (tView.components || (tView.components = ngDevMode ? new TViewComponents() : [])).push(previousOrParentTNode.index);
}
function cacheMatchingLocalNames(tNode, localRefs, exportsMap) {
  if (localRefs) {
    var localNames = tNode.localNames = ngDevMode ? new TNodeLocalNames() : [];
    for (var i = 0; i < localRefs.length; i += 2) {
      var index = exportsMap[localRefs[i + 1]];
      if (index == null) throw new Error("Export of name '" + localRefs[i + 1] + "' not found!");
      localNames.push(localRefs[i], index);
    }
  }
}
function saveNameToExportMap(index, def, exportsMap) {
  if (exportsMap) {
    if (def.exportAs) {
      for (var i = 0; i < def.exportAs.length; i++) {
        exportsMap[def.exportAs[i]] = index;
      }
    }
    if (def.template) exportsMap[""] = index;
  }
}
function initNodeFlags(tNode, index, numberOfDirectives) {
  var flags = tNode.flags;
  ngDevMode && assertEqual(flags === 0 || flags === 1, true, "expected node flags to not be initialized");
  ngDevMode && assertNotEqual(numberOfDirectives, tNode.directiveEnd - tNode.directiveStart, "Reached the max number of directives");
  tNode.flags = flags & 1;
  tNode.directiveStart = index;
  tNode.directiveEnd = index + numberOfDirectives;
  tNode.providerIndexes = index;
}
function baseResolveDirective(tView, viewData, def, directiveFactory) {
  tView.data.push(def);
  var nodeInjectorFactory = new NodeInjectorFactory(directiveFactory, isComponentDef(def), null);
  tView.blueprint.push(nodeInjectorFactory);
  viewData.push(nodeInjectorFactory);
}
function addComponentLogic(lView, previousOrParentTNode, def) {
  var native = getNativeByTNode(previousOrParentTNode, lView);
  var tView = getOrCreateTView(def);
  var rendererFactory = lView[RENDERER_FACTORY];
  var componentView = addToViewTree(lView, createLView(lView, tView, null, def.onPush ? 64 : 16, lView[previousOrParentTNode.index], previousOrParentTNode, rendererFactory, rendererFactory.createRenderer(native, def)));
  componentView[T_HOST] = previousOrParentTNode;
  lView[previousOrParentTNode.index] = componentView;
  if (lView[TVIEW].firstTemplatePass) {
    queueComponentIndexForCheck(previousOrParentTNode);
  }
}
function elementAttributeInternal(index, name, value, lView, sanitizer, namespace) {
  ngDevMode && assertNotSame(value, NO_CHANGE, "Incoming value should never be NO_CHANGE.");
  ngDevMode && validateAgainstEventAttributes(name);
  var element = getNativeByIndex(index, lView);
  var renderer = lView[RENDERER];
  if (value == null) {
    ngDevMode && ngDevMode.rendererRemoveAttribute++;
    isProceduralRenderer(renderer) ? renderer.removeAttribute(element, name, namespace) : element.removeAttribute(name);
  } else {
    ngDevMode && ngDevMode.rendererSetAttribute++;
    var tNode = getTNode(index, lView);
    var strValue = sanitizer == null ? renderStringify(value) : sanitizer(value, tNode.tagName || "", name);
    if (isProceduralRenderer(renderer)) {
      renderer.setAttribute(element, name, strValue, namespace);
    } else {
      namespace ? element.setAttributeNS(namespace, name, strValue) : element.setAttribute(name, strValue);
    }
  }
}
function setInputsFromAttrs(directiveIndex, instance, def, tNode) {
  var initialInputData = tNode.initialInputs;
  if (initialInputData === undefined || directiveIndex >= initialInputData.length) {
    initialInputData = generateInitialInputs(directiveIndex, def.inputs, tNode);
  }
  var initialInputs = initialInputData[directiveIndex];
  if (initialInputs) {
    var setInput = def.setInput;
    for (var i = 0; i < initialInputs.length; ) {
      var publicName = initialInputs[i++];
      var privateName = initialInputs[i++];
      var value = initialInputs[i++];
      if (setInput) {
        def.setInput(instance, value, publicName, privateName);
      } else {
        instance[privateName] = value;
      }
      if (ngDevMode) {
        var lView = getLView();
        var nativeElement = getNativeByTNode(tNode, lView);
        setNgReflectProperty(lView, nativeElement, tNode.type, privateName, value);
      }
    }
  }
}
function generateInitialInputs(directiveIndex, inputs, tNode) {
  var initialInputData = tNode.initialInputs || (tNode.initialInputs = ngDevMode ? new TNodeInitialInputs() : []);
  for (var i_1 = initialInputData.length; i_1 <= directiveIndex; i_1++) {
    initialInputData.push(null);
  }
  var attrs = tNode.attrs;
  var i = 0;
  while (i < attrs.length) {
    var attrName = attrs[i];
    if (attrName === 0) {
      i += 4;
      continue;
    } else if (attrName === 5) {
      i += 2;
      continue;
    }
    if (typeof attrName === "number") break;
    var minifiedInputName = inputs[attrName];
    var attrValue = attrs[i + 1];
    if (minifiedInputName !== undefined) {
      var inputsToStore = initialInputData[directiveIndex] || (initialInputData[directiveIndex] = ngDevMode ? new TNodeInitialData() : []);
      inputsToStore.push(attrName, minifiedInputName, attrValue);
    }
    i += 2;
  }
  return initialInputData;
}
var LContainerArray = ngDevMode && createNamedArrayType("LContainer");
function createLContainer(hostNative, currentView, native, tNode, isForViewContainerRef) {
  ngDevMode && assertDomNode(native);
  ngDevMode && assertLView(currentView);
  var lContainer = new (ngDevMode ? LContainerArray : Array)(hostNative, true, isForViewContainerRef ? -1 : 0, currentView, null, null, tNode, native, null);
  ngDevMode && attachLContainerDebug(lContainer);
  return lContainer;
}
function refreshDynamicEmbeddedViews(lView) {
  for (var current = lView[CHILD_HEAD]; current !== null; current = current[NEXT]) {
    if (current[ACTIVE_INDEX] === -1 && isLContainer(current)) {
      for (var i = CONTAINER_HEADER_OFFSET; i < current.length; i++) {
        var dynamicViewData = current[i];
        ngDevMode && assertDefined(dynamicViewData[TVIEW], "TView must be allocated");
        renderEmbeddedTemplate(dynamicViewData, dynamicViewData[TVIEW], dynamicViewData[CONTEXT]);
      }
    }
  }
}
function componentRefresh(hostLView, adjustedElementIndex) {
  ngDevMode && assertDataInRange(hostLView, adjustedElementIndex);
  var componentView = getComponentViewByIndex(adjustedElementIndex, hostLView);
  ngDevMode && assertNodeType(hostLView[TVIEW].data[adjustedElementIndex], 3);
  if ((viewAttachedToChangeDetector(componentView) || isCreationMode(hostLView)) && componentView[FLAGS] & (16 | 64)) {
    syncViewWithBlueprint(componentView);
    checkView(componentView, componentView[CONTEXT]);
  }
}
function syncViewWithBlueprint(componentView) {
  var componentTView = componentView[TVIEW];
  for (var i = componentView.length; i < componentTView.blueprint.length; i++) {
    componentView[i] = componentTView.blueprint[i];
  }
}
function addToViewTree(lView, lViewOrLContainer) {
  if (lView[CHILD_HEAD]) {
    lView[CHILD_TAIL][NEXT] = lViewOrLContainer;
  } else {
    lView[CHILD_HEAD] = lViewOrLContainer;
  }
  lView[CHILD_TAIL] = lViewOrLContainer;
  return lViewOrLContainer;
}
function markViewDirty(lView) {
  while (lView) {
    lView[FLAGS] |= 64;
    var parent_1 = getLViewParent(lView);
    if (isRootView(lView) && !parent_1) {
      return lView;
    }
    lView = parent_1;
  }
  return null;
}
function scheduleTick(rootContext, flags) {
  var nothingScheduled = rootContext.flags === 0;
  rootContext.flags |= flags;
  if (nothingScheduled && rootContext.clean == _CLEAN_PROMISE) {
    var res_1;
    rootContext.clean = new Promise(function (r) {
      return res_1 = r;
    });
    rootContext.scheduler(function () {
      if (rootContext.flags & 1) {
        rootContext.flags &= ~1;
        tickRootContext(rootContext);
      }
      if (rootContext.flags & 2) {
        rootContext.flags &= ~2;
        var playerHandler = rootContext.playerHandler;
        if (playerHandler) {
          playerHandler.flushPlayers();
        }
      }
      rootContext.clean = _CLEAN_PROMISE;
      res_1(null);
    });
  }
}
function tickRootContext(rootContext) {
  for (var i = 0; i < rootContext.components.length; i++) {
    var rootComponent = rootContext.components[i];
    renderComponentOrTemplate(readPatchedLView(rootComponent), rootComponent);
  }
}
function detectChangesInternal(view, context) {
  var rendererFactory = view[RENDERER_FACTORY];
  if (rendererFactory.begin) rendererFactory.begin();
  try {
    if (isCreationMode(view)) {
      checkView(view, context);
    }
    checkView(view, context);
  } catch (error) {
    handleError(view, error);
    throw error;
  } finally {
    if (rendererFactory.end) rendererFactory.end();
  }
}
function detectChangesInRootView(lView) {
  tickRootContext(lView[CONTEXT]);
}
function checkNoChanges(component) {
  var view = getComponentViewByInstance(component);
  checkNoChangesInternal(view, component);
}
function checkNoChangesInternal(view, context) {
  setCheckNoChangesMode(true);
  try {
    detectChangesInternal(view, context);
  } finally {
    setCheckNoChangesMode(false);
  }
}
function checkNoChangesInRootView(lView) {
  setCheckNoChangesMode(true);
  try {
    detectChangesInRootView(lView);
  } finally {
    setCheckNoChangesMode(false);
  }
}
function checkView(hostView, component) {
  var hostTView = hostView[TVIEW];
  var oldView = enterView(hostView, hostView[T_HOST]);
  var templateFn = hostTView.template;
  var creationMode = isCreationMode(hostView);
  var safeToRunHooks = false;
  try {
    resetPreOrderHookFlags(hostView);
    creationMode && executeViewQueryFn(1, hostTView, component);
    executeTemplate(hostView, templateFn, getRenderFlags(hostView), component);
    refreshDescendantViews(hostView);
    safeToRunHooks = true;
  } finally {
    leaveView(oldView, safeToRunHooks);
  }
}
function executeViewQueryFn(flags, tView, component) {
  var viewQuery = tView.viewQuery;
  if (viewQuery !== null) {
    setCurrentQueryIndex(0);
    viewQuery(flags, component);
  }
}
function storeBindingMetadata(lView, prefix, suffix) {
  if (prefix === void 0) {
    prefix = "";
  }
  if (suffix === void 0) {
    suffix = "";
  }
  var tData = lView[TVIEW].data;
  var lastBindingIndex = lView[BINDING_INDEX] - 1;
  var value = INTERPOLATION_DELIMITER + prefix + INTERPOLATION_DELIMITER + suffix;
  return tData[lastBindingIndex] == null ? tData[lastBindingIndex] = value : null;
}
var CLEAN_PROMISE = _CLEAN_PROMISE;
function initializeTNodeInputs(tNode) {
  if (tNode.inputs === undefined) {
    tNode.inputs = generatePropertyAliases(tNode, 0);
  }
  return tNode.inputs;
}
function getCleanup(view) {
  return view[CLEANUP] || (view[CLEANUP] = ngDevMode ? new LCleanup() : []);
}
function getTViewCleanup(view) {
  return view[TVIEW].cleanup || (view[TVIEW].cleanup = ngDevMode ? new TCleanup() : []);
}
function loadComponentRenderer(tNode, lView) {
  var componentLView = lView[tNode.index];
  return componentLView[RENDERER];
}
function handleError(lView, error) {
  var injector = lView[INJECTOR$1];
  var errorHandler = injector ? injector.get(ErrorHandler, null) : null;
  errorHandler && errorHandler.handleError(error);
}
function setInputsForProperty(lView, inputs, value) {
  var tView = lView[TVIEW];
  for (var i = 0; i < inputs.length; ) {
    var index = inputs[i++];
    var publicName = inputs[i++];
    var privateName = inputs[i++];
    var instance = lView[index];
    ngDevMode && assertDataInRange(lView, index);
    var def = tView.data[index];
    var setInput = def.setInput;
    if (setInput) {
      def.setInput(instance, value, publicName, privateName);
    } else {
      instance[privateName] = value;
    }
  }
}
function textBindingInternal(lView, index, value) {
  ngDevMode && assertNotSame(value, NO_CHANGE, "value should not be NO_CHANGE");
  ngDevMode && assertDataInRange(lView, index + HEADER_OFFSET);
  var element = getNativeByIndex(index, lView);
  ngDevMode && assertDefined(element, "native element should exist");
  ngDevMode && ngDevMode.rendererSetText++;
  var renderer = lView[RENDERER];
  isProceduralRenderer(renderer) ? renderer.setValue(element, value) : element.textContent = value;
}
function renderInitialStyling(renderer, native, tNode) {
  renderStylingMap(renderer, native, tNode.classes, true);
  renderStylingMap(renderer, native, tNode.styles, false);
}
var unusedValueToPlacateAjd$1 = unusedValueExportToPlacateAjd$1 + unusedValueExportToPlacateAjd$4 + unusedValueExportToPlacateAjd$5 + unusedValueExportToPlacateAjd$3 + unusedValueExportToPlacateAjd;
function getLContainer(tNode, embeddedView) {
  ngDevMode && assertLView(embeddedView);
  var container = embeddedView[PARENT];
  if (tNode.index === -1) {
    return isLContainer(container) ? container : null;
  } else {
    ngDevMode && assertLContainer(container);
    return container;
  }
}
function getContainerRenderParent(tViewNode, view) {
  var container = getLContainer(tViewNode, view);
  return container ? nativeParentNode(view[RENDERER], container[NATIVE]) : null;
}
function executeActionOnElementOrContainer(action, renderer, parent, lNodeToHandle, beforeNode) {
  if (lNodeToHandle != null) {
    var lContainer = void 0;
    var isComponent = false;
    if (isLContainer(lNodeToHandle)) {
      lContainer = lNodeToHandle;
    } else if (isLView(lNodeToHandle)) {
      isComponent = true;
      ngDevMode && assertDefined(lNodeToHandle[HOST], "HOST must be defined for a component LView");
      lNodeToHandle = lNodeToHandle[HOST];
    }
    var rNode = unwrapRNode(lNodeToHandle);
    ngDevMode && assertDomNode(rNode);
    if (action === 0) {
      nativeInsertBefore(renderer, parent, rNode, beforeNode || null);
    } else if (action === 1) {
      nativeRemoveNode(renderer, rNode, isComponent);
    } else if (action === 2) {
      ngDevMode && ngDevMode.rendererDestroyNode++;
      renderer.destroyNode(rNode);
    }
    if (lContainer != null) {
      executeActionOnContainer(renderer, action, lContainer, parent, beforeNode);
    }
  }
}
function createTextNode(value, renderer) {
  return isProceduralRenderer(renderer) ? renderer.createText(renderStringify(value)) : renderer.createTextNode(renderStringify(value));
}
function addRemoveViewFromContainer(lView, insertMode, beforeNode) {
  var renderParent = getContainerRenderParent(lView[TVIEW].node, lView);
  ngDevMode && assertNodeType(lView[TVIEW].node, 2);
  if (renderParent) {
    var renderer = lView[RENDERER];
    var action = insertMode ? 0 : 1;
    executeActionOnView(renderer, action, lView, renderParent, beforeNode);
  }
}
function renderDetachView(lView) {
  executeActionOnView(lView[RENDERER], 1, lView, null, null);
}
function destroyViewTree(rootView) {
  var lViewOrLContainer = rootView[CHILD_HEAD];
  if (!lViewOrLContainer) {
    return cleanUpView(rootView);
  }
  while (lViewOrLContainer) {
    var next = null;
    if (isLView(lViewOrLContainer)) {
      next = lViewOrLContainer[CHILD_HEAD];
    } else {
      ngDevMode && assertLContainer(lViewOrLContainer);
      var firstView = lViewOrLContainer[CONTAINER_HEADER_OFFSET];
      if (firstView) next = firstView;
    }
    if (!next) {
      while (lViewOrLContainer && !lViewOrLContainer[NEXT] && lViewOrLContainer !== rootView) {
        cleanUpView(lViewOrLContainer);
        lViewOrLContainer = getParentState(lViewOrLContainer, rootView);
      }
      cleanUpView(lViewOrLContainer || rootView);
      next = lViewOrLContainer && lViewOrLContainer[NEXT];
    }
    lViewOrLContainer = next;
  }
}
function insertView(lView, lContainer, index) {
  ngDevMode && assertLView(lView);
  ngDevMode && assertLContainer(lContainer);
  var indexInContainer = CONTAINER_HEADER_OFFSET + index;
  var containerLength = lContainer.length;
  if (index > 0) {
    lContainer[indexInContainer - 1][NEXT] = lView;
  }
  if (index < containerLength - CONTAINER_HEADER_OFFSET) {
    lView[NEXT] = lContainer[indexInContainer];
    addToArray(lContainer, CONTAINER_HEADER_OFFSET + index, lView);
  } else {
    lContainer.push(lView);
    lView[NEXT] = null;
  }
  lView[PARENT] = lContainer;
  var declarationLContainer = lView[DECLARATION_LCONTAINER];
  if (declarationLContainer !== null && lContainer !== declarationLContainer) {
    trackMovedView(declarationLContainer, lView);
  }
  var lQueries = lView[QUERIES];
  if (lQueries !== null) {
    lQueries.insertView(lView[TVIEW]);
  }
  lView[FLAGS] |= 128;
}
function trackMovedView(declarationContainer, lView) {
  ngDevMode && assertLContainer(declarationContainer);
  var declaredViews = declarationContainer[MOVED_VIEWS];
  if (declaredViews === null) {
    declarationContainer[MOVED_VIEWS] = [lView];
  } else {
    declaredViews.push(lView);
  }
}
function detachMovedView(declarationContainer, lView) {
  ngDevMode && assertLContainer(declarationContainer);
  ngDevMode && assertDefined(declarationContainer[MOVED_VIEWS], "A projected view should belong to a non-empty projected views collection");
  var projectedViews = declarationContainer[MOVED_VIEWS];
  var declaredViewIndex = projectedViews.indexOf(lView);
  projectedViews.splice(declaredViewIndex, 1);
}
function detachView(lContainer, removeIndex) {
  if (lContainer.length <= CONTAINER_HEADER_OFFSET) return;
  var indexInContainer = CONTAINER_HEADER_OFFSET + removeIndex;
  var viewToDetach = lContainer[indexInContainer];
  if (viewToDetach) {
    var declarationLContainer = viewToDetach[DECLARATION_LCONTAINER];
    if (declarationLContainer !== null && declarationLContainer !== lContainer) {
      detachMovedView(declarationLContainer, viewToDetach);
    }
    if (removeIndex > 0) {
      lContainer[indexInContainer - 1][NEXT] = viewToDetach[NEXT];
    }
    var removedLView = removeFromArray(lContainer, CONTAINER_HEADER_OFFSET + removeIndex);
    addRemoveViewFromContainer(viewToDetach, false);
    var lQueries = removedLView[QUERIES];
    if (lQueries !== null) {
      lQueries.detachView(removedLView[TVIEW]);
    }
    viewToDetach[PARENT] = null;
    viewToDetach[NEXT] = null;
    viewToDetach[FLAGS] &= ~128;
  }
  return viewToDetach;
}
function removeView(lContainer, removeIndex) {
  var detachedView = detachView(lContainer, removeIndex);
  detachedView && destroyLView(detachedView);
}
function destroyLView(lView) {
  if (!(lView[FLAGS] & 256)) {
    var renderer = lView[RENDERER];
    if (isProceduralRenderer(renderer) && renderer.destroyNode) {
      executeActionOnView(renderer, 2, lView, null, null);
    }
    destroyViewTree(lView);
  }
}
function getParentState(lViewOrLContainer, rootView) {
  var tNode;
  if (isLView(lViewOrLContainer) && (tNode = lViewOrLContainer[T_HOST]) && tNode.type === 2) {
    return getLContainer(tNode, lViewOrLContainer);
  } else {
    return lViewOrLContainer[PARENT] === rootView ? null : lViewOrLContainer[PARENT];
  }
}
function cleanUpView(view) {
  if (isLView(view) && !(view[FLAGS] & 256)) {
    view[FLAGS] &= ~128;
    view[FLAGS] |= 256;
    executeOnDestroys(view);
    removeListeners(view);
    var hostTNode = view[T_HOST];
    if (hostTNode && hostTNode.type === 3 && isProceduralRenderer(view[RENDERER])) {
      ngDevMode && ngDevMode.rendererDestroy++;
      view[RENDERER].destroy();
    }
    var declarationContainer = view[DECLARATION_LCONTAINER];
    if (declarationContainer !== null && isLContainer(view[PARENT])) {
      if (declarationContainer !== view[PARENT]) {
        detachMovedView(declarationContainer, view);
      }
      var lQueries = view[QUERIES];
      if (lQueries !== null) {
        lQueries.detachView(view[TVIEW]);
      }
    }
  }
}
function removeListeners(lView) {
  var tCleanup = lView[TVIEW].cleanup;
  if (tCleanup !== null) {
    var lCleanup = lView[CLEANUP];
    for (var i = 0; i < tCleanup.length - 1; i += 2) {
      if (typeof tCleanup[i] === "string") {
        var idxOrTargetGetter = tCleanup[i + 1];
        var target = typeof idxOrTargetGetter === "function" ? idxOrTargetGetter(lView) : unwrapRNode(lView[idxOrTargetGetter]);
        var listener = lCleanup[tCleanup[i + 2]];
        var useCaptureOrSubIdx = tCleanup[i + 3];
        if (typeof useCaptureOrSubIdx === "boolean") {
          target.removeEventListener(tCleanup[i], listener, useCaptureOrSubIdx);
        } else {
          if (useCaptureOrSubIdx >= 0) {
            lCleanup[useCaptureOrSubIdx]();
          } else {
            lCleanup[-useCaptureOrSubIdx].unsubscribe();
          }
        }
        i += 2;
      } else {
        var context = lCleanup[tCleanup[i + 1]];
        tCleanup[i].call(context);
      }
    }
    lView[CLEANUP] = null;
  }
}
function executeOnDestroys(view) {
  var tView = view[TVIEW];
  var destroyHooks;
  if (tView != null && (destroyHooks = tView.destroyHooks) != null) {
    for (var i = 0; i < destroyHooks.length; i += 2) {
      var context = view[destroyHooks[i]];
      if (!(context instanceof NodeInjectorFactory)) {
        destroyHooks[i + 1].call(context);
      }
    }
  }
}
function getRenderParent(tNode, currentView) {
  if (isRootView(currentView)) {
    return nativeParentNode(currentView[RENDERER], getNativeByTNode(tNode, currentView));
  }
  var parent = getHighestElementOrICUContainer(tNode);
  var renderParent = parent.parent;
  if (renderParent == null) {
    var hostTNode = currentView[T_HOST];
    if (hostTNode.type === 2) {
      return getContainerRenderParent(hostTNode, currentView);
    } else {
      return getHostNative(currentView);
    }
  } else {
    var isIcuCase = parent && parent.type === 5;
    if (isIcuCase && parent.flags & 2) {
      return getNativeByTNode(parent, currentView).parentNode;
    }
    ngDevMode && assertNodeType(renderParent, 3);
    if (renderParent.flags & 1 && !isIcuCase) {
      var tData = currentView[TVIEW].data;
      var tNode_1 = tData[renderParent.index];
      var encapsulation = tData[tNode_1.directiveStart].encapsulation;
      if (encapsulation !== ViewEncapsulation.ShadowDom && encapsulation !== ViewEncapsulation.Native) {
        return null;
      }
    }
    return getNativeByTNode(renderParent, currentView);
  }
}
function getHostNative(currentView) {
  ngDevMode && assertLView(currentView);
  var hostTNode = currentView[T_HOST];
  return hostTNode && hostTNode.type === 3 ? getNativeByTNode(hostTNode, getLViewParent(currentView)) : null;
}
function nativeInsertBefore(renderer, parent, child, beforeNode) {
  ngDevMode && ngDevMode.rendererInsertBefore++;
  if (isProceduralRenderer(renderer)) {
    renderer.insertBefore(parent, child, beforeNode);
  } else {
    parent.insertBefore(child, beforeNode, true);
  }
}
function nativeAppendChild(renderer, parent, child) {
  ngDevMode && ngDevMode.rendererAppendChild++;
  if (isProceduralRenderer(renderer)) {
    renderer.appendChild(parent, child);
  } else {
    parent.appendChild(child);
  }
}
function nativeAppendOrInsertBefore(renderer, parent, child, beforeNode) {
  if (beforeNode !== null) {
    nativeInsertBefore(renderer, parent, child, beforeNode);
  } else {
    nativeAppendChild(renderer, parent, child);
  }
}
function nativeRemoveChild(renderer, parent, child, isHostElement) {
  if (isProceduralRenderer(renderer)) {
    renderer.removeChild(parent, child, isHostElement);
  } else {
    parent.removeChild(child);
  }
}
function nativeParentNode(renderer, node) {
  return isProceduralRenderer(renderer) ? renderer.parentNode(node) : node.parentNode;
}
function nativeNextSibling(renderer, node) {
  return isProceduralRenderer(renderer) ? renderer.nextSibling(node) : node.nextSibling;
}
function getNativeAnchorNode(parentTNode, lView) {
  if (parentTNode.type === 2) {
    var lContainer = getLContainer(parentTNode, lView);
    var index = lContainer.indexOf(lView, CONTAINER_HEADER_OFFSET) - CONTAINER_HEADER_OFFSET;
    return getBeforeNodeForView(index, lContainer);
  } else if (parentTNode.type === 4 || parentTNode.type === 5) {
    return getNativeByTNode(parentTNode, lView);
  }
  return null;
}
function appendChild(childEl, childTNode, currentView) {
  var e_1, _a;
  var renderParent = getRenderParent(childTNode, currentView);
  if (renderParent != null) {
    var renderer = currentView[RENDERER];
    var parentTNode = childTNode.parent || currentView[T_HOST];
    var anchorNode = getNativeAnchorNode(parentTNode, currentView);
    if (Array.isArray(childEl)) {
      try {
        for (var childEl_1 = tslib_1.__values(childEl), childEl_1_1 = childEl_1.next(); !childEl_1_1.done; childEl_1_1 = childEl_1.next()) {
          var nativeNode = childEl_1_1.value;
          nativeAppendOrInsertBefore(renderer, renderParent, nativeNode, anchorNode);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (childEl_1_1 && !childEl_1_1.done && (_a = childEl_1.return)) _a.call(childEl_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    } else {
      nativeAppendOrInsertBefore(renderer, renderParent, childEl, anchorNode);
    }
  }
}
function getHighestElementOrICUContainer(tNode) {
  while (tNode.parent != null && (tNode.parent.type === 4 || tNode.parent.type === 5)) {
    tNode = tNode.parent;
  }
  return tNode;
}
function getBeforeNodeForView(viewIndexInContainer, lContainer) {
  var nextViewIndex = CONTAINER_HEADER_OFFSET + viewIndexInContainer + 1;
  if (nextViewIndex < lContainer.length) {
    var lView = lContainer[nextViewIndex];
    ngDevMode && assertDefined(lView[T_HOST], "Missing Host TNode");
    var tViewNodeChild = lView[T_HOST].child;
    return tViewNodeChild !== null ? getNativeByTNodeOrNull(tViewNodeChild, lView) : lContainer[NATIVE];
  } else {
    return lContainer[NATIVE];
  }
}
function nativeRemoveNode(renderer, rNode, isHostElement) {
  var nativeParent = nativeParentNode(renderer, rNode);
  if (nativeParent) {
    nativeRemoveChild(renderer, nativeParent, rNode, isHostElement);
  }
}
function appendProjectedNodes(lView, tProjectionNode, selectorIndex, componentView) {
  var projectedView = componentView[PARENT];
  var componentNode = componentView[T_HOST];
  var nodeToProject = componentNode.projection[selectorIndex];
  if (Array.isArray(nodeToProject)) {
    appendChild(nodeToProject, tProjectionNode, lView);
  } else {
    while (nodeToProject) {
      if (!(nodeToProject.flags & 32)) {
        if (nodeToProject.type === 1) {
          appendProjectedNodes(lView, tProjectionNode, nodeToProject.projection, findComponentView(projectedView));
        } else {
          nodeToProject.flags |= 2;
          appendProjectedNode(nodeToProject, tProjectionNode, lView, projectedView);
        }
      }
      nodeToProject = nodeToProject.projectionNext;
    }
  }
}
function appendProjectedChildren(ngContainerChildTNode, tProjectionNode, currentView, projectionView) {
  while (ngContainerChildTNode) {
    appendProjectedNode(ngContainerChildTNode, tProjectionNode, currentView, projectionView);
    ngContainerChildTNode = ngContainerChildTNode.next;
  }
}
function appendProjectedNode(projectedTNode, tProjectionNode, currentView, projectionView) {
  var native = getNativeByTNode(projectedTNode, projectionView);
  appendChild(native, tProjectionNode, currentView);
  attachPatchData(native, projectionView);
  var nodeOrContainer = projectionView[projectedTNode.index];
  if (projectedTNode.type === 0) {
    for (var i = CONTAINER_HEADER_OFFSET; i < nodeOrContainer.length; i++) {
      addRemoveViewFromContainer(nodeOrContainer[i], true, nodeOrContainer[NATIVE]);
    }
  } else if (projectedTNode.type === 5) {
    var ngContainerChildTNode = projectedTNode.child;
    appendProjectedChildren(ngContainerChildTNode, ngContainerChildTNode, projectionView, projectionView);
  } else {
    if (projectedTNode.type === 4) {
      appendProjectedChildren(projectedTNode.child, tProjectionNode, currentView, projectionView);
    }
    if (isLContainer(nodeOrContainer)) {
      appendChild(nodeOrContainer[NATIVE], tProjectionNode, currentView);
    }
  }
}
function executeActionOnView(renderer, action, lView, renderParent, beforeNode) {
  var tView = lView[TVIEW];
  ngDevMode && assertNodeType(tView.node, 2);
  var viewRootTNode = tView.node.child;
  while (viewRootTNode !== null) {
    executeActionOnNode(renderer, action, lView, viewRootTNode, renderParent, beforeNode);
    viewRootTNode = viewRootTNode.next;
  }
}
function executeActionOnProjection(renderer, action, lView, tProjectionNode, renderParent, beforeNode) {
  var componentLView = findComponentView(lView);
  var componentNode = componentLView[T_HOST];
  ngDevMode && assertDefined(componentNode.projection, "Element nodes for which projection is processed must have projection defined.");
  var nodeToProject = componentNode.projection[tProjectionNode.projection];
  if (nodeToProject !== undefined) {
    if (Array.isArray(nodeToProject)) {
      for (var i = 0; i < nodeToProject.length; i++) {
        var rNode = nodeToProject[i];
        ngDevMode && assertDomNode(rNode);
        executeActionOnElementOrContainer(action, renderer, renderParent, rNode, beforeNode);
      }
    } else {
      var projectionTNode = nodeToProject;
      var projectedComponentLView = componentLView[PARENT];
      while (projectionTNode !== null) {
        executeActionOnNode(renderer, action, projectedComponentLView, projectionTNode, renderParent, beforeNode);
        projectionTNode = projectionTNode.projectionNext;
      }
    }
  }
}
function executeActionOnContainer(renderer, action, lContainer, renderParent, beforeNode) {
  ngDevMode && assertLContainer(lContainer);
  var anchor = lContainer[NATIVE];
  var native = unwrapRNode(lContainer);
  if (anchor !== native) {
    executeActionOnElementOrContainer(action, renderer, renderParent, anchor, beforeNode);
  }
  for (var i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
    var lView = lContainer[i];
    executeActionOnView(renderer, action, lView, renderParent, anchor);
  }
}
function executeActionOnElementContainerOrIcuContainer(renderer, action, lView, tNode, renderParent, beforeNode) {
  var node = lView[tNode.index];
  executeActionOnElementOrContainer(action, renderer, renderParent, node, beforeNode);
  var childTNode = tNode.child;
  while (childTNode) {
    executeActionOnNode(renderer, action, lView, childTNode, renderParent, beforeNode);
    childTNode = childTNode.next;
  }
}
function executeActionOnNode(renderer, action, lView, tNode, renderParent, beforeNode) {
  var nodeType = tNode.type;
  if (!(tNode.flags & 32)) {
    if (nodeType === 4 || nodeType === 5) {
      executeActionOnElementContainerOrIcuContainer(renderer, action, lView, tNode, renderParent, beforeNode);
    } else if (nodeType === 1) {
      executeActionOnProjection(renderer, action, lView, tNode, renderParent, beforeNode);
    } else {
      ngDevMode && assertNodeOfPossibleTypes(tNode, 3, 0);
      executeActionOnElementOrContainer(action, renderer, renderParent, lView[tNode.index], beforeNode);
    }
  }
}
function getParentInjectorTNode(location, startView, startTNode) {
  if (startTNode.parent && startTNode.parent.injectorIndex !== -1) {
    var injectorIndex = startTNode.parent.injectorIndex;
    var parentTNode_1 = startTNode.parent;
    while (parentTNode_1.parent != null && injectorIndex == parentTNode_1.injectorIndex) {
      parentTNode_1 = parentTNode_1.parent;
    }
    return parentTNode_1;
  }
  var viewOffset = getParentInjectorViewOffset(location);
  var parentView = startView;
  var parentTNode = startView[T_HOST];
  while (viewOffset > 1) {
    parentView = parentView[DECLARATION_VIEW];
    parentTNode = parentView[T_HOST];
    viewOffset--;
  }
  return parentTNode;
}
var ViewRef = (function () {
  function ViewRef(_lView, _context, _componentIndex) {
    this._context = _context;
    this._componentIndex = _componentIndex;
    this._appRef = null;
    this._viewContainerRef = null;
    this._tViewNode = null;
    this._lView = _lView;
  }
  Object.defineProperty(ViewRef.prototype, "rootNodes", {
    get: function () {
      if (this._lView[HOST] == null) {
        var tView = this._lView[T_HOST];
        return collectNativeNodes(this._lView, tView, []);
      }
      return [];
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewRef.prototype, "context", {
    get: function () {
      return this._context ? this._context : this._lookUpContext();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewRef.prototype, "destroyed", {
    get: function () {
      return (this._lView[FLAGS] & 256) === 256;
    },
    enumerable: true,
    configurable: true
  });
  ViewRef.prototype.destroy = function () {
    if (this._appRef) {
      this._appRef.detachView(this);
    } else if (this._viewContainerRef) {
      var index = this._viewContainerRef.indexOf(this);
      if (index > -1) {
        this._viewContainerRef.detach(index);
      }
      this._viewContainerRef = null;
    }
    destroyLView(this._lView);
  };
  ViewRef.prototype.onDestroy = function (callback) {
    storeCleanupFn(this._lView, callback);
  };
  ViewRef.prototype.markForCheck = function () {
    markViewDirty(this._lView);
  };
  ViewRef.prototype.detach = function () {
    this._lView[FLAGS] &= ~128;
  };
  ViewRef.prototype.reattach = function () {
    this._lView[FLAGS] |= 128;
  };
  ViewRef.prototype.detectChanges = function () {
    detectChangesInternal(this._lView, this.context);
  };
  ViewRef.prototype.checkNoChanges = function () {
    checkNoChangesInternal(this._lView, this.context);
  };
  ViewRef.prototype.attachToViewContainerRef = function (vcRef) {
    if (this._appRef) {
      throw new Error("This view is already attached directly to the ApplicationRef!");
    }
    this._viewContainerRef = vcRef;
  };
  ViewRef.prototype.detachFromAppRef = function () {
    this._appRef = null;
    renderDetachView(this._lView);
  };
  ViewRef.prototype.attachToAppRef = function (appRef) {
    if (this._viewContainerRef) {
      throw new Error("This view is already attached to a ViewContainer!");
    }
    this._appRef = appRef;
  };
  ViewRef.prototype._lookUpContext = function () {
    return this._context = getLViewParent(this._lView)[this._componentIndex];
  };
  return ViewRef;
})();
var RootViewRef = (function (_super) {
  tslib_1.__extends(RootViewRef, _super);
  function RootViewRef(_view) {
    var _this = _super.call(this, _view, null, -1) || this;
    _this._view = _view;
    return _this;
  }
  RootViewRef.prototype.detectChanges = function () {
    detectChangesInRootView(this._view);
  };
  RootViewRef.prototype.checkNoChanges = function () {
    checkNoChangesInRootView(this._view);
  };
  Object.defineProperty(RootViewRef.prototype, "context", {
    get: function () {
      return null;
    },
    enumerable: true,
    configurable: true
  });
  return RootViewRef;
})(ViewRef);
function collectNativeNodes(lView, parentTNode, result) {
  var tNodeChild = parentTNode.child;
  while (tNodeChild) {
    var nativeNode = getNativeByTNodeOrNull(tNodeChild, lView);
    nativeNode && result.push(nativeNode);
    if (tNodeChild.type === 4) {
      collectNativeNodes(lView, tNodeChild, result);
    } else if (tNodeChild.type === 1) {
      var componentView = findComponentView(lView);
      var componentHost = componentView[T_HOST];
      var parentView = getLViewParent(componentView);
      var currentProjectedNode = componentHost.projection[tNodeChild.projection];
      while (currentProjectedNode && parentView) {
        result.push(getNativeByTNode(currentProjectedNode, parentView));
        currentProjectedNode = currentProjectedNode.next;
      }
    }
    tNodeChild = tNodeChild.next;
  }
  return result;
}
function injectElementRef(ElementRefToken) {
  return createElementRef(ElementRefToken, getPreviousOrParentTNode(), getLView());
}
var R3ElementRef;
function createElementRef(ElementRefToken, tNode, view) {
  if (!R3ElementRef) {
    R3ElementRef = (function (_super) {
      tslib_1.__extends(ElementRef_, _super);
      function ElementRef_() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return ElementRef_;
    })(ElementRefToken);
  }
  return new R3ElementRef(getNativeByTNode(tNode, view));
}
exports.ɵangular_packages_core_core_g = createElementRef;
var R3TemplateRef;
function injectTemplateRef(TemplateRefToken, ElementRefToken) {
  return createTemplateRef(TemplateRefToken, ElementRefToken, getPreviousOrParentTNode(), getLView());
}
function createTemplateRef(TemplateRefToken, ElementRefToken, hostTNode, hostView) {
  if (!R3TemplateRef) {
    R3TemplateRef = (function (_super) {
      tslib_1.__extends(TemplateRef_, _super);
      function TemplateRef_(_declarationView, _declarationTContainer, elementRef) {
        var _this = _super.call(this) || this;
        _this._declarationView = _declarationView;
        _this._declarationTContainer = _declarationTContainer;
        _this.elementRef = elementRef;
        return _this;
      }
      TemplateRef_.prototype.createEmbeddedView = function (context) {
        var embeddedTView = this._declarationTContainer.tViews;
        var lView = createEmbeddedViewAndNode(embeddedTView, context, this._declarationView, this._declarationTContainer.injectorIndex);
        var declarationLContainer = this._declarationView[this._declarationTContainer.index];
        ngDevMode && assertLContainer(declarationLContainer);
        lView[DECLARATION_LCONTAINER] = declarationLContainer;
        var declarationViewLQueries = this._declarationView[QUERIES];
        if (declarationViewLQueries !== null) {
          lView[QUERIES] = declarationViewLQueries.createEmbeddedView(embeddedTView);
        }
        renderEmbeddedTemplate(lView, embeddedTView, context);
        var viewRef = new ViewRef(lView, context, -1);
        viewRef._tViewNode = lView[T_HOST];
        return viewRef;
      };
      return TemplateRef_;
    })(TemplateRefToken);
  }
  if (hostTNode.type === 0) {
    ngDevMode && assertDefined(hostTNode.tViews, "TView must be allocated");
    return new R3TemplateRef(hostView, hostTNode, createElementRef(ElementRefToken, hostTNode, hostView));
  } else {
    return null;
  }
}
exports.ɵangular_packages_core_core_h = createTemplateRef;
var R3ViewContainerRef;
function injectViewContainerRef(ViewContainerRefToken, ElementRefToken) {
  var previousTNode = getPreviousOrParentTNode();
  return createContainerRef(ViewContainerRefToken, ElementRefToken, previousTNode, getLView());
}
function createContainerRef(ViewContainerRefToken, ElementRefToken, hostTNode, hostView) {
  if (!R3ViewContainerRef) {
    R3ViewContainerRef = (function (_super) {
      tslib_1.__extends(ViewContainerRef_, _super);
      function ViewContainerRef_(_lContainer, _hostTNode, _hostView) {
        var _this = _super.call(this) || this;
        _this._lContainer = _lContainer;
        _this._hostTNode = _hostTNode;
        _this._hostView = _hostView;
        return _this;
      }
      Object.defineProperty(ViewContainerRef_.prototype, "element", {
        get: function () {
          return createElementRef(ElementRefToken, this._hostTNode, this._hostView);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewContainerRef_.prototype, "injector", {
        get: function () {
          return new NodeInjector(this._hostTNode, this._hostView);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ViewContainerRef_.prototype, "parentInjector", {
        get: function () {
          var parentLocation = getParentInjectorLocation(this._hostTNode, this._hostView);
          var parentView = getParentInjectorView(parentLocation, this._hostView);
          var parentTNode = getParentInjectorTNode(parentLocation, this._hostView, this._hostTNode);
          return !hasParentInjector(parentLocation) || parentTNode == null ? new NodeInjector(null, this._hostView) : new NodeInjector(parentTNode, parentView);
        },
        enumerable: true,
        configurable: true
      });
      ViewContainerRef_.prototype.clear = function () {
        while (this.length > 0) {
          this.remove(this.length - 1);
        }
      };
      ViewContainerRef_.prototype.get = function (index) {
        return this._lContainer[VIEW_REFS] !== null && this._lContainer[VIEW_REFS][index] || null;
      };
      Object.defineProperty(ViewContainerRef_.prototype, "length", {
        get: function () {
          return this._lContainer.length - CONTAINER_HEADER_OFFSET;
        },
        enumerable: true,
        configurable: true
      });
      ViewContainerRef_.prototype.createEmbeddedView = function (templateRef, context, index) {
        var viewRef = templateRef.createEmbeddedView(context || ({}));
        this.insert(viewRef, index);
        return viewRef;
      };
      ViewContainerRef_.prototype.createComponent = function (componentFactory, index, injector, projectableNodes, ngModuleRef) {
        var contextInjector = injector || this.parentInjector;
        if (!ngModuleRef && componentFactory.ngModule == null && contextInjector) {
          ngModuleRef = contextInjector.get(NgModuleRef, null);
        }
        var componentRef = componentFactory.create(contextInjector, projectableNodes, undefined, ngModuleRef);
        this.insert(componentRef.hostView, index);
        return componentRef;
      };
      ViewContainerRef_.prototype.insert = function (viewRef, index) {
        if (viewRef.destroyed) {
          throw new Error("Cannot insert a destroyed View in a ViewContainer!");
        }
        this.allocateContainerIfNeeded();
        var lView = viewRef._lView;
        var adjustedIdx = this._adjustIndex(index);
        if (viewAttachedToContainer(lView)) {
          return this.move(viewRef, adjustedIdx);
        }
        insertView(lView, this._lContainer, adjustedIdx);
        var beforeNode = getBeforeNodeForView(adjustedIdx, this._lContainer);
        addRemoveViewFromContainer(lView, true, beforeNode);
        viewRef.attachToViewContainerRef(this);
        addToArray(this._lContainer[VIEW_REFS], adjustedIdx, viewRef);
        return viewRef;
      };
      ViewContainerRef_.prototype.move = function (viewRef, newIndex) {
        if (viewRef.destroyed) {
          throw new Error("Cannot move a destroyed View in a ViewContainer!");
        }
        var index = this.indexOf(viewRef);
        if (index !== -1) this.detach(index);
        this.insert(viewRef, newIndex);
        return viewRef;
      };
      ViewContainerRef_.prototype.indexOf = function (viewRef) {
        return this._lContainer[VIEW_REFS] !== null ? this._lContainer[VIEW_REFS].indexOf(viewRef) : 0;
      };
      ViewContainerRef_.prototype.remove = function (index) {
        this.allocateContainerIfNeeded();
        var adjustedIdx = this._adjustIndex(index, -1);
        removeView(this._lContainer, adjustedIdx);
        removeFromArray(this._lContainer[VIEW_REFS], adjustedIdx);
      };
      ViewContainerRef_.prototype.detach = function (index) {
        this.allocateContainerIfNeeded();
        var adjustedIdx = this._adjustIndex(index, -1);
        var view = detachView(this._lContainer, adjustedIdx);
        var wasDetached = view && removeFromArray(this._lContainer[VIEW_REFS], adjustedIdx) != null;
        return wasDetached ? new ViewRef(view, view[CONTEXT], -1) : null;
      };
      ViewContainerRef_.prototype._adjustIndex = function (index, shift) {
        if (shift === void 0) {
          shift = 0;
        }
        if (index == null) {
          return this.length + shift;
        }
        if (ngDevMode) {
          assertGreaterThan(index, -1, "index must be positive");
          assertLessThan(index, this.length + 1 + shift, "index");
        }
        return index;
      };
      ViewContainerRef_.prototype.allocateContainerIfNeeded = function () {
        if (this._lContainer[VIEW_REFS] === null) {
          this._lContainer[VIEW_REFS] = [];
        }
      };
      return ViewContainerRef_;
    })(ViewContainerRefToken);
  }
  ngDevMode && assertNodeOfPossibleTypes(hostTNode, 0, 3, 4);
  var lContainer;
  var slotValue = hostView[hostTNode.index];
  if (isLContainer(slotValue)) {
    lContainer = slotValue;
    lContainer[ACTIVE_INDEX] = -1;
  } else {
    var commentNode = void 0;
    if (hostTNode.type === 4) {
      commentNode = unwrapRNode(slotValue);
    } else {
      ngDevMode && ngDevMode.rendererCreateComment++;
      commentNode = hostView[RENDERER].createComment(ngDevMode ? "container" : "");
    }
    if (isRootView(hostView)) {
      var renderer = hostView[RENDERER];
      var hostNative = getNativeByTNode(hostTNode, hostView);
      var parentOfHostNative = nativeParentNode(renderer, hostNative);
      nativeInsertBefore(renderer, parentOfHostNative, commentNode, nativeNextSibling(renderer, hostNative));
    } else {
      appendChild(commentNode, hostTNode, hostView);
    }
    hostView[hostTNode.index] = lContainer = createLContainer(slotValue, hostView, commentNode, hostTNode, true);
    addToViewTree(hostView, lContainer);
  }
  return new R3ViewContainerRef(lContainer, hostTNode, hostView);
}
function injectChangeDetectorRef(isPipe) {
  if (isPipe === void 0) {
    isPipe = false;
  }
  return createViewRef(getPreviousOrParentTNode(), getLView(), isPipe);
}
function createViewRef(hostTNode, hostView, isPipe) {
  if (isComponent(hostTNode) && !isPipe) {
    var componentIndex = hostTNode.directiveStart;
    var componentView = getComponentViewByIndex(hostTNode.index, hostView);
    return new ViewRef(componentView, null, componentIndex);
  } else if (hostTNode.type === 3 || hostTNode.type === 0 || hostTNode.type === 4) {
    var hostComponentView = findComponentView(hostView);
    return new ViewRef(hostComponentView, hostComponentView[CONTEXT], -1);
  }
  return null;
}
function getOrCreateRenderer2(view) {
  var renderer = view[RENDERER];
  if (isProceduralRenderer(renderer)) {
    return renderer;
  } else {
    throw new Error("Cannot inject Renderer2 when the application uses Renderer3!");
  }
}
function injectRenderer2() {
  var lView = getLView();
  var tNode = getPreviousOrParentTNode();
  var nodeAtIndex = getComponentViewByIndex(tNode.index, lView);
  return getOrCreateRenderer2(isLView(nodeAtIndex) ? nodeAtIndex : lView);
}
var ChangeDetectorRef = (function () {
  function ChangeDetectorRef() {}
  exports.ChangeDetectorRef = ChangeDetectorRef;
  ChangeDetectorRef.__NG_ELEMENT_ID__ = function () {
    return SWITCH_CHANGE_DETECTOR_REF_FACTORY();
  };
  return ChangeDetectorRef;
})();
exports.ChangeDetectorRef = ChangeDetectorRef;
var SWITCH_CHANGE_DETECTOR_REF_FACTORY__POST_R3__ = injectChangeDetectorRef;
exports.ɵSWITCH_CHANGE_DETECTOR_REF_FACTORY__POST_R3__ = SWITCH_CHANGE_DETECTOR_REF_FACTORY__POST_R3__;
var SWITCH_CHANGE_DETECTOR_REF_FACTORY__PRE_R3__ = function () {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
};
var ɵ0$6 = SWITCH_CHANGE_DETECTOR_REF_FACTORY__PRE_R3__;
var SWITCH_CHANGE_DETECTOR_REF_FACTORY = SWITCH_CHANGE_DETECTOR_REF_FACTORY__PRE_R3__;
var Type = Function;
exports.Type = Type;
function isType(v) {
  return typeof v === "function";
}
var DELEGATE_CTOR = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*arguments\)/;
var INHERITED_CLASS = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{/;
var INHERITED_CLASS_WITH_CTOR = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{[\s\S]*constructor\s*\(/;
var INHERITED_CLASS_WITH_DELEGATE_CTOR = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{[\s\S]*constructor\s*\(\)\s*{\s+super\(\.\.\.arguments\)/;
function isDelegateCtor(typeStr) {
  return DELEGATE_CTOR.test(typeStr) || INHERITED_CLASS_WITH_DELEGATE_CTOR.test(typeStr) || INHERITED_CLASS.test(typeStr) && !INHERITED_CLASS_WITH_CTOR.test(typeStr);
}
var ReflectionCapabilities = (function () {
  function ReflectionCapabilities(reflect) {
    this._reflect = reflect || _global["Reflect"];
  }
  exports.ɵReflectionCapabilities = ReflectionCapabilities;
  ReflectionCapabilities.prototype.isReflectionEnabled = function () {
    return true;
  };
  ReflectionCapabilities.prototype.factory = function (t) {
    return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return new (t.bind.apply(t, tslib_1.__spread([void 0], args)))();
    };
  };
  ReflectionCapabilities.prototype._zipTypesAndAnnotations = function (paramTypes, paramAnnotations) {
    var result;
    if (typeof paramTypes === "undefined") {
      result = new Array(paramAnnotations.length);
    } else {
      result = new Array(paramTypes.length);
    }
    for (var i = 0; i < result.length; i++) {
      if (typeof paramTypes === "undefined") {
        result[i] = [];
      } else if (paramTypes[i] && paramTypes[i] != Object) {
        result[i] = [paramTypes[i]];
      } else {
        result[i] = [];
      }
      if (paramAnnotations && paramAnnotations[i] != null) {
        result[i] = result[i].concat(paramAnnotations[i]);
      }
    }
    return result;
  };
  ReflectionCapabilities.prototype._ownParameters = function (type, parentCtor) {
    var typeStr = type.toString();
    if (isDelegateCtor(typeStr)) {
      return null;
    }
    if (type.parameters && type.parameters !== parentCtor.parameters) {
      return type.parameters;
    }
    var tsickleCtorParams = type.ctorParameters;
    if (tsickleCtorParams && tsickleCtorParams !== parentCtor.ctorParameters) {
      var ctorParameters = typeof tsickleCtorParams === "function" ? tsickleCtorParams() : tsickleCtorParams;
      var paramTypes_1 = ctorParameters.map(function (ctorParam) {
        return ctorParam && ctorParam.type;
      });
      var paramAnnotations_1 = ctorParameters.map(function (ctorParam) {
        return ctorParam && convertTsickleDecoratorIntoMetadata(ctorParam.decorators);
      });
      return this._zipTypesAndAnnotations(paramTypes_1, paramAnnotations_1);
    }
    var paramAnnotations = type.hasOwnProperty(PARAMETERS) && type[PARAMETERS];
    var paramTypes = this._reflect && this._reflect.getOwnMetadata && this._reflect.getOwnMetadata("design:paramtypes", type);
    if (paramTypes || paramAnnotations) {
      return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
    }
    return new Array(type.length).fill(undefined);
  };
  ReflectionCapabilities.prototype.parameters = function (type) {
    if (!isType(type)) {
      return [];
    }
    var parentCtor = getParentCtor(type);
    var parameters = this._ownParameters(type, parentCtor);
    if (!parameters && parentCtor !== Object) {
      parameters = this.parameters(parentCtor);
    }
    return parameters || [];
  };
  ReflectionCapabilities.prototype._ownAnnotations = function (typeOrFunc, parentCtor) {
    if (typeOrFunc.annotations && typeOrFunc.annotations !== parentCtor.annotations) {
      var annotations = typeOrFunc.annotations;
      if (typeof annotations === "function" && annotations.annotations) {
        annotations = annotations.annotations;
      }
      return annotations;
    }
    if (typeOrFunc.decorators && typeOrFunc.decorators !== parentCtor.decorators) {
      return convertTsickleDecoratorIntoMetadata(typeOrFunc.decorators);
    }
    if (typeOrFunc.hasOwnProperty(ANNOTATIONS)) {
      return typeOrFunc[ANNOTATIONS];
    }
    return null;
  };
  ReflectionCapabilities.prototype.annotations = function (typeOrFunc) {
    if (!isType(typeOrFunc)) {
      return [];
    }
    var parentCtor = getParentCtor(typeOrFunc);
    var ownAnnotations = this._ownAnnotations(typeOrFunc, parentCtor) || [];
    var parentAnnotations = parentCtor !== Object ? this.annotations(parentCtor) : [];
    return parentAnnotations.concat(ownAnnotations);
  };
  ReflectionCapabilities.prototype._ownPropMetadata = function (typeOrFunc, parentCtor) {
    if (typeOrFunc.propMetadata && typeOrFunc.propMetadata !== parentCtor.propMetadata) {
      var propMetadata = typeOrFunc.propMetadata;
      if (typeof propMetadata === "function" && propMetadata.propMetadata) {
        propMetadata = propMetadata.propMetadata;
      }
      return propMetadata;
    }
    if (typeOrFunc.propDecorators && typeOrFunc.propDecorators !== parentCtor.propDecorators) {
      var propDecorators_1 = typeOrFunc.propDecorators;
      var propMetadata_1 = {};
      Object.keys(propDecorators_1).forEach(function (prop) {
        propMetadata_1[prop] = convertTsickleDecoratorIntoMetadata(propDecorators_1[prop]);
      });
      return propMetadata_1;
    }
    if (typeOrFunc.hasOwnProperty(PROP_METADATA)) {
      return typeOrFunc[PROP_METADATA];
    }
    return null;
  };
  ReflectionCapabilities.prototype.propMetadata = function (typeOrFunc) {
    if (!isType(typeOrFunc)) {
      return {};
    }
    var parentCtor = getParentCtor(typeOrFunc);
    var propMetadata = {};
    if (parentCtor !== Object) {
      var parentPropMetadata_1 = this.propMetadata(parentCtor);
      Object.keys(parentPropMetadata_1).forEach(function (propName) {
        propMetadata[propName] = parentPropMetadata_1[propName];
      });
    }
    var ownPropMetadata = this._ownPropMetadata(typeOrFunc, parentCtor);
    if (ownPropMetadata) {
      Object.keys(ownPropMetadata).forEach(function (propName) {
        var decorators = [];
        if (propMetadata.hasOwnProperty(propName)) {
          decorators.push.apply(decorators, tslib_1.__spread(propMetadata[propName]));
        }
        decorators.push.apply(decorators, tslib_1.__spread(ownPropMetadata[propName]));
        propMetadata[propName] = decorators;
      });
    }
    return propMetadata;
  };
  ReflectionCapabilities.prototype.ownPropMetadata = function (typeOrFunc) {
    if (!isType(typeOrFunc)) {
      return {};
    }
    return this._ownPropMetadata(typeOrFunc, getParentCtor(typeOrFunc)) || ({});
  };
  ReflectionCapabilities.prototype.hasLifecycleHook = function (type, lcProperty) {
    return type instanceof Type && (lcProperty in type.prototype);
  };
  ReflectionCapabilities.prototype.guards = function (type) {
    return {};
  };
  ReflectionCapabilities.prototype.getter = function (name) {
    return new Function("o", "return o." + name + ";");
  };
  ReflectionCapabilities.prototype.setter = function (name) {
    return new Function("o", "v", "return o." + name + " = v;");
  };
  ReflectionCapabilities.prototype.method = function (name) {
    var functionBody = "if (!o." + name + ") throw new Error('\"" + name + "\" is undefined');\n        return o." + name + ".apply(o, args);";
    return new Function("o", "args", functionBody);
  };
  ReflectionCapabilities.prototype.importUri = function (type) {
    if (typeof type === "object" && type["filePath"]) {
      return type["filePath"];
    }
    return "./" + stringify(type);
  };
  ReflectionCapabilities.prototype.resourceUri = function (type) {
    return "./" + stringify(type);
  };
  ReflectionCapabilities.prototype.resolveIdentifier = function (name, moduleUrl, members, runtime) {
    return runtime;
  };
  ReflectionCapabilities.prototype.resolveEnum = function (enumIdentifier, name) {
    return enumIdentifier[name];
  };
  return ReflectionCapabilities;
})();
exports.ɵReflectionCapabilities = ReflectionCapabilities;
function convertTsickleDecoratorIntoMetadata(decoratorInvocations) {
  if (!decoratorInvocations) {
    return [];
  }
  return decoratorInvocations.map(function (decoratorInvocation) {
    var decoratorType = decoratorInvocation.type;
    var annotationCls = decoratorType.annotationCls;
    var annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
    return new (annotationCls.bind.apply(annotationCls, tslib_1.__spread([void 0], annotationArgs)))();
  });
}
function getParentCtor(ctor) {
  var parentProto = ctor.prototype ? Object.getPrototypeOf(ctor.prototype) : null;
  var parentCtor = parentProto ? parentProto.constructor : null;
  return parentCtor || Object;
}
var _reflect = null;
function getReflect() {
  return _reflect = _reflect || new ReflectionCapabilities();
}
function reflectDependencies(type) {
  return convertDependencies(getReflect().parameters(type));
}
function convertDependencies(deps) {
  var compiler = getCompilerFacade();
  return deps.map(function (dep) {
    return reflectDependency(compiler, dep);
  });
}
function reflectDependency(compiler, dep) {
  var meta = {
    token: null,
    host: false,
    optional: false,
    resolved: compiler.R3ResolvedDependencyType.Token,
    self: false,
    skipSelf: false
  };
  function setTokenAndResolvedType(token) {
    meta.resolved = compiler.R3ResolvedDependencyType.Token;
    meta.token = token;
  }
  if (Array.isArray(dep)) {
    if (dep.length === 0) {
      throw new Error("Dependency array must have arguments.");
    }
    for (var j = 0; j < dep.length; j++) {
      var param = dep[j];
      if (param === undefined) {
        continue;
      } else if (param instanceof Optional || param.__proto__.ngMetadataName === "Optional") {
        meta.optional = true;
      } else if (param instanceof SkipSelf || param.__proto__.ngMetadataName === "SkipSelf") {
        meta.skipSelf = true;
      } else if (param instanceof Self || param.__proto__.ngMetadataName === "Self") {
        meta.self = true;
      } else if (param instanceof Host || param.__proto__.ngMetadataName === "Host") {
        meta.host = true;
      } else if (param instanceof Inject) {
        meta.token = param.token;
      } else if (param instanceof Attribute) {
        if (param.attributeName === undefined) {
          throw new Error("Attribute name must be defined.");
        }
        meta.token = param.attributeName;
        meta.resolved = compiler.R3ResolvedDependencyType.Attribute;
      } else if (param === ChangeDetectorRef) {
        meta.token = param;
        meta.resolved = compiler.R3ResolvedDependencyType.ChangeDetectorRef;
      } else {
        setTokenAndResolvedType(param);
      }
    }
  } else {
    setTokenAndResolvedType(dep);
  }
  return meta;
}
function compileInjectable(type, srcMeta) {
  var def = null;
  if (type.hasOwnProperty(NG_INJECTABLE_DEF)) return;
  Object.defineProperty(type, NG_INJECTABLE_DEF, {
    get: function () {
      if (def === null) {
        var meta = srcMeta || ({
          providedIn: null
        });
        var hasAProvider = isUseClassProvider(meta) || isUseFactoryProvider(meta) || isUseValueProvider(meta) || isUseExistingProvider(meta);
        var compilerMeta = {
          name: type.name,
          type: type,
          typeArgumentCount: 0,
          providedIn: meta.providedIn,
          ctorDeps: reflectDependencies(type),
          userDeps: undefined
        };
        if ((isUseClassProvider(meta) || isUseFactoryProvider(meta)) && meta.deps !== undefined) {
          compilerMeta.userDeps = convertDependencies(meta.deps);
        }
        if (!hasAProvider) {
          compilerMeta.useClass = type;
        } else if (isUseClassProvider(meta)) {
          compilerMeta.useClass = meta.useClass;
        } else if (isUseValueProvider(meta)) {
          compilerMeta.useValue = meta.useValue;
        } else if (isUseFactoryProvider(meta)) {
          compilerMeta.useFactory = meta.useFactory;
        } else if (isUseExistingProvider(meta)) {
          compilerMeta.useExisting = meta.useExisting;
        } else {
          throw new Error("Unreachable state.");
        }
        def = getCompilerFacade().compileInjectable(angularCoreDiEnv, "ng:///" + type.name + "/ngInjectableDef.js", compilerMeta);
      }
      return def;
    }
  });
}
var ɵ0$7 = getClosureSafeProperty;
var USE_VALUE$1 = getClosureSafeProperty({
  provide: String,
  useValue: ɵ0$7
});
function isUseClassProvider(meta) {
  return meta.useClass !== undefined;
}
function isUseValueProvider(meta) {
  return (USE_VALUE$1 in meta);
}
function isUseFactoryProvider(meta) {
  return meta.useFactory !== undefined;
}
function isUseExistingProvider(meta) {
  return meta.useExisting !== undefined;
}
var ɵ0$8 = getClosureSafeProperty;
var USE_VALUE$2 = getClosureSafeProperty({
  provide: String,
  useValue: ɵ0$8
});
var EMPTY_ARRAY$1 = [];
function convertInjectableProviderToFactory(type, provider) {
  if (!provider) {
    var reflectionCapabilities = new ReflectionCapabilities();
    var deps_1 = reflectionCapabilities.parameters(type);
    return function () {
      return new (type.bind.apply(type, tslib_1.__spread([void 0], injectArgs(deps_1))))();
    };
  }
  if ((USE_VALUE$2 in provider)) {
    var valueProvider_1 = provider;
    return function () {
      return valueProvider_1.useValue;
    };
  } else if (provider.useExisting) {
    var existingProvider_1 = provider;
    return function () {
      return ɵɵinject(existingProvider_1.useExisting);
    };
  } else if (provider.useFactory) {
    var factoryProvider_1 = provider;
    return function () {
      return factoryProvider_1.useFactory.apply(factoryProvider_1, tslib_1.__spread(injectArgs(factoryProvider_1.deps || EMPTY_ARRAY$1)));
    };
  } else if (provider.useClass) {
    var classProvider_1 = provider;
    var deps_2 = provider.deps;
    if (!deps_2) {
      var reflectionCapabilities = new ReflectionCapabilities();
      deps_2 = reflectionCapabilities.parameters(type);
    }
    return function () {
      var _a;
      return new ((_a = classProvider_1.useClass).bind.apply(_a, tslib_1.__spread([void 0], injectArgs(deps_2))))();
    };
  } else {
    var deps_3 = provider.deps;
    if (!deps_3) {
      var reflectionCapabilities = new ReflectionCapabilities();
      deps_3 = reflectionCapabilities.parameters(type);
    }
    return function () {
      return new (type.bind.apply(type, tslib_1.__spread([void 0], injectArgs(deps_3))))();
    };
  }
}
var ɵ0$9 = function (type, meta) {
  return SWITCH_COMPILE_INJECTABLE(type, meta);
};
var Injectable = makeDecorator("Injectable", undefined, undefined, undefined, ɵ0$9);
exports.Injectable = Injectable;
function render2CompileInjectable(injectableType, options) {
  if (options && options.providedIn !== undefined && !getInjectableDef(injectableType)) {
    injectableType.ngInjectableDef = ɵɵdefineInjectable({
      token: injectableType,
      providedIn: options.providedIn,
      factory: convertInjectableProviderToFactory(injectableType, options)
    });
  }
}
var SWITCH_COMPILE_INJECTABLE__POST_R3__ = compileInjectable;
exports.ɵSWITCH_COMPILE_INJECTABLE__POST_R3__ = SWITCH_COMPILE_INJECTABLE__POST_R3__;
var SWITCH_COMPILE_INJECTABLE__PRE_R3__ = render2CompileInjectable;
var SWITCH_COMPILE_INJECTABLE = SWITCH_COMPILE_INJECTABLE__PRE_R3__;
var APP_ROOT = new InjectionToken("The presence of this token marks an injector as being the root injector.");
exports.ɵAPP_ROOT = APP_ROOT;
var NOT_YET = {};
var CIRCULAR = {};
var EMPTY_ARRAY$2 = [];
var NULL_INJECTOR = undefined;
function getNullInjector() {
  if (NULL_INJECTOR === undefined) {
    NULL_INJECTOR = new NullInjector();
  }
  return NULL_INJECTOR;
}
function createInjector(defType, parent, additionalProviders, name) {
  if (parent === void 0) {
    parent = null;
  }
  if (additionalProviders === void 0) {
    additionalProviders = null;
  }
  parent = parent || getNullInjector();
  return new R3Injector(defType, additionalProviders, parent, name);
}
exports.ɵcreateInjector = createInjector;
var R3Injector = (function () {
  function R3Injector(def, additionalProviders, parent, source) {
    var _this = this;
    if (source === void 0) {
      source = null;
    }
    this.parent = parent;
    this.records = new Map();
    this.injectorDefTypes = new Set();
    this.onDestroy = new Set();
    this._destroyed = false;
    var dedupStack = [];
    deepForEach([def], function (injectorDef) {
      return _this.processInjectorType(injectorDef, [], dedupStack);
    });
    additionalProviders && deepForEach(additionalProviders, function (provider) {
      return _this.processProvider(provider, def, additionalProviders);
    });
    this.records.set(INJECTOR, makeRecord(undefined, this));
    this.isRootInjector = this.records.has(APP_ROOT);
    this.injectorDefTypes.forEach(function (defType) {
      return _this.get(defType);
    });
    this.source = source || (typeof def === "object" ? null : stringify(def));
  }
  Object.defineProperty(R3Injector.prototype, "destroyed", {
    get: function () {
      return this._destroyed;
    },
    enumerable: true,
    configurable: true
  });
  R3Injector.prototype.destroy = function () {
    this.assertNotDestroyed();
    this._destroyed = true;
    try {
      this.onDestroy.forEach(function (service) {
        return service.ngOnDestroy();
      });
    } finally {
      this.records.clear();
      this.onDestroy.clear();
      this.injectorDefTypes.clear();
    }
  };
  R3Injector.prototype.get = function (token, notFoundValue, flags) {
    if (notFoundValue === void 0) {
      notFoundValue = THROW_IF_NOT_FOUND;
    }
    if (flags === void 0) {
      flags = InjectFlags.Default;
    }
    this.assertNotDestroyed();
    var previousInjector = setCurrentInjector(this);
    try {
      if (!(flags & InjectFlags.SkipSelf)) {
        var record = this.records.get(token);
        if (record === undefined) {
          var def = couldBeInjectableType(token) && getInjectableDef(token);
          if (def && this.injectableDefInScope(def)) {
            record = makeRecord(injectableDefOrInjectorDefFactory(token), NOT_YET);
            this.records.set(token, record);
          }
        }
        if (record !== undefined) {
          return this.hydrate(token, record);
        }
      }
      var nextInjector = !(flags & InjectFlags.Self) ? this.parent : getNullInjector();
      return nextInjector.get(token, flags & InjectFlags.Optional ? null : notFoundValue);
    } catch (e) {
      if (e.name === "NullInjectorError") {
        var path = e[NG_TEMP_TOKEN_PATH] = e[NG_TEMP_TOKEN_PATH] || [];
        path.unshift(stringify(token));
        if (previousInjector) {
          throw e;
        } else {
          return catchInjectorError(e, token, "R3InjectorError", this.source);
        }
      } else {
        throw e;
      }
    } finally {
      setCurrentInjector(previousInjector);
    }
  };
  R3Injector.prototype.toString = function () {
    var tokens = [], records = this.records;
    records.forEach(function (v, token) {
      return tokens.push(stringify(token));
    });
    return "R3Injector[" + tokens.join(", ") + "]";
  };
  R3Injector.prototype.assertNotDestroyed = function () {
    if (this._destroyed) {
      throw new Error("Injector has already been destroyed.");
    }
  };
  R3Injector.prototype.processInjectorType = function (defOrWrappedDef, parents, dedupStack) {
    var _this = this;
    defOrWrappedDef = resolveForwardRef(defOrWrappedDef);
    if (!defOrWrappedDef) return false;
    var def = getInjectorDef(defOrWrappedDef);
    var ngModule = def == null && defOrWrappedDef.ngModule || undefined;
    var defType = ngModule === undefined ? defOrWrappedDef : ngModule;
    if (ngDevMode && parents.indexOf(defType) !== -1) {
      var defName = stringify(defType);
      throw new Error("Circular dependency in DI detected for type " + defName + ". Dependency path: " + parents.map(function (defType) {
        return stringify(defType);
      }).join(" > ") + " > " + defName + ".");
    }
    var isDuplicate = dedupStack.indexOf(defType) !== -1;
    if (ngModule !== undefined) {
      def = getInjectorDef(ngModule);
    }
    if (def == null) {
      return false;
    }
    this.injectorDefTypes.add(defType);
    this.records.set(defType, makeRecord(def.factory, NOT_YET));
    if (def.imports != null && !isDuplicate) {
      ngDevMode && parents.push(defType);
      dedupStack.push(defType);
      var importTypesWithProviders_1;
      try {
        deepForEach(def.imports, function (imported) {
          if (_this.processInjectorType(imported, parents, dedupStack)) {
            if (importTypesWithProviders_1 === undefined) importTypesWithProviders_1 = [];
            importTypesWithProviders_1.push(imported);
          }
        });
      } finally {
        ngDevMode && parents.pop();
      }
      if (importTypesWithProviders_1 !== undefined) {
        var _loop_1 = function (i) {
          var _a = importTypesWithProviders_1[i], ngModule_1 = _a.ngModule, providers = _a.providers;
          deepForEach(providers, function (provider) {
            return _this.processProvider(provider, ngModule_1, providers || EMPTY_ARRAY$2);
          });
        };
        for (var i = 0; i < importTypesWithProviders_1.length; i++) {
          _loop_1(i);
        }
      }
    }
    var defProviders = def.providers;
    if (defProviders != null && !isDuplicate) {
      var injectorType_1 = defOrWrappedDef;
      deepForEach(defProviders, function (provider) {
        return _this.processProvider(provider, injectorType_1, defProviders);
      });
    }
    return ngModule !== undefined && defOrWrappedDef.providers !== undefined;
  };
  R3Injector.prototype.processProvider = function (provider, ngModuleType, providers) {
    provider = resolveForwardRef(provider);
    var token = isTypeProvider(provider) ? provider : resolveForwardRef(provider && provider.provide);
    var record = providerToRecord(provider, ngModuleType, providers);
    if (!isTypeProvider(provider) && provider.multi === true) {
      var multiRecord_1 = this.records.get(token);
      if (multiRecord_1) {
        if (multiRecord_1.multi === undefined) {
          throwMixedMultiProviderError();
        }
      } else {
        multiRecord_1 = makeRecord(undefined, NOT_YET, true);
        multiRecord_1.factory = function () {
          return injectArgs(multiRecord_1.multi);
        };
        this.records.set(token, multiRecord_1);
      }
      token = provider;
      multiRecord_1.multi.push(provider);
    } else {
      var existing = this.records.get(token);
      if (existing && existing.multi !== undefined) {
        throwMixedMultiProviderError();
      }
    }
    this.records.set(token, record);
  };
  R3Injector.prototype.hydrate = function (token, record) {
    if (record.value === CIRCULAR) {
      throwCyclicDependencyError(stringify(token));
    } else if (record.value === NOT_YET) {
      record.value = CIRCULAR;
      record.value = record.factory();
    }
    if (typeof record.value === "object" && record.value && hasOnDestroy(record.value)) {
      this.onDestroy.add(record.value);
    }
    return record.value;
  };
  R3Injector.prototype.injectableDefInScope = function (def) {
    if (!def.providedIn) {
      return false;
    } else if (typeof def.providedIn === "string") {
      return def.providedIn === "any" || def.providedIn === "root" && this.isRootInjector;
    } else {
      return this.injectorDefTypes.has(def.providedIn);
    }
  };
  return R3Injector;
})();
function injectableDefOrInjectorDefFactory(token) {
  var injectableDef = getInjectableDef(token);
  if (injectableDef !== null) {
    return injectableDef.factory;
  }
  var injectorDef = getInjectorDef(token);
  if (injectorDef !== null) {
    return injectorDef.factory;
  }
  if (token instanceof InjectionToken) {
    throw new Error("Token " + stringify(token) + " is missing an ngInjectableDef definition.");
  }
  if (token instanceof Function) {
    return getUndecoratedInjectableFactory(token);
  }
  throw new Error("unreachable");
}
function getUndecoratedInjectableFactory(token) {
  var paramLength = token.length;
  if (paramLength > 0) {
    var args = new Array(paramLength).fill("?");
    throw new Error("Can't resolve all parameters for " + stringify(token) + ": (" + args.join(", ") + ").");
  }
  var inheritedInjectableDef = getInheritedInjectableDef(token);
  if (inheritedInjectableDef !== null) {
    return function () {
      return inheritedInjectableDef.factory(token);
    };
  } else {
    return function () {
      return new token();
    };
  }
}
function providerToRecord(provider, ngModuleType, providers) {
  var factory = providerToFactory(provider, ngModuleType, providers);
  if (isValueProvider(provider)) {
    return makeRecord(undefined, provider.useValue);
  } else {
    return makeRecord(factory, NOT_YET);
  }
}
function providerToFactory(provider, ngModuleType, providers) {
  var factory = undefined;
  if (isTypeProvider(provider)) {
    return injectableDefOrInjectorDefFactory(resolveForwardRef(provider));
  } else {
    if (isValueProvider(provider)) {
      factory = function () {
        return resolveForwardRef(provider.useValue);
      };
    } else if (isExistingProvider(provider)) {
      factory = function () {
        return ɵɵinject(resolveForwardRef(provider.useExisting));
      };
    } else if (isFactoryProvider(provider)) {
      factory = function () {
        return provider.useFactory.apply(provider, tslib_1.__spread(injectArgs(provider.deps || [])));
      };
    } else {
      var classRef_1 = resolveForwardRef(provider && (provider.useClass || provider.provide));
      if (!classRef_1) {
        throwInvalidProviderError(ngModuleType, providers, provider);
      }
      if (hasDeps(provider)) {
        factory = function () {
          return new (classRef_1.bind.apply(classRef_1, tslib_1.__spread([void 0], injectArgs(provider.deps))))();
        };
      } else {
        return injectableDefOrInjectorDefFactory(classRef_1);
      }
    }
  }
  return factory;
}
function makeRecord(factory, value, multi) {
  if (multi === void 0) {
    multi = false;
  }
  return {
    factory: factory,
    value: value,
    multi: multi ? [] : undefined
  };
}
function isValueProvider(value) {
  return value !== null && typeof value == "object" && (USE_VALUE in value);
}
function isExistingProvider(value) {
  return !!(value && value.useExisting);
}
function isFactoryProvider(value) {
  return !!(value && value.useFactory);
}
function isTypeProvider(value) {
  return typeof value === "function";
}
function isClassProvider(value) {
  return !!value.useClass;
}
function hasDeps(value) {
  return !!value.deps;
}
function hasOnDestroy(value) {
  return value !== null && typeof value === "object" && typeof value.ngOnDestroy === "function";
}
function couldBeInjectableType(value) {
  return typeof value === "function" || typeof value === "object" && value instanceof InjectionToken;
}
function INJECTOR_IMPL__PRE_R3__(providers, parent, name) {
  return new StaticInjector(providers, parent, name);
}
function INJECTOR_IMPL__POST_R3__(providers, parent, name) {
  return createInjector({
    name: name
  }, parent, providers, name);
}
exports.ɵINJECTOR_IMPL__POST_R3__ = INJECTOR_IMPL__POST_R3__;
var INJECTOR_IMPL = INJECTOR_IMPL__PRE_R3__;
var Injector = (function () {
  function Injector() {}
  exports.Injector = Injector;
  Injector.create = function (options, parent) {
    if (Array.isArray(options)) {
      return INJECTOR_IMPL(options, parent, "");
    } else {
      return INJECTOR_IMPL(options.providers, options.parent, options.name || "");
    }
  };
  Injector.THROW_IF_NOT_FOUND = THROW_IF_NOT_FOUND;
  Injector.NULL = new NullInjector();
  Injector.ngInjectableDef = ɵɵdefineInjectable({
    token: Injector,
    providedIn: "any",
    factory: function () {
      return ɵɵinject(INJECTOR);
    }
  });
  Injector.__NG_ELEMENT_ID__ = -1;
  return Injector;
})();
exports.Injector = Injector;
var IDENT = function (value) {
  return value;
};
var ɵ0$a = IDENT;
var EMPTY = [];
var CIRCULAR$1 = IDENT;
var MULTI_PROVIDER_FN = function () {
  return Array.prototype.slice.call(arguments);
};
var ɵ1$2 = MULTI_PROVIDER_FN;
var NO_NEW_LINE$1 = "ɵ";
var StaticInjector = (function () {
  function StaticInjector(providers, parent, source) {
    if (parent === void 0) {
      parent = Injector.NULL;
    }
    if (source === void 0) {
      source = null;
    }
    this.parent = parent;
    this.source = source;
    var records = this._records = new Map();
    records.set(Injector, {
      token: Injector,
      fn: IDENT,
      deps: EMPTY,
      value: this,
      useNew: false
    });
    records.set(INJECTOR, {
      token: INJECTOR,
      fn: IDENT,
      deps: EMPTY,
      value: this,
      useNew: false
    });
    recursivelyProcessProviders(records, providers);
  }
  StaticInjector.prototype.get = function (token, notFoundValue, flags) {
    if (flags === void 0) {
      flags = InjectFlags.Default;
    }
    var record = this._records.get(token);
    try {
      return tryResolveToken(token, record, this._records, this.parent, notFoundValue, flags);
    } catch (e) {
      return catchInjectorError(e, token, "StaticInjectorError", this.source);
    }
  };
  StaticInjector.prototype.toString = function () {
    var tokens = [], records = this._records;
    records.forEach(function (v, token) {
      return tokens.push(stringify(token));
    });
    return "StaticInjector[" + tokens.join(", ") + "]";
  };
  return StaticInjector;
})();
function resolveProvider(provider) {
  var deps = computeDeps(provider);
  var fn = IDENT;
  var value = EMPTY;
  var useNew = false;
  var provide = resolveForwardRef(provider.provide);
  if ((USE_VALUE in provider)) {
    value = provider.useValue;
  } else if (provider.useFactory) {
    fn = provider.useFactory;
  } else if (provider.useExisting) {} else if (provider.useClass) {
    useNew = true;
    fn = resolveForwardRef(provider.useClass);
  } else if (typeof provide == "function") {
    useNew = true;
    fn = provide;
  } else {
    throw staticError("StaticProvider does not have [useValue|useFactory|useExisting|useClass] or [provide] is not newable", provider);
  }
  return {
    deps: deps,
    fn: fn,
    useNew: useNew,
    value: value
  };
}
function multiProviderMixError(token) {
  return staticError("Cannot mix multi providers and regular providers", token);
}
function recursivelyProcessProviders(records, provider) {
  if (provider) {
    provider = resolveForwardRef(provider);
    if (provider instanceof Array) {
      for (var i = 0; i < provider.length; i++) {
        recursivelyProcessProviders(records, provider[i]);
      }
    } else if (typeof provider === "function") {
      throw staticError("Function/Class not supported", provider);
    } else if (provider && typeof provider === "object" && provider.provide) {
      var token = resolveForwardRef(provider.provide);
      var resolvedProvider = resolveProvider(provider);
      if (provider.multi === true) {
        var multiProvider = records.get(token);
        if (multiProvider) {
          if (multiProvider.fn !== MULTI_PROVIDER_FN) {
            throw multiProviderMixError(token);
          }
        } else {
          records.set(token, multiProvider = {
            token: provider.provide,
            deps: [],
            useNew: false,
            fn: MULTI_PROVIDER_FN,
            value: EMPTY
          });
        }
        token = provider;
        multiProvider.deps.push({
          token: token,
          options: 6
        });
      }
      var record = records.get(token);
      if (record && record.fn == MULTI_PROVIDER_FN) {
        throw multiProviderMixError(token);
      }
      records.set(token, resolvedProvider);
    } else {
      throw staticError("Unexpected provider", provider);
    }
  }
}
function tryResolveToken(token, record, records, parent, notFoundValue, flags) {
  try {
    return resolveToken(token, record, records, parent, notFoundValue, flags);
  } catch (e) {
    if (!(e instanceof Error)) {
      e = new Error(e);
    }
    var path = e[NG_TEMP_TOKEN_PATH] = e[NG_TEMP_TOKEN_PATH] || [];
    path.unshift(token);
    if (record && record.value == CIRCULAR$1) {
      record.value = EMPTY;
    }
    throw e;
  }
}
function resolveToken(token, record, records, parent, notFoundValue, flags) {
  var _a;
  var value;
  if (record && !(flags & InjectFlags.SkipSelf)) {
    value = record.value;
    if (value == CIRCULAR$1) {
      throw Error(NO_NEW_LINE$1 + "Circular dependency");
    } else if (value === EMPTY) {
      record.value = CIRCULAR$1;
      var obj = undefined;
      var useNew = record.useNew;
      var fn = record.fn;
      var depRecords = record.deps;
      var deps = EMPTY;
      if (depRecords.length) {
        deps = [];
        for (var i = 0; i < depRecords.length; i++) {
          var depRecord = depRecords[i];
          var options = depRecord.options;
          var childRecord = options & 2 ? records.get(depRecord.token) : undefined;
          deps.push(tryResolveToken(depRecord.token, childRecord, records, !childRecord && !(options & 4) ? Injector.NULL : parent, options & 1 ? null : Injector.THROW_IF_NOT_FOUND, InjectFlags.Default));
        }
      }
      record.value = value = useNew ? new ((_a = fn).bind.apply(_a, tslib_1.__spread([void 0], deps)))() : fn.apply(obj, deps);
    }
  } else if (!(flags & InjectFlags.Self)) {
    value = parent.get(token, notFoundValue, InjectFlags.Default);
  }
  return value;
}
function computeDeps(provider) {
  var deps = EMPTY;
  var providerDeps = provider.deps;
  if (providerDeps && providerDeps.length) {
    deps = [];
    for (var i = 0; i < providerDeps.length; i++) {
      var options = 6;
      var token = resolveForwardRef(providerDeps[i]);
      if (token instanceof Array) {
        for (var j = 0, annotations = token; j < annotations.length; j++) {
          var annotation = annotations[j];
          if (annotation instanceof Optional || annotation == Optional) {
            options = options | 1;
          } else if (annotation instanceof SkipSelf || annotation == SkipSelf) {
            options = options & ~2;
          } else if (annotation instanceof Self || annotation == Self) {
            options = options & ~4;
          } else if (annotation instanceof Inject) {
            token = annotation.token;
          } else {
            token = resolveForwardRef(annotation);
          }
        }
      }
      deps.push({
        token: token,
        options: options
      });
    }
  } else if (provider.useExisting) {
    var token = resolveForwardRef(provider.useExisting);
    deps = [{
      token: token,
      options: 6
    }];
  } else if (!providerDeps && !((USE_VALUE in provider))) {
    throw staticError("'deps' required", provider);
  }
  return deps;
}
function staticError(text, obj) {
  return new Error(formatError(text, obj, "StaticInjectorError"));
}
function findFirstClosedCycle(keys) {
  var res = [];
  for (var i = 0; i < keys.length; ++i) {
    if (res.indexOf(keys[i]) > -1) {
      res.push(keys[i]);
      return res;
    }
    res.push(keys[i]);
  }
  return res;
}
function constructResolvingPath(keys) {
  if (keys.length > 1) {
    var reversed = findFirstClosedCycle(keys.slice().reverse());
    var tokenStrs = reversed.map(function (k) {
      return stringify(k.token);
    });
    return " (" + tokenStrs.join(" -> ") + ")";
  }
  return "";
}
function injectionError(injector, key, constructResolvingMessage, originalError) {
  var keys = [key];
  var errMsg = constructResolvingMessage(keys);
  var error = originalError ? wrappedError(errMsg, originalError) : Error(errMsg);
  error.addKey = addKey;
  error.keys = keys;
  error.injectors = [injector];
  error.constructResolvingMessage = constructResolvingMessage;
  error[ERROR_ORIGINAL_ERROR] = originalError;
  return error;
}
function addKey(injector, key) {
  this.injectors.push(injector);
  this.keys.push(key);
  this.message = this.constructResolvingMessage(this.keys);
}
function noProviderError(injector, key) {
  return injectionError(injector, key, function (keys) {
    var first = stringify(keys[0].token);
    return "No provider for " + first + "!" + constructResolvingPath(keys);
  });
}
function cyclicDependencyError(injector, key) {
  return injectionError(injector, key, function (keys) {
    return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
  });
}
function instantiationError(injector, originalException, originalStack, key) {
  return injectionError(injector, key, function (keys) {
    var first = stringify(keys[0].token);
    return originalException.message + ": Error during instantiation of " + first + "!" + constructResolvingPath(keys) + ".";
  }, originalException);
}
function invalidProviderError(provider) {
  return Error("Invalid provider - only instances of Provider and Type are allowed, got: " + provider);
}
function noAnnotationError(typeOrFunc, params) {
  var signature = [];
  for (var i = 0, ii = params.length; i < ii; i++) {
    var parameter = params[i];
    if (!parameter || parameter.length == 0) {
      signature.push("?");
    } else {
      signature.push(parameter.map(stringify).join(" "));
    }
  }
  return Error("Cannot resolve all parameters for '" + stringify(typeOrFunc) + "'(" + signature.join(", ") + "). " + "Make sure that all the parameters are decorated with Inject or have valid type annotations and that '" + stringify(typeOrFunc) + "' is decorated with Injectable.");
}
function outOfBoundsError(index) {
  return Error("Index " + index + " is out-of-bounds.");
}
function mixingMultiProvidersWithRegularProvidersError(provider1, provider2) {
  return Error("Cannot mix multi providers and regular providers, got: " + provider1 + " " + provider2);
}
var ReflectiveKey = (function () {
  function ReflectiveKey(token, id) {
    this.token = token;
    this.id = id;
    if (!token) {
      throw new Error("Token must be defined!");
    }
    this.displayName = stringify(this.token);
  }
  exports.ReflectiveKey = ReflectiveKey;
  ReflectiveKey.get = function (token) {
    return _globalKeyRegistry.get(resolveForwardRef(token));
  };
  Object.defineProperty(ReflectiveKey, "numberOfKeys", {
    get: function () {
      return _globalKeyRegistry.numberOfKeys;
    },
    enumerable: true,
    configurable: true
  });
  return ReflectiveKey;
})();
exports.ReflectiveKey = ReflectiveKey;
var KeyRegistry = (function () {
  function KeyRegistry() {
    this._allKeys = new Map();
  }
  KeyRegistry.prototype.get = function (token) {
    if (token instanceof ReflectiveKey) return token;
    if (this._allKeys.has(token)) {
      return this._allKeys.get(token);
    }
    var newKey = new ReflectiveKey(token, ReflectiveKey.numberOfKeys);
    this._allKeys.set(token, newKey);
    return newKey;
  };
  Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
    get: function () {
      return this._allKeys.size;
    },
    enumerable: true,
    configurable: true
  });
  return KeyRegistry;
})();
var _globalKeyRegistry = new KeyRegistry();
var Reflector = (function () {
  function Reflector(reflectionCapabilities) {
    this.reflectionCapabilities = reflectionCapabilities;
  }
  Reflector.prototype.updateCapabilities = function (caps) {
    this.reflectionCapabilities = caps;
  };
  Reflector.prototype.factory = function (type) {
    return this.reflectionCapabilities.factory(type);
  };
  Reflector.prototype.parameters = function (typeOrFunc) {
    return this.reflectionCapabilities.parameters(typeOrFunc);
  };
  Reflector.prototype.annotations = function (typeOrFunc) {
    return this.reflectionCapabilities.annotations(typeOrFunc);
  };
  Reflector.prototype.propMetadata = function (typeOrFunc) {
    return this.reflectionCapabilities.propMetadata(typeOrFunc);
  };
  Reflector.prototype.hasLifecycleHook = function (type, lcProperty) {
    return this.reflectionCapabilities.hasLifecycleHook(type, lcProperty);
  };
  Reflector.prototype.getter = function (name) {
    return this.reflectionCapabilities.getter(name);
  };
  Reflector.prototype.setter = function (name) {
    return this.reflectionCapabilities.setter(name);
  };
  Reflector.prototype.method = function (name) {
    return this.reflectionCapabilities.method(name);
  };
  Reflector.prototype.importUri = function (type) {
    return this.reflectionCapabilities.importUri(type);
  };
  Reflector.prototype.resourceUri = function (type) {
    return this.reflectionCapabilities.resourceUri(type);
  };
  Reflector.prototype.resolveIdentifier = function (name, moduleUrl, members, runtime) {
    return this.reflectionCapabilities.resolveIdentifier(name, moduleUrl, members, runtime);
  };
  Reflector.prototype.resolveEnum = function (identifier, name) {
    return this.reflectionCapabilities.resolveEnum(identifier, name);
  };
  return Reflector;
})();
var reflector = new Reflector(new ReflectionCapabilities());
var ReflectiveDependency = (function () {
  function ReflectiveDependency(key, optional, visibility) {
    this.key = key;
    this.optional = optional;
    this.visibility = visibility;
  }
  exports.ɵangular_packages_core_core_d = ReflectiveDependency;
  ReflectiveDependency.fromKey = function (key) {
    return new ReflectiveDependency(key, false, null);
  };
  return ReflectiveDependency;
})();
exports.ɵangular_packages_core_core_d = ReflectiveDependency;
var _EMPTY_LIST = [];
var ResolvedReflectiveProvider_ = (function () {
  function ResolvedReflectiveProvider_(key, resolvedFactories, multiProvider) {
    this.key = key;
    this.resolvedFactories = resolvedFactories;
    this.multiProvider = multiProvider;
    this.resolvedFactory = this.resolvedFactories[0];
  }
  return ResolvedReflectiveProvider_;
})();
var ResolvedReflectiveFactory = (function () {
  function ResolvedReflectiveFactory(factory, dependencies) {
    this.factory = factory;
    this.dependencies = dependencies;
  }
  exports.ResolvedReflectiveFactory = ResolvedReflectiveFactory;
  return ResolvedReflectiveFactory;
})();
exports.ResolvedReflectiveFactory = ResolvedReflectiveFactory;
function resolveReflectiveFactory(provider) {
  var factoryFn;
  var resolvedDeps;
  if (provider.useClass) {
    var useClass = resolveForwardRef(provider.useClass);
    factoryFn = reflector.factory(useClass);
    resolvedDeps = _dependenciesFor(useClass);
  } else if (provider.useExisting) {
    factoryFn = function (aliasInstance) {
      return aliasInstance;
    };
    resolvedDeps = [ReflectiveDependency.fromKey(ReflectiveKey.get(provider.useExisting))];
  } else if (provider.useFactory) {
    factoryFn = provider.useFactory;
    resolvedDeps = constructDependencies(provider.useFactory, provider.deps);
  } else {
    factoryFn = function () {
      return provider.useValue;
    };
    resolvedDeps = _EMPTY_LIST;
  }
  return new ResolvedReflectiveFactory(factoryFn, resolvedDeps);
}
function resolveReflectiveProvider(provider) {
  return new ResolvedReflectiveProvider_(ReflectiveKey.get(provider.provide), [resolveReflectiveFactory(provider)], provider.multi || false);
}
function resolveReflectiveProviders(providers) {
  var normalized = _normalizeProviders(providers, []);
  var resolved = normalized.map(resolveReflectiveProvider);
  var resolvedProviderMap = mergeResolvedReflectiveProviders(resolved, new Map());
  return Array.from(resolvedProviderMap.values());
}
exports.ɵangular_packages_core_core_e = resolveReflectiveProviders;
function mergeResolvedReflectiveProviders(providers, normalizedProvidersMap) {
  for (var i = 0; i < providers.length; i++) {
    var provider = providers[i];
    var existing = normalizedProvidersMap.get(provider.key.id);
    if (existing) {
      if (provider.multiProvider !== existing.multiProvider) {
        throw mixingMultiProvidersWithRegularProvidersError(existing, provider);
      }
      if (provider.multiProvider) {
        for (var j = 0; j < provider.resolvedFactories.length; j++) {
          existing.resolvedFactories.push(provider.resolvedFactories[j]);
        }
      } else {
        normalizedProvidersMap.set(provider.key.id, provider);
      }
    } else {
      var resolvedProvider = void 0;
      if (provider.multiProvider) {
        resolvedProvider = new ResolvedReflectiveProvider_(provider.key, provider.resolvedFactories.slice(), provider.multiProvider);
      } else {
        resolvedProvider = provider;
      }
      normalizedProvidersMap.set(provider.key.id, resolvedProvider);
    }
  }
  return normalizedProvidersMap;
}
function _normalizeProviders(providers, res) {
  providers.forEach(function (b) {
    if (b instanceof Type) {
      res.push({
        provide: b,
        useClass: b
      });
    } else if (b && typeof b == "object" && b.provide !== undefined) {
      res.push(b);
    } else if (b instanceof Array) {
      _normalizeProviders(b, res);
    } else {
      throw invalidProviderError(b);
    }
  });
  return res;
}
function constructDependencies(typeOrFunc, dependencies) {
  if (!dependencies) {
    return _dependenciesFor(typeOrFunc);
  } else {
    var params_1 = dependencies.map(function (t) {
      return [t];
    });
    return dependencies.map(function (t) {
      return _extractToken(typeOrFunc, t, params_1);
    });
  }
}
function _dependenciesFor(typeOrFunc) {
  var params = reflector.parameters(typeOrFunc);
  if (!params) return [];
  if (params.some(function (p) {
    return p == null;
  })) {
    throw noAnnotationError(typeOrFunc, params);
  }
  return params.map(function (p) {
    return _extractToken(typeOrFunc, p, params);
  });
}
function _extractToken(typeOrFunc, metadata, params) {
  var token = null;
  var optional = false;
  if (!Array.isArray(metadata)) {
    if (metadata instanceof Inject) {
      return _createDependency(metadata.token, optional, null);
    } else {
      return _createDependency(metadata, optional, null);
    }
  }
  var visibility = null;
  for (var i = 0; i < metadata.length; ++i) {
    var paramMetadata = metadata[i];
    if (paramMetadata instanceof Type) {
      token = paramMetadata;
    } else if (paramMetadata instanceof Inject) {
      token = paramMetadata.token;
    } else if (paramMetadata instanceof Optional) {
      optional = true;
    } else if (paramMetadata instanceof Self || paramMetadata instanceof SkipSelf) {
      visibility = paramMetadata;
    } else if (paramMetadata instanceof InjectionToken) {
      token = paramMetadata;
    }
  }
  token = resolveForwardRef(token);
  if (token != null) {
    return _createDependency(token, optional, visibility);
  } else {
    throw noAnnotationError(typeOrFunc, params);
  }
}
function _createDependency(token, optional, visibility) {
  return new ReflectiveDependency(ReflectiveKey.get(token), optional, visibility);
}
var UNDEFINED = new Object();
var ReflectiveInjector = (function () {
  function ReflectiveInjector() {}
  exports.ReflectiveInjector = ReflectiveInjector;
  ReflectiveInjector.resolve = function (providers) {
    return resolveReflectiveProviders(providers);
  };
  ReflectiveInjector.resolveAndCreate = function (providers, parent) {
    var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
    return ReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
  };
  ReflectiveInjector.fromResolvedProviders = function (providers, parent) {
    return new ReflectiveInjector_(providers, parent);
  };
  return ReflectiveInjector;
})();
exports.ReflectiveInjector = ReflectiveInjector;
var ReflectiveInjector_ = (function () {
  function ReflectiveInjector_(_providers, _parent) {
    this._constructionCounter = 0;
    this._providers = _providers;
    this.parent = _parent || null;
    var len = _providers.length;
    this.keyIds = new Array(len);
    this.objs = new Array(len);
    for (var i = 0; i < len; i++) {
      this.keyIds[i] = _providers[i].key.id;
      this.objs[i] = UNDEFINED;
    }
  }
  exports.ɵangular_packages_core_core_c = ReflectiveInjector_;
  ReflectiveInjector_.prototype.get = function (token, notFoundValue) {
    if (notFoundValue === void 0) {
      notFoundValue = THROW_IF_NOT_FOUND;
    }
    return this._getByKey(ReflectiveKey.get(token), null, notFoundValue);
  };
  ReflectiveInjector_.prototype.resolveAndCreateChild = function (providers) {
    var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
    return this.createChildFromResolved(ResolvedReflectiveProviders);
  };
  ReflectiveInjector_.prototype.createChildFromResolved = function (providers) {
    var inj = new ReflectiveInjector_(providers);
    inj.parent = this;
    return inj;
  };
  ReflectiveInjector_.prototype.resolveAndInstantiate = function (provider) {
    return this.instantiateResolved(ReflectiveInjector.resolve([provider])[0]);
  };
  ReflectiveInjector_.prototype.instantiateResolved = function (provider) {
    return this._instantiateProvider(provider);
  };
  ReflectiveInjector_.prototype.getProviderAtIndex = function (index) {
    if (index < 0 || index >= this._providers.length) {
      throw outOfBoundsError(index);
    }
    return this._providers[index];
  };
  ReflectiveInjector_.prototype._new = function (provider) {
    if (this._constructionCounter++ > this._getMaxNumberOfObjects()) {
      throw cyclicDependencyError(this, provider.key);
    }
    return this._instantiateProvider(provider);
  };
  ReflectiveInjector_.prototype._getMaxNumberOfObjects = function () {
    return this.objs.length;
  };
  ReflectiveInjector_.prototype._instantiateProvider = function (provider) {
    if (provider.multiProvider) {
      var res = new Array(provider.resolvedFactories.length);
      for (var i = 0; i < provider.resolvedFactories.length; ++i) {
        res[i] = this._instantiate(provider, provider.resolvedFactories[i]);
      }
      return res;
    } else {
      return this._instantiate(provider, provider.resolvedFactories[0]);
    }
  };
  ReflectiveInjector_.prototype._instantiate = function (provider, ResolvedReflectiveFactory) {
    var _this = this;
    var factory = ResolvedReflectiveFactory.factory;
    var deps;
    try {
      deps = ResolvedReflectiveFactory.dependencies.map(function (dep) {
        return _this._getByReflectiveDependency(dep);
      });
    } catch (e) {
      if (e.addKey) {
        e.addKey(this, provider.key);
      }
      throw e;
    }
    var obj;
    try {
      obj = factory.apply(void 0, tslib_1.__spread(deps));
    } catch (e) {
      throw instantiationError(this, e, e.stack, provider.key);
    }
    return obj;
  };
  ReflectiveInjector_.prototype._getByReflectiveDependency = function (dep) {
    return this._getByKey(dep.key, dep.visibility, dep.optional ? null : THROW_IF_NOT_FOUND);
  };
  ReflectiveInjector_.prototype._getByKey = function (key, visibility, notFoundValue) {
    if (key === ReflectiveInjector_.INJECTOR_KEY) {
      return this;
    }
    if (visibility instanceof Self) {
      return this._getByKeySelf(key, notFoundValue);
    } else {
      return this._getByKeyDefault(key, notFoundValue, visibility);
    }
  };
  ReflectiveInjector_.prototype._getObjByKeyId = function (keyId) {
    for (var i = 0; i < this.keyIds.length; i++) {
      if (this.keyIds[i] === keyId) {
        if (this.objs[i] === UNDEFINED) {
          this.objs[i] = this._new(this._providers[i]);
        }
        return this.objs[i];
      }
    }
    return UNDEFINED;
  };
  ReflectiveInjector_.prototype._throwOrNull = function (key, notFoundValue) {
    if (notFoundValue !== THROW_IF_NOT_FOUND) {
      return notFoundValue;
    } else {
      throw noProviderError(this, key);
    }
  };
  ReflectiveInjector_.prototype._getByKeySelf = function (key, notFoundValue) {
    var obj = this._getObjByKeyId(key.id);
    return obj !== UNDEFINED ? obj : this._throwOrNull(key, notFoundValue);
  };
  ReflectiveInjector_.prototype._getByKeyDefault = function (key, notFoundValue, visibility) {
    var inj;
    if (visibility instanceof SkipSelf) {
      inj = this.parent;
    } else {
      inj = this;
    }
    while (inj instanceof ReflectiveInjector_) {
      var inj_ = inj;
      var obj = inj_._getObjByKeyId(key.id);
      if (obj !== UNDEFINED) return obj;
      inj = inj_.parent;
    }
    if (inj !== null) {
      return inj.get(key.token, notFoundValue);
    } else {
      return this._throwOrNull(key, notFoundValue);
    }
  };
  Object.defineProperty(ReflectiveInjector_.prototype, "displayName", {
    get: function () {
      var providers = _mapProviders(this, function (b) {
        return " \"" + b.key.displayName + "\" ";
      }).join(", ");
      return "ReflectiveInjector(providers: [" + providers + "])";
    },
    enumerable: true,
    configurable: true
  });
  ReflectiveInjector_.prototype.toString = function () {
    return this.displayName;
  };
  ReflectiveInjector_.INJECTOR_KEY = ReflectiveKey.get(Injector);
  return ReflectiveInjector_;
})();
exports.ɵangular_packages_core_core_c = ReflectiveInjector_;
function _mapProviders(injector, fn) {
  var res = new Array(injector._providers.length);
  for (var i = 0; i < injector._providers.length; ++i) {
    res[i] = fn(injector.getProviderAtIndex(i));
  }
  return res;
}
var ANALYZE_FOR_ENTRY_COMPONENTS = new InjectionToken("AnalyzeForEntryComponents");
exports.ANALYZE_FOR_ENTRY_COMPONENTS = ANALYZE_FOR_ENTRY_COMPONENTS;
var Query = (function () {
  function Query() {}
  exports.Query = Query;
  return Query;
})();
exports.Query = Query;
var ɵ0$b = function (selector, data) {
  if (data === void 0) {
    data = {};
  }
  return tslib_1.__assign({
    selector: selector,
    first: false,
    isViewQuery: false,
    descendants: false
  }, data);
};
var ContentChildren = makePropDecorator("ContentChildren", ɵ0$b, Query);
exports.ContentChildren = ContentChildren;
var ɵ1$3 = function (selector, data) {
  if (data === void 0) {
    data = {};
  }
  return tslib_1.__assign({
    selector: selector,
    first: true,
    isViewQuery: false,
    descendants: true
  }, data);
};
var ContentChild = makePropDecorator("ContentChild", ɵ1$3, Query);
exports.ContentChild = ContentChild;
var ɵ2 = function (selector, data) {
  if (data === void 0) {
    data = {};
  }
  return tslib_1.__assign({
    selector: selector,
    first: false,
    isViewQuery: true,
    descendants: true
  }, data);
};
var ViewChildren = makePropDecorator("ViewChildren", ɵ2, Query);
exports.ViewChildren = ViewChildren;
var ɵ3 = function (selector, data) {
  return tslib_1.__assign({
    selector: selector,
    first: true,
    isViewQuery: true,
    descendants: true
  }, data);
};
var ViewChild = makePropDecorator("ViewChild", ɵ3, Query);
exports.ViewChild = ViewChild;
function resolveComponentResources(resourceResolver) {
  var componentResolved = [];
  var urlMap = new Map();
  function cachedResourceResolve(url) {
    var promise = urlMap.get(url);
    if (!promise) {
      var resp = resourceResolver(url);
      urlMap.set(url, promise = resp.then(unwrapResponse));
    }
    return promise;
  }
  componentResourceResolutionQueue.forEach(function (component, type) {
    var promises = [];
    if (component.templateUrl) {
      promises.push(cachedResourceResolve(component.templateUrl).then(function (template) {
        component.template = template;
      }));
    }
    var styleUrls = component.styleUrls;
    var styles = component.styles || (component.styles = []);
    var styleOffset = component.styles.length;
    styleUrls && styleUrls.forEach(function (styleUrl, index) {
      styles.push("");
      promises.push(cachedResourceResolve(styleUrl).then(function (style) {
        styles[styleOffset + index] = style;
        styleUrls.splice(styleUrls.indexOf(styleUrl), 1);
        if (styleUrls.length == 0) {
          component.styleUrls = undefined;
        }
      }));
    });
    var fullyResolved = Promise.all(promises).then(function () {
      return componentDefResolved(type);
    });
    componentResolved.push(fullyResolved);
  });
  clearResolutionOfComponentResourcesQueue();
  return Promise.all(componentResolved).then(function () {
    return undefined;
  });
}
exports.ɵresolveComponentResources = resolveComponentResources;
var componentResourceResolutionQueue = new Map();
var componentDefPendingResolution = new Set();
function maybeQueueResolutionOfComponentResources(type, metadata) {
  if (componentNeedsResolution(metadata)) {
    componentResourceResolutionQueue.set(type, metadata);
    componentDefPendingResolution.add(type);
  }
}
function isComponentDefPendingResolution(type) {
  return componentDefPendingResolution.has(type);
}
function componentNeedsResolution(component) {
  return !!(component.templateUrl && !component.hasOwnProperty("template") || component.styleUrls && component.styleUrls.length);
}
function clearResolutionOfComponentResourcesQueue() {
  var old = componentResourceResolutionQueue;
  componentResourceResolutionQueue = new Map();
  return old;
}
exports.ɵclearResolutionOfComponentResourcesQueue = clearResolutionOfComponentResourcesQueue;
function restoreComponentResolutionQueue(queue) {
  componentDefPendingResolution.clear();
  queue.forEach(function (_, type) {
    return componentDefPendingResolution.add(type);
  });
  componentResourceResolutionQueue = queue;
}
function isComponentResourceResolutionQueueEmpty() {
  return componentResourceResolutionQueue.size === 0;
}
function unwrapResponse(response) {
  return typeof response == "string" ? response : response.text();
}
function componentDefResolved(type) {
  componentDefPendingResolution.delete(type);
}
function ɵɵallocHostVars(count) {
  var lView = getLView();
  var tView = lView[TVIEW];
  if (!tView.firstTemplatePass) return;
  queueHostBindingForCheck(tView, getCurrentDirectiveDef(), count);
  prefillHostVars(tView, lView, count);
}
exports.ɵɵallocHostVars = ɵɵallocHostVars;
function queueHostBindingForCheck(tView, def, hostVars) {
  ngDevMode && assertEqual(tView.firstTemplatePass, true, "Should only be called in first template pass.");
  var expando = tView.expandoInstructions;
  var length = expando.length;
  if (length >= 2 && expando[length - 2] === def.hostBindings) {
    expando[length - 1] = expando[length - 1] + hostVars;
  } else {
    expando.push(def.hostBindings, hostVars);
  }
}
function prefillHostVars(tView, lView, totalHostVars) {
  ngDevMode && assertEqual(tView.firstTemplatePass, true, "Should only be called in first template pass.");
  for (var i = 0; i < totalHostVars; i++) {
    lView.push(NO_CHANGE);
    tView.blueprint.push(NO_CHANGE);
    tView.data.push(null);
  }
}
var _symbolIterator = null;
function getSymbolIterator() {
  if (!_symbolIterator) {
    var Symbol_1 = _global["Symbol"];
    if (Symbol_1 && Symbol_1.iterator) {
      _symbolIterator = Symbol_1.iterator;
    } else {
      var keys = Object.getOwnPropertyNames(Map.prototype);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (key !== "entries" && key !== "size" && Map.prototype[key] === Map.prototype["entries"]) {
          _symbolIterator = key;
        }
      }
    }
  }
  return _symbolIterator;
}
function isListLikeIterable(obj) {
  if (!isJsObject(obj)) return false;
  return Array.isArray(obj) || !(obj instanceof Map) && (getSymbolIterator() in obj);
}
function areIterablesEqual(a, b, comparator) {
  var iterator1 = a[getSymbolIterator()]();
  var iterator2 = b[getSymbolIterator()]();
  while (true) {
    var item1 = iterator1.next();
    var item2 = iterator2.next();
    if (item1.done && item2.done) return true;
    if (item1.done || item2.done) return false;
    if (!comparator(item1.value, item2.value)) return false;
  }
}
function iterateListLike(obj, fn) {
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      fn(obj[i]);
    }
  } else {
    var iterator = obj[getSymbolIterator()]();
    var item = void 0;
    while (!(item = iterator.next()).done) {
      fn(item.value);
    }
  }
}
function isJsObject(o) {
  return o !== null && (typeof o === "function" || typeof o === "object");
}
function looseIdentical(a, b) {
  return a === b || typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b);
}
exports.ɵlooseIdentical = looseIdentical;
function devModeEqual(a, b) {
  var isListLikeIterableA = isListLikeIterable(a);
  var isListLikeIterableB = isListLikeIterable(b);
  if (isListLikeIterableA && isListLikeIterableB) {
    return areIterablesEqual(a, b, devModeEqual);
  } else {
    var isAObject = a && (typeof a === "object" || typeof a === "function");
    var isBObject = b && (typeof b === "object" || typeof b === "function");
    if (!isListLikeIterableA && isAObject && !isListLikeIterableB && isBObject) {
      return true;
    } else {
      return looseIdentical(a, b);
    }
  }
}
function devModeEqual$1(a, b) {
  var isListLikeIterableA = isListLikeIterable$1(a);
  var isListLikeIterableB = isListLikeIterable$1(b);
  if (isListLikeIterableA && isListLikeIterableB) {
    return areIterablesEqual$1(a, b, devModeEqual$1);
  } else {
    var isAObject = a && (typeof a === "object" || typeof a === "function");
    var isBObject = b && (typeof b === "object" || typeof b === "function");
    if (!isListLikeIterableA && isAObject && !isListLikeIterableB && isBObject) {
      return true;
    } else {
      return looseIdentical(a, b);
    }
  }
}
exports.ɵdevModeEqual = devModeEqual$1;
var WrappedValue = (function () {
  function WrappedValue(value) {
    this.wrapped = value;
  }
  exports.WrappedValue = WrappedValue;
  WrappedValue.wrap = function (value) {
    return new WrappedValue(value);
  };
  WrappedValue.unwrap = function (value) {
    return WrappedValue.isWrapped(value) ? value.wrapped : value;
  };
  WrappedValue.isWrapped = function (value) {
    return value instanceof WrappedValue;
  };
  return WrappedValue;
})();
exports.WrappedValue = WrappedValue;
function isListLikeIterable$1(obj) {
  if (!isJsObject$1(obj)) return false;
  return Array.isArray(obj) || !(obj instanceof Map) && (getSymbolIterator() in obj);
}
exports.ɵisListLikeIterable = isListLikeIterable$1;
function areIterablesEqual$1(a, b, comparator) {
  var iterator1 = a[getSymbolIterator()]();
  var iterator2 = b[getSymbolIterator()]();
  while (true) {
    var item1 = iterator1.next();
    var item2 = iterator2.next();
    if (item1.done && item2.done) return true;
    if (item1.done || item2.done) return false;
    if (!comparator(item1.value, item2.value)) return false;
  }
}
function iterateListLike$1(obj, fn) {
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      fn(obj[i]);
    }
  } else {
    var iterator = obj[getSymbolIterator()]();
    var item = void 0;
    while (!(item = iterator.next()).done) {
      fn(item.value);
    }
  }
}
function isJsObject$1(o) {
  return o !== null && (typeof o === "function" || typeof o === "object");
}
function updateBinding(lView, bindingIndex, value) {
  return lView[bindingIndex] = value;
}
function getBinding(lView, bindingIndex) {
  ngDevMode && assertDataInRange(lView, bindingIndex);
  ngDevMode && assertNotSame(lView[bindingIndex], NO_CHANGE, "Stored value should never be NO_CHANGE.");
  return lView[bindingIndex];
}
function bindingUpdated(lView, bindingIndex, value) {
  ngDevMode && assertNotSame(value, NO_CHANGE, "Incoming value should never be NO_CHANGE.");
  ngDevMode && assertLessThan(bindingIndex, lView.length, "Slot should have been initialized to NO_CHANGE");
  var oldValue = lView[bindingIndex];
  if (isDifferent(oldValue, value)) {
    if (ngDevMode && getCheckNoChangesMode()) {
      var oldValueToCompare = oldValue !== NO_CHANGE ? oldValue : undefined;
      if (!devModeEqual$1(oldValueToCompare, value)) {
        throwErrorIfNoChangesMode(oldValue === NO_CHANGE, oldValueToCompare, value);
      }
    }
    lView[bindingIndex] = value;
    return true;
  }
  return false;
}
function bindingUpdated2(lView, bindingIndex, exp1, exp2) {
  var different = bindingUpdated(lView, bindingIndex, exp1);
  return bindingUpdated(lView, bindingIndex + 1, exp2) || different;
}
function bindingUpdated3(lView, bindingIndex, exp1, exp2, exp3) {
  var different = bindingUpdated2(lView, bindingIndex, exp1, exp2);
  return bindingUpdated(lView, bindingIndex + 2, exp3) || different;
}
function bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4) {
  var different = bindingUpdated2(lView, bindingIndex, exp1, exp2);
  return bindingUpdated2(lView, bindingIndex + 2, exp3, exp4) || different;
}
function ɵɵproperty(propName, value, sanitizer) {
  var index = getSelectedIndex();
  ngDevMode && assertNotEqual(index, -1, "selected index cannot be -1");
  var lView = getLView();
  var bindReconciledValue = bind(lView, value);
  if (bindReconciledValue !== NO_CHANGE) {
    elementPropertyInternal(index, propName, bindReconciledValue, sanitizer);
  }
  return ɵɵproperty;
}
exports.ɵɵproperty = ɵɵproperty;
function bind(lView, value) {
  var bindingIndex = lView[BINDING_INDEX]++;
  storeBindingMetadata(lView);
  return bindingUpdated(lView, bindingIndex, value) ? value : NO_CHANGE;
}
function ɵɵattribute(name, value, sanitizer, namespace) {
  var index = getSelectedIndex();
  var lView = getLView();
  var bound = bind(lView, value);
  if (bound !== NO_CHANGE) {
    elementAttributeInternal(index, name, bound, lView, sanitizer, namespace);
  }
  return ɵɵattribute;
}
exports.ɵɵattribute = ɵɵattribute;
function interpolationV(lView, values) {
  ngDevMode && assertLessThan(2, values.length, "should have at least 3 values");
  ngDevMode && assertEqual(values.length % 2, 1, "should have an odd number of values");
  var isBindingUpdated = false;
  var tData = lView[TVIEW].data;
  var bindingIndex = lView[BINDING_INDEX];
  if (tData[bindingIndex] == null) {
    for (var i = 2; i < values.length; i += 2) {
      tData[bindingIndex++] = values[i];
    }
    bindingIndex = lView[BINDING_INDEX];
  }
  for (var i = 1; i < values.length; i += 2) {
    isBindingUpdated = bindingUpdated(lView, bindingIndex++, values[i]) || isBindingUpdated;
  }
  lView[BINDING_INDEX] = bindingIndex;
  storeBindingMetadata(lView, values[0], values[values.length - 1]);
  if (!isBindingUpdated) {
    return NO_CHANGE;
  }
  var content = values[0];
  for (var i = 1; i < values.length; i += 2) {
    content += renderStringify(values[i]) + values[i + 1];
  }
  return content;
}
function interpolation1(lView, prefix, v0, suffix) {
  var different = bindingUpdated(lView, lView[BINDING_INDEX]++, v0);
  storeBindingMetadata(lView, prefix, suffix);
  return different ? prefix + renderStringify(v0) + suffix : NO_CHANGE;
}
function interpolation2(lView, prefix, v0, i0, v1, suffix) {
  var bindingIndex = lView[BINDING_INDEX];
  var different = bindingUpdated2(lView, bindingIndex, v0, v1);
  lView[BINDING_INDEX] += 2;
  var data = storeBindingMetadata(lView, prefix, suffix);
  if (data) {
    lView[TVIEW].data[bindingIndex] = i0;
  }
  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + suffix : NO_CHANGE;
}
function interpolation3(lView, prefix, v0, i0, v1, i1, v2, suffix) {
  var bindingIndex = lView[BINDING_INDEX];
  var different = bindingUpdated3(lView, bindingIndex, v0, v1, v2);
  lView[BINDING_INDEX] += 3;
  var data = storeBindingMetadata(lView, prefix, suffix);
  if (data) {
    var tData = lView[TVIEW].data;
    tData[bindingIndex] = i0;
    tData[bindingIndex + 1] = i1;
  }
  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 + renderStringify(v2) + suffix : NO_CHANGE;
}
function interpolation4(lView, prefix, v0, i0, v1, i1, v2, i2, v3, suffix) {
  var bindingIndex = lView[BINDING_INDEX];
  var different = bindingUpdated4(lView, bindingIndex, v0, v1, v2, v3);
  lView[BINDING_INDEX] += 4;
  var data = storeBindingMetadata(lView, prefix, suffix);
  if (data) {
    var tData = lView[TVIEW].data;
    tData[bindingIndex] = i0;
    tData[bindingIndex + 1] = i1;
    tData[bindingIndex + 2] = i2;
  }
  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 + renderStringify(v2) + i2 + renderStringify(v3) + suffix : NO_CHANGE;
}
function interpolation5(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix) {
  var bindingIndex = lView[BINDING_INDEX];
  var different = bindingUpdated4(lView, bindingIndex, v0, v1, v2, v3);
  different = bindingUpdated(lView, bindingIndex + 4, v4) || different;
  lView[BINDING_INDEX] += 5;
  var data = storeBindingMetadata(lView, prefix, suffix);
  if (data) {
    var tData = lView[TVIEW].data;
    tData[bindingIndex] = i0;
    tData[bindingIndex + 1] = i1;
    tData[bindingIndex + 2] = i2;
    tData[bindingIndex + 3] = i3;
  }
  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 + renderStringify(v2) + i2 + renderStringify(v3) + i3 + renderStringify(v4) + suffix : NO_CHANGE;
}
function interpolation6(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix) {
  var bindingIndex = lView[BINDING_INDEX];
  var different = bindingUpdated4(lView, bindingIndex, v0, v1, v2, v3);
  different = bindingUpdated2(lView, bindingIndex + 4, v4, v5) || different;
  lView[BINDING_INDEX] += 6;
  var data = storeBindingMetadata(lView, prefix, suffix);
  if (data) {
    var tData = lView[TVIEW].data;
    tData[bindingIndex] = i0;
    tData[bindingIndex + 1] = i1;
    tData[bindingIndex + 2] = i2;
    tData[bindingIndex + 3] = i3;
    tData[bindingIndex + 4] = i4;
  }
  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 + renderStringify(v2) + i2 + renderStringify(v3) + i3 + renderStringify(v4) + i4 + renderStringify(v5) + suffix : NO_CHANGE;
}
function interpolation7(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix) {
  var bindingIndex = lView[BINDING_INDEX];
  var different = bindingUpdated4(lView, bindingIndex, v0, v1, v2, v3);
  different = bindingUpdated3(lView, bindingIndex + 4, v4, v5, v6) || different;
  lView[BINDING_INDEX] += 7;
  var data = storeBindingMetadata(lView, prefix, suffix);
  if (data) {
    var tData = lView[TVIEW].data;
    tData[bindingIndex] = i0;
    tData[bindingIndex + 1] = i1;
    tData[bindingIndex + 2] = i2;
    tData[bindingIndex + 3] = i3;
    tData[bindingIndex + 4] = i4;
    tData[bindingIndex + 5] = i5;
  }
  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 + renderStringify(v2) + i2 + renderStringify(v3) + i3 + renderStringify(v4) + i4 + renderStringify(v5) + i5 + renderStringify(v6) + suffix : NO_CHANGE;
}
function interpolation8(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix) {
  var bindingIndex = lView[BINDING_INDEX];
  var different = bindingUpdated4(lView, bindingIndex, v0, v1, v2, v3);
  different = bindingUpdated4(lView, bindingIndex + 4, v4, v5, v6, v7) || different;
  lView[BINDING_INDEX] += 8;
  var data = storeBindingMetadata(lView, prefix, suffix);
  if (data) {
    var tData = lView[TVIEW].data;
    tData[bindingIndex] = i0;
    tData[bindingIndex + 1] = i1;
    tData[bindingIndex + 2] = i2;
    tData[bindingIndex + 3] = i3;
    tData[bindingIndex + 4] = i4;
    tData[bindingIndex + 5] = i5;
    tData[bindingIndex + 6] = i6;
  }
  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 + renderStringify(v2) + i2 + renderStringify(v3) + i3 + renderStringify(v4) + i4 + renderStringify(v5) + i5 + renderStringify(v6) + i6 + renderStringify(v7) + suffix : NO_CHANGE;
}
function ɵɵattributeInterpolate1(attrName, prefix, v0, suffix, sanitizer, namespace) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolatedValue = interpolation1(lView, prefix, v0, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementAttributeInternal(index, attrName, interpolatedValue, lView, sanitizer, namespace);
  }
  return ɵɵattributeInterpolate1;
}
exports.ɵɵattributeInterpolate1 = ɵɵattributeInterpolate1;
function ɵɵattributeInterpolate2(attrName, prefix, v0, i0, v1, suffix, sanitizer, namespace) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolatedValue = interpolation2(lView, prefix, v0, i0, v1, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementAttributeInternal(index, attrName, interpolatedValue, lView, sanitizer, namespace);
  }
  return ɵɵattributeInterpolate2;
}
exports.ɵɵattributeInterpolate2 = ɵɵattributeInterpolate2;
function ɵɵattributeInterpolate3(attrName, prefix, v0, i0, v1, i1, v2, suffix, sanitizer, namespace) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolatedValue = interpolation3(lView, prefix, v0, i0, v1, i1, v2, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementAttributeInternal(index, attrName, interpolatedValue, lView, sanitizer, namespace);
  }
  return ɵɵattributeInterpolate3;
}
exports.ɵɵattributeInterpolate3 = ɵɵattributeInterpolate3;
function ɵɵattributeInterpolate4(attrName, prefix, v0, i0, v1, i1, v2, i2, v3, suffix, sanitizer, namespace) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolatedValue = interpolation4(lView, prefix, v0, i0, v1, i1, v2, i2, v3, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementAttributeInternal(index, attrName, interpolatedValue, lView, sanitizer, namespace);
  }
  return ɵɵattributeInterpolate4;
}
exports.ɵɵattributeInterpolate4 = ɵɵattributeInterpolate4;
function ɵɵattributeInterpolate5(attrName, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix, sanitizer, namespace) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolatedValue = interpolation5(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementAttributeInternal(index, attrName, interpolatedValue, lView, sanitizer, namespace);
  }
  return ɵɵattributeInterpolate5;
}
exports.ɵɵattributeInterpolate5 = ɵɵattributeInterpolate5;
function ɵɵattributeInterpolate6(attrName, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix, sanitizer, namespace) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolatedValue = interpolation6(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementAttributeInternal(index, attrName, interpolatedValue, lView, sanitizer, namespace);
  }
  return ɵɵattributeInterpolate6;
}
exports.ɵɵattributeInterpolate6 = ɵɵattributeInterpolate6;
function ɵɵattributeInterpolate7(attrName, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix, sanitizer, namespace) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolatedValue = interpolation7(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementAttributeInternal(index, attrName, interpolatedValue, lView, sanitizer, namespace);
  }
  return ɵɵattributeInterpolate7;
}
exports.ɵɵattributeInterpolate7 = ɵɵattributeInterpolate7;
function ɵɵattributeInterpolate8(attrName, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix, sanitizer, namespace) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolatedValue = interpolation8(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementAttributeInternal(index, attrName, interpolatedValue, lView, sanitizer, namespace);
  }
  return ɵɵattributeInterpolate8;
}
exports.ɵɵattributeInterpolate8 = ɵɵattributeInterpolate8;
function ɵɵattributeInterpolateV(attrName, values, sanitizer, namespace) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolated = interpolationV(lView, values);
  if (interpolated !== NO_CHANGE) {
    elementAttributeInternal(index, attrName, interpolated, lView, sanitizer, namespace);
  }
  return ɵɵattributeInterpolateV;
}
exports.ɵɵattributeInterpolateV = ɵɵattributeInterpolateV;
function detectChanges(component) {
  var view = getComponentViewByInstance(component);
  detectChangesInternal(view, component);
}
exports.ɵdetectChanges = detectChanges;
function markDirty(component) {
  ngDevMode && assertDefined(component, "component");
  var rootView = markViewDirty(getComponentViewByInstance(component));
  ngDevMode && assertDefined(rootView[CONTEXT], "rootContext should be defined");
  scheduleTick(rootView[CONTEXT], 1);
}
exports.ɵmarkDirty = markDirty;
function tick(component) {
  var rootView = getRootView(component);
  var rootContext = rootView[CONTEXT];
  tickRootContext(rootContext);
}
function ɵɵcontainer(index) {
  var lView = getLView();
  var tNode = containerInternal(lView, index, null, null);
  if (lView[TVIEW].firstTemplatePass) {
    tNode.tViews = [];
  }
  setIsNotParent();
}
exports.ɵɵcontainer = ɵɵcontainer;
function ɵɵtemplate(index, templateFn, consts, vars, tagName, attrs, localRefs, localRefExtractor) {
  var lView = getLView();
  var tView = lView[TVIEW];
  var tContainerNode = containerInternal(lView, index, tagName || null, attrs || null);
  if (tView.firstTemplatePass) {
    ngDevMode && ngDevMode.firstTemplatePass++;
    resolveDirectives(tView, lView, tContainerNode, localRefs || null);
    var embeddedTView = tContainerNode.tViews = createTView(-1, templateFn, consts, vars, tView.directiveRegistry, tView.pipeRegistry, null, null);
    if (tView.queries !== null) {
      tView.queries.template(tView, tContainerNode);
      embeddedTView.queries = tView.queries.embeddedTView(tContainerNode);
    }
  }
  createDirectivesAndLocals(tView, lView, tContainerNode, localRefExtractor);
  attachPatchData(getNativeByTNode(tContainerNode, lView), lView);
  registerPostOrderHooks(tView, tContainerNode);
  setIsNotParent();
}
exports.ɵɵtemplate = ɵɵtemplate;
function ɵɵcontainerRefreshStart(index) {
  var lView = getLView();
  var tView = lView[TVIEW];
  var previousOrParentTNode = loadInternal(tView.data, index);
  ngDevMode && assertNodeType(previousOrParentTNode, 0);
  setPreviousOrParentTNode(previousOrParentTNode, true);
  lView[index + HEADER_OFFSET][ACTIVE_INDEX] = 0;
  executePreOrderHooks(lView, tView, getCheckNoChangesMode(), undefined);
}
exports.ɵɵcontainerRefreshStart = ɵɵcontainerRefreshStart;
function ɵɵcontainerRefreshEnd() {
  var previousOrParentTNode = getPreviousOrParentTNode();
  if (getIsParent()) {
    setIsNotParent();
  } else {
    ngDevMode && assertNodeType(previousOrParentTNode, 2);
    ngDevMode && assertHasParent(previousOrParentTNode);
    previousOrParentTNode = previousOrParentTNode.parent;
    setPreviousOrParentTNode(previousOrParentTNode, false);
  }
  ngDevMode && assertNodeType(previousOrParentTNode, 0);
  var lContainer = getLView()[previousOrParentTNode.index];
  var nextIndex = lContainer[ACTIVE_INDEX];
  while (nextIndex < lContainer.length - CONTAINER_HEADER_OFFSET) {
    removeView(lContainer, nextIndex);
  }
}
exports.ɵɵcontainerRefreshEnd = ɵɵcontainerRefreshEnd;
function containerInternal(lView, nodeIndex, tagName, attrs) {
  ngDevMode && assertEqual(lView[BINDING_INDEX], lView[TVIEW].bindingStartIndex, "container nodes should be created before any bindings");
  var adjustedIndex = nodeIndex + HEADER_OFFSET;
  ngDevMode && assertDataInRange(lView, nodeIndex + HEADER_OFFSET);
  ngDevMode && ngDevMode.rendererCreateComment++;
  var comment = lView[adjustedIndex] = lView[RENDERER].createComment(ngDevMode ? "container" : "");
  var tNode = getOrCreateTNode(lView[TVIEW], lView[T_HOST], nodeIndex, 0, tagName, attrs);
  var lContainer = lView[adjustedIndex] = createLContainer(comment, lView, comment, tNode);
  appendChild(comment, tNode, lView);
  addToViewTree(lView, lContainer);
  ngDevMode && assertNodeType(getPreviousOrParentTNode(), 0);
  return tNode;
}
function store(index, value) {
  var lView = getLView();
  var tView = lView[TVIEW];
  var adjustedIndex = index + HEADER_OFFSET;
  if (adjustedIndex >= tView.data.length) {
    tView.data[adjustedIndex] = null;
    tView.blueprint[adjustedIndex] = null;
  }
  lView[adjustedIndex] = value;
}
exports.ɵstore = store;
function ɵɵreference(index) {
  var contextLView = getContextLView();
  return loadInternal(contextLView, index);
}
exports.ɵɵreference = ɵɵreference;
function ɵɵload(index) {
  return loadInternal(getLView(), index);
}
exports.ɵɵload = ɵɵload;
function ɵɵdirectiveInject(token, flags) {
  if (flags === void 0) {
    flags = InjectFlags.Default;
  }
  token = resolveForwardRef(token);
  var lView = getLView();
  if (lView == null) return ɵɵinject(token, flags);
  return getOrCreateInjectable(getPreviousOrParentTNode(), lView, token, flags);
}
exports.ɵɵdirectiveInject = ɵɵdirectiveInject;
function ɵɵinjectAttribute(attrNameToInject) {
  return injectAttributeImpl(getPreviousOrParentTNode(), attrNameToInject);
}
exports.ɵɵinjectAttribute = ɵɵinjectAttribute;
function ɵɵstyling() {
  var tView = getLView()[TVIEW];
  if (tView.firstTemplatePass) {
    updateLastDirectiveIndex$1(getPreviousOrParentTNode(), getActiveDirectiveStylingIndex());
  }
}
exports.ɵɵstyling = ɵɵstyling;
function ɵɵstyleSanitizer(sanitizer) {
  setCurrentStyleSanitizer(sanitizer);
}
exports.ɵɵstyleSanitizer = ɵɵstyleSanitizer;
function ɵɵstyleProp(prop, value, suffix) {
  stylePropInternal(getSelectedIndex(), prop, value, suffix);
}
exports.ɵɵstyleProp = ɵɵstyleProp;
function stylePropInternal(elementIndex, prop, value, suffix) {
  var lView = getLView();
  var bindingIndex = lView[BINDING_INDEX]++;
  var updated = _stylingProp(elementIndex, bindingIndex, prop, resolveStylePropValue(value, suffix), false, deferStylingUpdate());
  if (ngDevMode) {
    ngDevMode.styleProp++;
    if (updated) {
      ngDevMode.stylePropCacheMiss++;
    }
  }
}
function ɵɵclassProp(className, value) {
  var lView = getLView();
  var bindingIndex = lView[BINDING_INDEX]++;
  var updated = _stylingProp(getSelectedIndex(), bindingIndex, className, value, true, deferStylingUpdate());
  if (ngDevMode) {
    ngDevMode.classProp++;
    if (updated) {
      ngDevMode.classPropCacheMiss++;
    }
  }
}
exports.ɵɵclassProp = ɵɵclassProp;
function _stylingProp(elementIndex, bindingIndex, prop, value, isClassBased, defer) {
  var lView = getLView();
  var tNode = getTNode(elementIndex, lView);
  var native = getNativeByTNode(tNode, lView);
  var updated = false;
  if (value !== NO_CHANGE) {
    if (isClassBased) {
      updated = updateClassBinding(getClassesContext(tNode), lView, native, prop, bindingIndex, value, defer, false);
    } else {
      var sanitizer = getCurrentStyleSanitizer();
      updated = updateStyleBinding(getStylesContext(tNode), lView, native, prop, bindingIndex, value, sanitizer, defer, false);
    }
  }
  return updated;
}
function ɵɵstyleMap(styles) {
  var index = getSelectedIndex();
  var lView = getLView();
  var tNode = getTNode(index, lView);
  var context = getStylesContext(tNode);
  var directiveIndex = getActiveDirectiveStylingIndex();
  var bindingIndex = lView[BINDING_INDEX]++;
  if (!directiveIndex && hasStyleInput(tNode) && styles !== NO_CHANGE) {
    updateDirectiveInputValue(context, lView, tNode, bindingIndex, styles, false);
    styles = NO_CHANGE;
  }
  var updated = _stylingMap(index, context, bindingIndex, styles, false, deferStylingUpdate());
  if (ngDevMode) {
    ngDevMode.styleMap++;
    if (updated) {
      ngDevMode.styleMapCacheMiss++;
    }
  }
}
exports.ɵɵstyleMap = ɵɵstyleMap;
function ɵɵclassMap(classes) {
  classMapInternal(getSelectedIndex(), classes);
}
exports.ɵɵclassMap = ɵɵclassMap;
function classMapInternal(elementIndex, classes) {
  var lView = getLView();
  var tNode = getTNode(elementIndex, lView);
  var context = getClassesContext(tNode);
  var directiveIndex = getActiveDirectiveStylingIndex();
  var bindingIndex = lView[BINDING_INDEX]++;
  if (!directiveIndex && hasClassInput(tNode) && classes !== NO_CHANGE) {
    updateDirectiveInputValue(context, lView, tNode, bindingIndex, classes, true);
    classes = NO_CHANGE;
  }
  var updated = _stylingMap(elementIndex, context, bindingIndex, classes, true, deferStylingUpdate());
  if (ngDevMode) {
    ngDevMode.classMap++;
    if (updated) {
      ngDevMode.classMapCacheMiss++;
    }
  }
}
function _stylingMap(elementIndex, context, bindingIndex, value, isClassBased, defer) {
  activateStylingMapFeature();
  var lView = getLView();
  var valueHasChanged = false;
  if (value !== NO_CHANGE) {
    var tNode = getTNode(elementIndex, lView);
    var native = getNativeByTNode(tNode, lView);
    var oldValue = lView[bindingIndex];
    valueHasChanged = hasValueChanged(oldValue, value);
    var stylingMapArr = normalizeIntoStylingMap(oldValue, value, !isClassBased);
    if (isClassBased) {
      updateClassBinding(context, lView, native, null, bindingIndex, stylingMapArr, defer, valueHasChanged);
    } else {
      var sanitizer = getCurrentStyleSanitizer();
      updateStyleBinding(context, lView, native, null, bindingIndex, stylingMapArr, sanitizer, defer, valueHasChanged);
    }
  }
  return valueHasChanged;
}
function updateDirectiveInputValue(context, lView, tNode, bindingIndex, newValue, isClassBased) {
  var oldValue = lView[bindingIndex];
  if (oldValue !== newValue) {
    if (newValue || isContextLocked(context)) {
      var inputs = tNode.inputs[isClassBased ? "class" : "style"];
      var initialValue = getInitialStylingValue(context);
      var value = normalizeStylingDirectiveInputValue(initialValue, newValue, isClassBased);
      setInputsForProperty(lView, inputs, value);
    }
    lView[bindingIndex] = newValue;
  }
}
function normalizeStylingDirectiveInputValue(initialValue, bindingValue, isClassBased) {
  var value = bindingValue;
  if (initialValue.length > 0) {
    if (isClassBased) {
      value = concatString(initialValue, forceClassesAsString(bindingValue));
    } else {
      value = concatString(initialValue, forceStylesAsString(bindingValue), ";");
    }
  }
  return value;
}
function ɵɵstylingApply() {
  var elementIndex = getSelectedIndex();
  var lView = getLView();
  var tNode = getTNode(elementIndex, lView);
  var renderer = getRenderer(tNode, lView);
  var native = getNativeByTNode(tNode, lView);
  var directiveIndex = getActiveDirectiveStylingIndex();
  var sanitizer = getCurrentStyleSanitizer();
  flushStyling(renderer, lView, getClassesContext(tNode), getStylesContext(tNode), native, directiveIndex, sanitizer);
  setCurrentStyleSanitizer(null);
}
exports.ɵɵstylingApply = ɵɵstylingApply;
function getRenderer(tNode, lView) {
  return tNode.type === 3 ? lView[RENDERER] : null;
}
function registerInitialStylingOnTNode(tNode, attrs, startIndex) {
  var hasAdditionalInitialStyling = false;
  var styles = getStylingMapArray(tNode.styles);
  var classes = getStylingMapArray(tNode.classes);
  var mode = -1;
  for (var i = startIndex; i < attrs.length; i++) {
    var attr = attrs[i];
    if (typeof attr == "number") {
      mode = attr;
    } else if (mode == 1) {
      classes = classes || [""];
      addItemToStylingMap(classes, attr, true);
      hasAdditionalInitialStyling = true;
    } else if (mode == 2) {
      var value = attrs[++i];
      styles = styles || [""];
      addItemToStylingMap(styles, attr, value);
      hasAdditionalInitialStyling = true;
    }
  }
  if (classes && classes.length > 1) {
    if (!tNode.classes) {
      tNode.classes = classes;
    }
    updateRawValueOnContext(tNode.classes, stylingMapToString(classes, true));
  }
  if (styles && styles.length > 1) {
    if (!tNode.styles) {
      tNode.styles = styles;
    }
    updateRawValueOnContext(tNode.styles, stylingMapToString(styles, false));
  }
  return hasAdditionalInitialStyling;
}
function updateRawValueOnContext(context, value) {
  var stylingMapArr = getStylingMapArray(context);
  stylingMapArr[0] = value;
}
function getActiveDirectiveStylingIndex() {
  return getActiveDirectiveId() + getActiveDirectiveSuperClassDepth();
}
function updateLastDirectiveIndex$1(tNode, directiveIndex) {
  updateLastDirectiveIndex(getClassesContext(tNode), directiveIndex);
  updateLastDirectiveIndex(getStylesContext(tNode), directiveIndex);
}
function getStylesContext(tNode) {
  return getContext(tNode, false);
}
function getClassesContext(tNode) {
  return getContext(tNode, true);
}
function getContext(tNode, isClassBased) {
  var context = isClassBased ? tNode.classes : tNode.styles;
  if (!isStylingContext(context)) {
    context = allocTStylingContext(context);
    if (ngDevMode) {
      attachStylingDebugObject(context);
    }
    if (isClassBased) {
      tNode.classes = context;
    } else {
      tNode.styles = context;
    }
  }
  return context;
}
function resolveStylePropValue(value, suffix) {
  if (value === NO_CHANGE) return value;
  var resolvedValue = null;
  if (value !== null) {
    if (suffix) {
      resolvedValue = renderStringify(value) + suffix;
    } else {
      resolvedValue = value;
    }
  }
  return resolvedValue;
}
function deferStylingUpdate() {
  return getActiveDirectiveSuperClassHeight() > 0;
}
function ɵɵelementStart(index, name, attrs, localRefs) {
  var lView = getLView();
  var tView = lView[TVIEW];
  ngDevMode && assertEqual(lView[BINDING_INDEX], tView.bindingStartIndex, "elements should be created before any bindings ");
  ngDevMode && ngDevMode.rendererCreateElement++;
  ngDevMode && assertDataInRange(lView, index + HEADER_OFFSET);
  var native = lView[index + HEADER_OFFSET] = elementCreate(name);
  var renderer = lView[RENDERER];
  var tNode = getOrCreateTNode(tView, lView[T_HOST], index, 3, name, attrs || null);
  if (attrs != null) {
    var lastAttrIndex = setUpAttributes(native, attrs);
    if (tView.firstTemplatePass) {
      registerInitialStylingOnTNode(tNode, attrs, lastAttrIndex);
    }
  }
  renderInitialStyling(renderer, native, tNode);
  appendChild(native, tNode, lView);
  if (getElementDepthCount() === 0) {
    attachPatchData(native, lView);
  }
  increaseElementDepthCount();
  if (tView.firstTemplatePass) {
    ngDevMode && ngDevMode.firstTemplatePass++;
    resolveDirectives(tView, lView, tNode, localRefs || null);
    var inputData = initializeTNodeInputs(tNode);
    if (inputData && inputData.hasOwnProperty("class")) {
      tNode.flags |= 8;
    }
    if (inputData && inputData.hasOwnProperty("style")) {
      tNode.flags |= 16;
    }
    if (tView.queries !== null) {
      tView.queries.elementStart(tView, tNode);
    }
  }
  createDirectivesAndLocals(tView, lView, tNode);
  executeContentQueries(tView, tNode, lView);
}
exports.ɵɵelementStart = ɵɵelementStart;
function ɵɵelementEnd() {
  var previousOrParentTNode = getPreviousOrParentTNode();
  ngDevMode && assertDefined(previousOrParentTNode, "No parent node to close.");
  if (getIsParent()) {
    setIsNotParent();
  } else {
    ngDevMode && assertHasParent(getPreviousOrParentTNode());
    previousOrParentTNode = previousOrParentTNode.parent;
    setPreviousOrParentTNode(previousOrParentTNode, false);
  }
  var tNode = previousOrParentTNode;
  ngDevMode && assertNodeType(tNode, 3);
  var lView = getLView();
  var tView = lView[TVIEW];
  registerPostOrderHooks(tView, previousOrParentTNode);
  decreaseElementDepthCount();
  if (tView.firstTemplatePass && tView.queries !== null && isContentQueryHost(previousOrParentTNode)) {
    tView.queries.elementEnd(previousOrParentTNode);
  }
  if (hasClassInput(tNode) && tNode.classes) {
    setDirectiveStylingInput(tNode.classes, lView, tNode.inputs["class"]);
  }
  if (hasStyleInput(tNode) && tNode.styles) {
    setDirectiveStylingInput(tNode.styles, lView, tNode.inputs["style"]);
  }
}
exports.ɵɵelementEnd = ɵɵelementEnd;
function ɵɵelement(index, name, attrs, localRefs) {
  ɵɵelementStart(index, name, attrs, localRefs);
  ɵɵelementEnd();
}
exports.ɵɵelement = ɵɵelement;
function ɵɵelementHostAttrs(attrs) {
  var hostElementIndex = getSelectedIndex();
  var lView = getLView();
  var tView = lView[TVIEW];
  var tNode = getTNode(hostElementIndex, lView);
  if (tNode.type === 3) {
    var native = getNativeByTNode(tNode, lView);
    var lastAttrIndex = setUpAttributes(native, attrs);
    if (tView.firstTemplatePass) {
      var stylingNeedsToBeRendered = registerInitialStylingOnTNode(tNode, attrs, lastAttrIndex);
      if (stylingNeedsToBeRendered) {
        var renderer = lView[RENDERER];
        renderInitialStyling(renderer, native, tNode);
      }
    }
  }
}
exports.ɵɵelementHostAttrs = ɵɵelementHostAttrs;
function setDirectiveStylingInput(context, lView, stylingInputs) {
  var value = getInitialStylingValue(context) || null;
  setInputsForProperty(lView, stylingInputs, value);
}
function ɵɵelementContainerStart(index, attrs, localRefs) {
  var lView = getLView();
  var tView = lView[TVIEW];
  var renderer = lView[RENDERER];
  var tagName = "ng-container";
  ngDevMode && assertEqual(lView[BINDING_INDEX], tView.bindingStartIndex, "element containers should be created before any bindings");
  ngDevMode && ngDevMode.rendererCreateComment++;
  ngDevMode && assertDataInRange(lView, index + HEADER_OFFSET);
  var native = lView[index + HEADER_OFFSET] = renderer.createComment(ngDevMode ? tagName : "");
  ngDevMode && assertDataInRange(lView, index - 1);
  var tNode = getOrCreateTNode(tView, lView[T_HOST], index, 4, tagName, attrs || null);
  if (attrs && tView.firstTemplatePass) {
    registerInitialStylingOnTNode(tNode, attrs, 0);
  }
  appendChild(native, tNode, lView);
  if (tView.firstTemplatePass) {
    ngDevMode && ngDevMode.firstTemplatePass++;
    resolveDirectives(tView, lView, tNode, localRefs || null);
    if (tView.queries) {
      tView.queries.elementStart(tView, tNode);
    }
  }
  createDirectivesAndLocals(tView, lView, tNode);
  attachPatchData(native, lView);
  executeContentQueries(tView, tNode, lView);
}
exports.ɵɵelementContainerStart = ɵɵelementContainerStart;
function ɵɵelementContainerEnd() {
  var previousOrParentTNode = getPreviousOrParentTNode();
  var lView = getLView();
  var tView = lView[TVIEW];
  if (getIsParent()) {
    setIsNotParent();
  } else {
    ngDevMode && assertHasParent(previousOrParentTNode);
    previousOrParentTNode = previousOrParentTNode.parent;
    setPreviousOrParentTNode(previousOrParentTNode, false);
  }
  ngDevMode && assertNodeType(previousOrParentTNode, 4);
  registerPostOrderHooks(tView, previousOrParentTNode);
  if (tView.firstTemplatePass && tView.queries !== null && isContentQueryHost(previousOrParentTNode)) {
    tView.queries.elementEnd(previousOrParentTNode);
  }
}
exports.ɵɵelementContainerEnd = ɵɵelementContainerEnd;
function ɵɵelementContainer(index, attrs, localRefs) {
  ɵɵelementContainerStart(index, attrs, localRefs);
  ɵɵelementContainerEnd();
}
exports.ɵɵelementContainer = ɵɵelementContainer;
function ɵɵembeddedViewStart(viewBlockId, consts, vars) {
  var lView = getLView();
  var previousOrParentTNode = getPreviousOrParentTNode();
  var containerTNode = previousOrParentTNode.type === 2 ? previousOrParentTNode.parent : previousOrParentTNode;
  var lContainer = lView[containerTNode.index];
  ngDevMode && assertNodeType(containerTNode, 0);
  var viewToRender = scanForView(lContainer, lContainer[ACTIVE_INDEX], viewBlockId);
  if (viewToRender) {
    setIsParent();
    enterView(viewToRender, viewToRender[TVIEW].node);
  } else {
    viewToRender = createLView(lView, getOrCreateEmbeddedTView(viewBlockId, consts, vars, containerTNode), null, 16, null, null);
    var tParentNode = getIsParent() ? previousOrParentTNode : previousOrParentTNode && previousOrParentTNode.parent;
    assignTViewNodeToLView(viewToRender[TVIEW], tParentNode, viewBlockId, viewToRender);
    enterView(viewToRender, viewToRender[TVIEW].node);
  }
  if (lContainer) {
    if (isCreationMode(viewToRender)) {
      insertView(viewToRender, lContainer, lContainer[ACTIVE_INDEX]);
    }
    lContainer[ACTIVE_INDEX]++;
  }
  return isCreationMode(viewToRender) ? 1 | 2 : 2;
}
exports.ɵɵembeddedViewStart = ɵɵembeddedViewStart;
function getOrCreateEmbeddedTView(viewIndex, consts, vars, parent) {
  var tView = getLView()[TVIEW];
  ngDevMode && assertNodeType(parent, 0);
  var containerTViews = parent.tViews;
  ngDevMode && assertDefined(containerTViews, "TView expected");
  ngDevMode && assertEqual(Array.isArray(containerTViews), true, "TViews should be in an array");
  if (viewIndex >= containerTViews.length || containerTViews[viewIndex] == null) {
    containerTViews[viewIndex] = createTView(viewIndex, null, consts, vars, tView.directiveRegistry, tView.pipeRegistry, null, null);
  }
  return containerTViews[viewIndex];
}
function scanForView(lContainer, startIdx, viewBlockId) {
  for (var i = startIdx + CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
    var viewAtPositionId = lContainer[i][TVIEW].id;
    if (viewAtPositionId === viewBlockId) {
      return lContainer[i];
    } else if (viewAtPositionId < viewBlockId) {
      removeView(lContainer, i - CONTAINER_HEADER_OFFSET);
    } else {
      break;
    }
  }
  return null;
}
function ɵɵembeddedViewEnd() {
  var lView = getLView();
  var viewHost = lView[T_HOST];
  if (isCreationMode(lView)) {
    refreshDescendantViews(lView);
    lView[FLAGS] &= ~4;
  }
  resetPreOrderHookFlags(lView);
  refreshDescendantViews(lView);
  var lContainer = lView[PARENT];
  ngDevMode && assertLContainerOrUndefined(lContainer);
  leaveView(lContainer[PARENT], true);
  setPreviousOrParentTNode(viewHost, false);
}
exports.ɵɵembeddedViewEnd = ɵɵembeddedViewEnd;
function ɵɵgetCurrentView() {
  return getLView();
}
exports.ɵɵgetCurrentView = ɵɵgetCurrentView;
function isPromise(obj) {
  return !!obj && typeof obj.then === "function";
}
exports.ɵisPromise = isPromise;
function isObservable(obj) {
  return !!obj && typeof obj.subscribe === "function";
}
exports.ɵisObservable = isObservable;
function ɵɵlistener(eventName, listenerFn, useCapture, eventTargetResolver) {
  if (useCapture === void 0) {
    useCapture = false;
  }
  listenerInternal(eventName, listenerFn, useCapture, eventTargetResolver);
}
exports.ɵɵlistener = ɵɵlistener;
function ɵɵcomponentHostSyntheticListener(eventName, listenerFn, useCapture, eventTargetResolver) {
  if (useCapture === void 0) {
    useCapture = false;
  }
  listenerInternal(eventName, listenerFn, useCapture, eventTargetResolver, loadComponentRenderer);
}
exports.ɵɵcomponentHostSyntheticListener = ɵɵcomponentHostSyntheticListener;
function findExistingListener(lView, eventName, tNodeIdx) {
  var tView = lView[TVIEW];
  var tCleanup = tView.cleanup;
  if (tCleanup != null) {
    for (var i = 0; i < tCleanup.length - 1; i += 2) {
      var cleanupEventName = tCleanup[i];
      if (cleanupEventName === eventName && tCleanup[i + 1] === tNodeIdx) {
        var lCleanup = lView[CLEANUP];
        var listenerIdxInLCleanup = tCleanup[i + 2];
        return lCleanup.length > listenerIdxInLCleanup ? lCleanup[listenerIdxInLCleanup] : null;
      }
      if (typeof cleanupEventName === "string") {
        i += 2;
      }
    }
  }
  return null;
}
function listenerInternal(eventName, listenerFn, useCapture, eventTargetResolver, loadRendererFn) {
  if (useCapture === void 0) {
    useCapture = false;
  }
  var lView = getLView();
  var tNode = getPreviousOrParentTNode();
  var tView = lView[TVIEW];
  var firstTemplatePass = tView.firstTemplatePass;
  var tCleanup = firstTemplatePass && (tView.cleanup || (tView.cleanup = []));
  ngDevMode && assertNodeOfPossibleTypes(tNode, 3, 0, 4);
  var processOutputs = true;
  if (tNode.type === 3) {
    var native = getNativeByTNode(tNode, lView);
    var resolved = eventTargetResolver ? eventTargetResolver(native) : EMPTY_OBJ;
    var target = resolved.target || native;
    var renderer = loadRendererFn ? loadRendererFn(tNode, lView) : lView[RENDERER];
    var lCleanup = getCleanup(lView);
    var lCleanupIndex = lCleanup.length;
    var idxOrTargetGetter = eventTargetResolver ? function (_lView) {
      return eventTargetResolver(unwrapRNode(_lView[tNode.index])).target;
    } : tNode.index;
    if (isProceduralRenderer(renderer)) {
      var existingListener = null;
      if (!eventTargetResolver && hasDirectives(tNode)) {
        existingListener = findExistingListener(lView, eventName, tNode.index);
      }
      if (existingListener !== null) {
        listenerFn.__ngNextListenerFn__ = existingListener.__ngNextListenerFn__;
        existingListener.__ngNextListenerFn__ = listenerFn;
        processOutputs = false;
      } else {
        listenerFn = wrapListener(tNode, lView, listenerFn, false);
        var cleanupFn = renderer.listen(resolved.name || target, eventName, listenerFn);
        ngDevMode && ngDevMode.rendererAddEventListener++;
        lCleanup.push(listenerFn, cleanupFn);
        tCleanup && tCleanup.push(eventName, idxOrTargetGetter, lCleanupIndex, lCleanupIndex + 1);
      }
    } else {
      listenerFn = wrapListener(tNode, lView, listenerFn, true);
      target.addEventListener(eventName, listenerFn, useCapture);
      ngDevMode && ngDevMode.rendererAddEventListener++;
      lCleanup.push(listenerFn);
      tCleanup && tCleanup.push(eventName, idxOrTargetGetter, lCleanupIndex, useCapture);
    }
  }
  if (tNode.outputs === undefined) {
    tNode.outputs = generatePropertyAliases(tNode, 1);
  }
  var outputs = tNode.outputs;
  var props;
  if (processOutputs && outputs && (props = outputs[eventName])) {
    var propsLength = props.length;
    if (propsLength) {
      var lCleanup = getCleanup(lView);
      for (var i = 0; i < propsLength; i += 3) {
        var index = props[i];
        ngDevMode && assertDataInRange(lView, index);
        var minifiedName = props[i + 2];
        var directiveInstance = lView[index];
        var output = directiveInstance[minifiedName];
        if (ngDevMode && !isObservable(output)) {
          throw new Error("@Output " + minifiedName + " not initialized in '" + directiveInstance.constructor.name + "'.");
        }
        var subscription = output.subscribe(listenerFn);
        var idx = lCleanup.length;
        lCleanup.push(listenerFn, subscription);
        tCleanup && tCleanup.push(eventName, tNode.index, idx, -(idx + 1));
      }
    }
  }
}
function executeListenerWithErrorHandling(lView, listenerFn, e) {
  try {
    return listenerFn(e) !== false;
  } catch (error) {
    handleError(lView, error);
    return false;
  }
}
function wrapListener(tNode, lView, listenerFn, wrapWithPreventDefault) {
  return function wrapListenerIn_markDirtyAndPreventDefault(e) {
    var startView = tNode.flags & 1 ? getComponentViewByIndex(tNode.index, lView) : lView;
    if ((lView[FLAGS] & 32) === 0) {
      markViewDirty(startView);
    }
    var result = executeListenerWithErrorHandling(lView, listenerFn, e);
    var nextListenerFn = wrapListenerIn_markDirtyAndPreventDefault.__ngNextListenerFn__;
    while (nextListenerFn) {
      result = executeListenerWithErrorHandling(lView, nextListenerFn, e) && result;
      nextListenerFn = nextListenerFn.__ngNextListenerFn__;
    }
    if (wrapWithPreventDefault && result === false) {
      e.preventDefault();
      e.returnValue = false;
    }
    return result;
  };
}
function ɵɵnextContext(level) {
  if (level === void 0) {
    level = 1;
  }
  return nextContextImpl(level);
}
exports.ɵɵnextContext = ɵɵnextContext;
function matchingProjectionSlotIndex(tNode, projectionSlots) {
  var wildcardNgContentIndex = null;
  var ngProjectAsAttrVal = getProjectAsAttrValue(tNode);
  for (var i = 0; i < projectionSlots.length; i++) {
    var slotValue = projectionSlots[i];
    if (slotValue === "*") {
      wildcardNgContentIndex = i;
      continue;
    }
    if (ngProjectAsAttrVal === null ? isNodeMatchingSelectorList(tNode, slotValue, true) : isSelectorInSelectorList(ngProjectAsAttrVal, slotValue)) {
      return i;
    }
  }
  return wildcardNgContentIndex;
}
function ɵɵprojectionDef(projectionSlots) {
  var componentNode = findComponentView(getLView())[T_HOST];
  if (!componentNode.projection) {
    var numProjectionSlots = projectionSlots ? projectionSlots.length : 1;
    var projectionHeads = componentNode.projection = new Array(numProjectionSlots).fill(null);
    var tails = projectionHeads.slice();
    var componentChild = componentNode.child;
    while (componentChild !== null) {
      var slotIndex = projectionSlots ? matchingProjectionSlotIndex(componentChild, projectionSlots) : 0;
      if (slotIndex !== null) {
        if (tails[slotIndex]) {
          tails[slotIndex].projectionNext = componentChild;
        } else {
          projectionHeads[slotIndex] = componentChild;
        }
        tails[slotIndex] = componentChild;
      }
      componentChild = componentChild.next;
    }
  }
}
exports.ɵɵprojectionDef = ɵɵprojectionDef;
var delayProjection = false;
function setDelayProjection(value) {
  delayProjection = value;
}
function ɵɵprojection(nodeIndex, selectorIndex, attrs) {
  if (selectorIndex === void 0) {
    selectorIndex = 0;
  }
  var lView = getLView();
  var tProjectionNode = getOrCreateTNode(lView[TVIEW], lView[T_HOST], nodeIndex, 1, null, attrs || null);
  if (tProjectionNode.projection === null) tProjectionNode.projection = selectorIndex;
  setIsNotParent();
  if (!delayProjection) {
    appendProjectedNodes(lView, tProjectionNode, selectorIndex, findComponentView(lView));
  }
}
exports.ɵɵprojection = ɵɵprojection;
function ɵɵpropertyInterpolate(propName, v0, sanitizer) {
  ɵɵpropertyInterpolate1(propName, "", v0, "", sanitizer);
  return ɵɵpropertyInterpolate;
}
exports.ɵɵpropertyInterpolate = ɵɵpropertyInterpolate;
function ɵɵpropertyInterpolate1(propName, prefix, v0, suffix, sanitizer) {
  var index = getSelectedIndex();
  var interpolatedValue = interpolation1(getLView(), prefix, v0, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementPropertyInternal(index, propName, interpolatedValue, sanitizer);
  }
  return ɵɵpropertyInterpolate1;
}
exports.ɵɵpropertyInterpolate1 = ɵɵpropertyInterpolate1;
function ɵɵpropertyInterpolate2(propName, prefix, v0, i0, v1, suffix, sanitizer) {
  var index = getSelectedIndex();
  var interpolatedValue = interpolation2(getLView(), prefix, v0, i0, v1, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementPropertyInternal(index, propName, interpolatedValue, sanitizer);
  }
  return ɵɵpropertyInterpolate2;
}
exports.ɵɵpropertyInterpolate2 = ɵɵpropertyInterpolate2;
function ɵɵpropertyInterpolate3(propName, prefix, v0, i0, v1, i1, v2, suffix, sanitizer) {
  var index = getSelectedIndex();
  var interpolatedValue = interpolation3(getLView(), prefix, v0, i0, v1, i1, v2, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementPropertyInternal(index, propName, interpolatedValue, sanitizer);
  }
  return ɵɵpropertyInterpolate3;
}
exports.ɵɵpropertyInterpolate3 = ɵɵpropertyInterpolate3;
function ɵɵpropertyInterpolate4(propName, prefix, v0, i0, v1, i1, v2, i2, v3, suffix, sanitizer) {
  var index = getSelectedIndex();
  var interpolatedValue = interpolation4(getLView(), prefix, v0, i0, v1, i1, v2, i2, v3, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementPropertyInternal(index, propName, interpolatedValue, sanitizer);
  }
  return ɵɵpropertyInterpolate4;
}
exports.ɵɵpropertyInterpolate4 = ɵɵpropertyInterpolate4;
function ɵɵpropertyInterpolate5(propName, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix, sanitizer) {
  var index = getSelectedIndex();
  var interpolatedValue = interpolation5(getLView(), prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementPropertyInternal(index, propName, interpolatedValue, sanitizer);
  }
  return ɵɵpropertyInterpolate5;
}
exports.ɵɵpropertyInterpolate5 = ɵɵpropertyInterpolate5;
function ɵɵpropertyInterpolate6(propName, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix, sanitizer) {
  var index = getSelectedIndex();
  var interpolatedValue = interpolation6(getLView(), prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementPropertyInternal(index, propName, interpolatedValue, sanitizer);
  }
  return ɵɵpropertyInterpolate6;
}
exports.ɵɵpropertyInterpolate6 = ɵɵpropertyInterpolate6;
function ɵɵpropertyInterpolate7(propName, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix, sanitizer) {
  var index = getSelectedIndex();
  var interpolatedValue = interpolation7(getLView(), prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementPropertyInternal(index, propName, interpolatedValue, sanitizer);
  }
  return ɵɵpropertyInterpolate7;
}
exports.ɵɵpropertyInterpolate7 = ɵɵpropertyInterpolate7;
function ɵɵpropertyInterpolate8(propName, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix, sanitizer) {
  var index = getSelectedIndex();
  var interpolatedValue = interpolation8(getLView(), prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix);
  if (interpolatedValue !== NO_CHANGE) {
    elementPropertyInternal(index, propName, interpolatedValue, sanitizer);
  }
  return ɵɵpropertyInterpolate8;
}
exports.ɵɵpropertyInterpolate8 = ɵɵpropertyInterpolate8;
function ɵɵpropertyInterpolateV(propName, values, sanitizer) {
  var index = getSelectedIndex();
  var interpolatedValue = interpolationV(getLView(), values);
  if (interpolatedValue !== NO_CHANGE) {
    elementPropertyInternal(index, propName, interpolatedValue, sanitizer);
  }
  return ɵɵpropertyInterpolateV;
}
exports.ɵɵpropertyInterpolateV = ɵɵpropertyInterpolateV;
function ɵɵtext(index, value) {
  var lView = getLView();
  ngDevMode && assertEqual(lView[BINDING_INDEX], lView[TVIEW].bindingStartIndex, "text nodes should be created before any bindings");
  ngDevMode && ngDevMode.rendererCreateTextNode++;
  ngDevMode && assertDataInRange(lView, index + HEADER_OFFSET);
  var textNative = lView[index + HEADER_OFFSET] = createTextNode(value, lView[RENDERER]);
  ngDevMode && ngDevMode.rendererSetText++;
  var tNode = getOrCreateTNode(lView[TVIEW], lView[T_HOST], index, 3, null, null);
  setIsNotParent();
  appendChild(textNative, tNode, lView);
}
exports.ɵɵtext = ɵɵtext;
function ɵɵtextBinding(value) {
  var lView = getLView();
  var index = getSelectedIndex();
  var bound = bind(lView, value);
  if (bound !== NO_CHANGE) {
    textBindingInternal(lView, index, renderStringify(bound));
  }
}
exports.ɵɵtextBinding = ɵɵtextBinding;
function ɵɵtextInterpolate(v0) {
  ɵɵtextInterpolate1("", v0, "");
  return ɵɵtextInterpolate;
}
exports.ɵɵtextInterpolate = ɵɵtextInterpolate;
function ɵɵtextInterpolate1(prefix, v0, suffix) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolated = interpolation1(lView, prefix, v0, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, index, interpolated);
  }
  return ɵɵtextInterpolate1;
}
exports.ɵɵtextInterpolate1 = ɵɵtextInterpolate1;
function ɵɵtextInterpolate2(prefix, v0, i0, v1, suffix) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolated = interpolation2(lView, prefix, v0, i0, v1, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, index, interpolated);
  }
  return ɵɵtextInterpolate2;
}
exports.ɵɵtextInterpolate2 = ɵɵtextInterpolate2;
function ɵɵtextInterpolate3(prefix, v0, i0, v1, i1, v2, suffix) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolated = interpolation3(lView, prefix, v0, i0, v1, i1, v2, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, index, interpolated);
  }
  return ɵɵtextInterpolate3;
}
exports.ɵɵtextInterpolate3 = ɵɵtextInterpolate3;
function ɵɵtextInterpolate4(prefix, v0, i0, v1, i1, v2, i2, v3, suffix) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolated = interpolation4(lView, prefix, v0, i0, v1, i1, v2, i2, v3, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, index, interpolated);
  }
  return ɵɵtextInterpolate4;
}
exports.ɵɵtextInterpolate4 = ɵɵtextInterpolate4;
function ɵɵtextInterpolate5(prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolated = interpolation5(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, index, interpolated);
  }
  return ɵɵtextInterpolate5;
}
exports.ɵɵtextInterpolate5 = ɵɵtextInterpolate5;
function ɵɵtextInterpolate6(prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolated = interpolation6(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, index, interpolated);
  }
  return ɵɵtextInterpolate6;
}
exports.ɵɵtextInterpolate6 = ɵɵtextInterpolate6;
function ɵɵtextInterpolate7(prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolated = interpolation7(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, index, interpolated);
  }
  return ɵɵtextInterpolate7;
}
exports.ɵɵtextInterpolate7 = ɵɵtextInterpolate7;
function ɵɵtextInterpolate8(prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolated = interpolation8(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, index, interpolated);
  }
  return ɵɵtextInterpolate8;
}
exports.ɵɵtextInterpolate8 = ɵɵtextInterpolate8;
function ɵɵtextInterpolateV(values) {
  var index = getSelectedIndex();
  var lView = getLView();
  var interpolated = interpolationV(lView, values);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, index, interpolated);
  }
  return ɵɵtextInterpolateV;
}
exports.ɵɵtextInterpolateV = ɵɵtextInterpolateV;
function ɵɵclassMapInterpolate1(prefix, v0, suffix) {
  var lView = getLView();
  var interpolatedValue = interpolation1(lView, prefix, v0, suffix);
  classMapInternal(getSelectedIndex(), interpolatedValue);
}
exports.ɵɵclassMapInterpolate1 = ɵɵclassMapInterpolate1;
function ɵɵclassMapInterpolate2(prefix, v0, i0, v1, suffix) {
  var lView = getLView();
  var interpolatedValue = interpolation2(lView, prefix, v0, i0, v1, suffix);
  classMapInternal(getSelectedIndex(), interpolatedValue);
}
exports.ɵɵclassMapInterpolate2 = ɵɵclassMapInterpolate2;
function ɵɵclassMapInterpolate3(prefix, v0, i0, v1, i1, v2, suffix) {
  var lView = getLView();
  var interpolatedValue = interpolation3(lView, prefix, v0, i0, v1, i1, v2, suffix);
  classMapInternal(getSelectedIndex(), interpolatedValue);
}
exports.ɵɵclassMapInterpolate3 = ɵɵclassMapInterpolate3;
function ɵɵclassMapInterpolate4(prefix, v0, i0, v1, i1, v2, i2, v3, suffix) {
  var lView = getLView();
  var interpolatedValue = interpolation4(lView, prefix, v0, i0, v1, i1, v2, i2, v3, suffix);
  classMapInternal(getSelectedIndex(), interpolatedValue);
}
exports.ɵɵclassMapInterpolate4 = ɵɵclassMapInterpolate4;
function ɵɵclassMapInterpolate5(prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix) {
  var lView = getLView();
  var interpolatedValue = interpolation5(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix);
  classMapInternal(getSelectedIndex(), interpolatedValue);
}
exports.ɵɵclassMapInterpolate5 = ɵɵclassMapInterpolate5;
function ɵɵclassMapInterpolate6(prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix) {
  var lView = getLView();
  var interpolatedValue = interpolation6(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix);
  classMapInternal(getSelectedIndex(), interpolatedValue);
}
exports.ɵɵclassMapInterpolate6 = ɵɵclassMapInterpolate6;
function ɵɵclassMapInterpolate7(prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix) {
  var lView = getLView();
  var interpolatedValue = interpolation7(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix);
  classMapInternal(getSelectedIndex(), interpolatedValue);
}
exports.ɵɵclassMapInterpolate7 = ɵɵclassMapInterpolate7;
function ɵɵclassMapInterpolate8(prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix) {
  var lView = getLView();
  var interpolatedValue = interpolation8(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix);
  classMapInternal(getSelectedIndex(), interpolatedValue);
}
exports.ɵɵclassMapInterpolate8 = ɵɵclassMapInterpolate8;
function ɵɵclassMapInterpolateV(values) {
  var lView = getLView();
  var interpolatedValue = interpolationV(lView, values);
  classMapInternal(getSelectedIndex(), interpolatedValue);
}
exports.ɵɵclassMapInterpolateV = ɵɵclassMapInterpolateV;
function ɵɵstylePropInterpolate1(prop, prefix, v0, suffix, valueSuffix) {
  var lView = getLView();
  var interpolatedValue = interpolation1(lView, prefix, v0, suffix);
  stylePropInternal(getSelectedIndex(), prop, interpolatedValue, valueSuffix);
  return ɵɵstylePropInterpolate1;
}
exports.ɵɵstylePropInterpolate1 = ɵɵstylePropInterpolate1;
function ɵɵstylePropInterpolate2(prop, prefix, v0, i0, v1, suffix, valueSuffix) {
  var lView = getLView();
  var interpolatedValue = interpolation2(lView, prefix, v0, i0, v1, suffix);
  stylePropInternal(getSelectedIndex(), prop, interpolatedValue, valueSuffix);
  return ɵɵstylePropInterpolate2;
}
exports.ɵɵstylePropInterpolate2 = ɵɵstylePropInterpolate2;
function ɵɵstylePropInterpolate3(prop, prefix, v0, i0, v1, i1, v2, suffix, valueSuffix) {
  var lView = getLView();
  var interpolatedValue = interpolation3(lView, prefix, v0, i0, v1, i1, v2, suffix);
  stylePropInternal(getSelectedIndex(), prop, interpolatedValue, valueSuffix);
  return ɵɵstylePropInterpolate3;
}
exports.ɵɵstylePropInterpolate3 = ɵɵstylePropInterpolate3;
function ɵɵstylePropInterpolate4(prop, prefix, v0, i0, v1, i1, v2, i2, v3, suffix, valueSuffix) {
  var lView = getLView();
  var interpolatedValue = interpolation4(lView, prefix, v0, i0, v1, i1, v2, i2, v3, suffix);
  stylePropInternal(getSelectedIndex(), prop, interpolatedValue, valueSuffix);
  return ɵɵstylePropInterpolate4;
}
exports.ɵɵstylePropInterpolate4 = ɵɵstylePropInterpolate4;
function ɵɵstylePropInterpolate5(prop, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix, valueSuffix) {
  var lView = getLView();
  var interpolatedValue = interpolation5(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix);
  stylePropInternal(getSelectedIndex(), prop, interpolatedValue, valueSuffix);
  return ɵɵstylePropInterpolate5;
}
exports.ɵɵstylePropInterpolate5 = ɵɵstylePropInterpolate5;
function ɵɵstylePropInterpolate6(prop, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix, valueSuffix) {
  var lView = getLView();
  var interpolatedValue = interpolation6(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix);
  stylePropInternal(getSelectedIndex(), prop, interpolatedValue, valueSuffix);
  return ɵɵstylePropInterpolate6;
}
exports.ɵɵstylePropInterpolate6 = ɵɵstylePropInterpolate6;
function ɵɵstylePropInterpolate7(prop, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix, valueSuffix) {
  var lView = getLView();
  var interpolatedValue = interpolation7(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix);
  stylePropInternal(getSelectedIndex(), prop, interpolatedValue, valueSuffix);
  return ɵɵstylePropInterpolate7;
}
exports.ɵɵstylePropInterpolate7 = ɵɵstylePropInterpolate7;
function ɵɵstylePropInterpolate8(prop, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix, valueSuffix) {
  var lView = getLView();
  var interpolatedValue = interpolation8(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix);
  stylePropInternal(getSelectedIndex(), prop, interpolatedValue, valueSuffix);
  return ɵɵstylePropInterpolate8;
}
exports.ɵɵstylePropInterpolate8 = ɵɵstylePropInterpolate8;
function ɵɵstylePropInterpolateV(prop, values, valueSuffix) {
  var lView = getLView();
  var interpolatedValue = interpolationV(lView, values);
  stylePropInternal(getSelectedIndex(), prop, interpolatedValue, valueSuffix);
  return ɵɵstylePropInterpolateV;
}
exports.ɵɵstylePropInterpolateV = ɵɵstylePropInterpolateV;
function ɵɵhostProperty(propName, value, sanitizer) {
  var index = getSelectedIndex();
  ngDevMode && assertNotEqual(index, -1, "selected index cannot be -1");
  var lView = getLView();
  var bindReconciledValue = bind(lView, value);
  if (bindReconciledValue !== NO_CHANGE) {
    elementPropertyInternal(index, propName, bindReconciledValue, sanitizer, true);
  }
  return ɵɵhostProperty;
}
exports.ɵɵhostProperty = ɵɵhostProperty;
function ɵɵupdateSyntheticHostBinding(propName, value, sanitizer) {
  var index = getSelectedIndex();
  var lView = getLView();
  var bound = bind(lView, value);
  if (bound !== NO_CHANGE) {
    elementPropertyInternal(index, propName, bound, sanitizer, true, loadComponentRenderer);
  }
  return ɵɵupdateSyntheticHostBinding;
}
exports.ɵɵupdateSyntheticHostBinding = ɵɵupdateSyntheticHostBinding;
function getComponent(element) {
  var context = loadLContextFromNode(element);
  if (context.component === undefined) {
    context.component = getComponentAtNodeIndex(context.nodeIndex, context.lView);
  }
  return context.component;
}
function getContext$1(element) {
  var context = loadLContextFromNode(element);
  return context.lView[CONTEXT];
}
function getViewComponent(element) {
  var context = loadLContext(element);
  var lView = context.lView;
  var parent;
  ngDevMode && assertLView(lView);
  while (lView[HOST] === null && (parent = getLViewParent(lView))) {
    lView = parent;
  }
  return lView[FLAGS] & 512 ? null : lView[CONTEXT];
}
function getRootComponents(target) {
  return tslib_1.__spread(getRootContext(target).components);
}
function getInjector(target) {
  var context = loadLContext(target);
  var tNode = context.lView[TVIEW].data[context.nodeIndex];
  return new NodeInjector(tNode, context.lView);
}
function getInjectionTokens(element) {
  var context = loadLContext(element, false);
  if (!context) return [];
  var lView = context.lView;
  var tView = lView[TVIEW];
  var tNode = tView.data[context.nodeIndex];
  var providerTokens = [];
  var startIndex = tNode.providerIndexes & 65535;
  var endIndex = tNode.directiveEnd;
  for (var i = startIndex; i < endIndex; i++) {
    var value = tView.data[i];
    if (isDirectiveDefHack(value)) {
      value = value.type;
    }
    providerTokens.push(value);
  }
  return providerTokens;
}
function getDirectives(target) {
  var context = loadLContext(target);
  if (context.directives === undefined) {
    context.directives = getDirectivesAtNodeIndex(context.nodeIndex, context.lView, false);
  }
  return context.directives || [];
}
exports.ɵgetDirectives = getDirectives;
function loadLContext(target, throwOnNotFound) {
  if (throwOnNotFound === void 0) {
    throwOnNotFound = true;
  }
  var context = getLContext(target);
  if (!context && throwOnNotFound) {
    throw new Error(ngDevMode ? "Unable to find context associated with " + stringifyForError(target) : "Invalid ng target");
  }
  return context;
}
function getLocalRefs(target) {
  var context = loadLContext(target);
  if (context.localRefs === undefined) {
    context.localRefs = discoverLocalRefs(context.lView, context.nodeIndex);
  }
  return context.localRefs || ({});
}
function getHostElement(directive) {
  return getLContext(directive).native;
}
exports.ɵgetHostElement = getHostElement;
function getRenderedText(component) {
  var hostElement = getHostElement(component);
  return hostElement.textContent || "";
}
function loadLContextFromNode(node) {
  if (!(node instanceof Node)) throw new Error("Expecting instance of DOM Node");
  return loadLContext(node);
}
function isBrowserEvents(listener) {
  return typeof listener.useCapture === "boolean";
}
function getListeners(element) {
  var lContext = loadLContextFromNode(element);
  var lView = lContext.lView;
  var tView = lView[TVIEW];
  var lCleanup = lView[CLEANUP];
  var tCleanup = tView.cleanup;
  var listeners = [];
  if (tCleanup && lCleanup) {
    for (var i = 0; i < tCleanup.length; ) {
      var firstParam = tCleanup[i++];
      var secondParam = tCleanup[i++];
      if (typeof firstParam === "string") {
        var name_1 = firstParam;
        var listenerElement = unwrapRNode(lView[secondParam]);
        var callback = lCleanup[tCleanup[i++]];
        var useCaptureOrIndx = tCleanup[i++];
        var useCapture = typeof useCaptureOrIndx === "boolean" ? useCaptureOrIndx : useCaptureOrIndx >= 0 ? false : null;
        if (element == listenerElement) {
          listeners.push({
            element: element,
            name: name_1,
            callback: callback,
            useCapture: useCapture
          });
        }
      }
    }
  }
  listeners.sort(sortListeners);
  return listeners;
}
function sortListeners(a, b) {
  if (a.name == b.name) return 0;
  return a.name < b.name ? -1 : 1;
}
function isDirectiveDefHack(obj) {
  return obj.type !== undefined && obj.template !== undefined && obj.declaredInputs !== undefined;
}
var GLOBAL_PUBLISH_EXPANDO_KEY = "ng";
var _published = false;
function publishDefaultGlobalUtils() {
  if (!_published) {
    _published = true;
    publishGlobalUtil("getComponent", getComponent);
    publishGlobalUtil("getContext", getContext$1);
    publishGlobalUtil("getListeners", getListeners);
    publishGlobalUtil("getViewComponent", getViewComponent);
    publishGlobalUtil("getHostElement", getHostElement);
    publishGlobalUtil("getInjector", getInjector);
    publishGlobalUtil("getRootComponents", getRootComponents);
    publishGlobalUtil("getDirectives", getDirectives);
    publishGlobalUtil("markDirty", markDirty);
  }
}
exports.ɵpublishDefaultGlobalUtils = publishDefaultGlobalUtils;
function publishGlobalUtil(name, fn) {
  var w = _global;
  ngDevMode && assertDefined(fn, "function not defined");
  if (w) {
    var container = w[GLOBAL_PUBLISH_EXPANDO_KEY];
    if (!container) {
      container = w[GLOBAL_PUBLISH_EXPANDO_KEY] = {};
    }
    container[name] = fn;
  }
}
exports.ɵpublishGlobalUtil = publishGlobalUtil;
var ɵ0$c = function (token, notFoundValue) {
  throw new Error("NullInjector: Not found: " + stringifyForError(token));
};
var NULL_INJECTOR$1 = {
  get: ɵ0$c
};
function renderComponent(componentType, opts) {
  if (opts === void 0) {
    opts = {};
  }
  ngDevMode && publishDefaultGlobalUtils();
  ngDevMode && assertComponentType(componentType);
  setActiveHostElement(null);
  var rendererFactory = opts.rendererFactory || domRendererFactory3;
  var sanitizer = opts.sanitizer || null;
  var componentDef = getComponentDef(componentType);
  if (componentDef.type != componentType) componentDef.type = componentType;
  var componentTag = componentDef.selectors[0][0];
  var hostRNode = locateHostElement(rendererFactory, opts.host || componentTag);
  var rootFlags = componentDef.onPush ? 64 | 512 : 16 | 512;
  var rootContext = createRootContext(opts.scheduler, opts.playerHandler);
  var renderer = rendererFactory.createRenderer(hostRNode, componentDef);
  var rootView = createLView(null, createTView(-1, null, 1, 0, null, null, null, null), rootContext, rootFlags, null, null, rendererFactory, renderer, undefined, opts.injector || null);
  var oldView = enterView(rootView, null);
  var component;
  var safeToRunHooks = false;
  try {
    if (rendererFactory.begin) rendererFactory.begin();
    var componentView = createRootComponentView(hostRNode, componentDef, rootView, rendererFactory, renderer, sanitizer);
    component = createRootComponent(componentView, componentDef, rootView, rootContext, opts.hostFeatures || null);
    addToViewTree(rootView, componentView);
    refreshDescendantViews(rootView);
    rootView[FLAGS] &= ~4;
    resetPreOrderHookFlags(rootView);
    refreshDescendantViews(rootView);
    safeToRunHooks = true;
  } finally {
    leaveView(oldView, safeToRunHooks);
    if (rendererFactory.end) rendererFactory.end();
  }
  return component;
}
exports.ɵrenderComponent = renderComponent;
function createRootComponentView(rNode, def, rootView, rendererFactory, renderer, sanitizer) {
  resetComponentState();
  var tView = rootView[TVIEW];
  ngDevMode && assertDataInRange(rootView, 0 + HEADER_OFFSET);
  rootView[0 + HEADER_OFFSET] = rNode;
  var tNode = getOrCreateTNode(tView, null, 0, 3, null, null);
  var componentView = createLView(rootView, getOrCreateTView(def), null, def.onPush ? 64 : 16, rootView[HEADER_OFFSET], tNode, rendererFactory, renderer, sanitizer);
  if (tView.firstTemplatePass) {
    diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, rootView), tView, def.type);
    tNode.flags = 1;
    initNodeFlags(tNode, rootView.length, 1);
    queueComponentIndexForCheck(tNode);
  }
  return rootView[HEADER_OFFSET] = componentView;
}
function createRootComponent(componentView, componentDef, rootView, rootContext, hostFeatures) {
  var tView = rootView[TVIEW];
  var component = instantiateRootComponent(tView, rootView, componentDef);
  rootContext.components.push(component);
  componentView[CONTEXT] = component;
  hostFeatures && hostFeatures.forEach(function (feature) {
    return feature(component, componentDef);
  });
  if (componentDef.contentQueries) {
    componentDef.contentQueries(1, component, rootView.length - 1);
  }
  var rootTNode = getPreviousOrParentTNode();
  if (tView.firstTemplatePass && componentDef.hostBindings) {
    var elementIndex = rootTNode.index - HEADER_OFFSET;
    setActiveHostElement(elementIndex);
    var expando = tView.expandoInstructions;
    invokeHostBindingsInCreationMode(componentDef, expando, component, rootTNode, tView.firstTemplatePass);
    setActiveHostElement(null);
  }
  return component;
}
function createRootContext(scheduler, playerHandler) {
  return {
    components: [],
    scheduler: scheduler || defaultScheduler,
    clean: CLEAN_PROMISE,
    playerHandler: playerHandler || null,
    flags: 0
  };
}
function LifecycleHooksFeature(component, def) {
  var rootTView = readPatchedLView(component)[TVIEW];
  var dirIndex = rootTView.data.length - 1;
  registerPreOrderHooks(dirIndex, def, rootTView, -1, -1, -1);
  registerPostOrderHooks(rootTView, {
    directiveStart: dirIndex,
    directiveEnd: dirIndex + 1
  });
}
exports.ɵLifecycleHooksFeature = LifecycleHooksFeature;
function whenRendered(component) {
  return getRootContext(component).clean;
}
exports.ɵwhenRendered = whenRendered;
var SimpleChange = (function () {
  function SimpleChange(previousValue, currentValue, firstChange) {
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.firstChange = firstChange;
  }
  exports.SimpleChange = SimpleChange;
  SimpleChange.prototype.isFirstChange = function () {
    return this.firstChange;
  };
  return SimpleChange;
})();
exports.SimpleChange = SimpleChange;
var PRIVATE_PREFIX = "__ngOnChanges_";
function ɵɵNgOnChangesFeature() {
  NgOnChangesFeatureImpl.ngInherit = true;
  return NgOnChangesFeatureImpl;
}
exports.ɵɵNgOnChangesFeature = ɵɵNgOnChangesFeature;
function NgOnChangesFeatureImpl(definition) {
  if (definition.type.prototype.ngOnChanges) {
    definition.setInput = ngOnChangesSetInput;
    definition.onChanges = wrapOnChanges();
  }
}
function wrapOnChanges() {
  return function wrapOnChangesHook_inPreviousChangesStorage() {
    var simpleChangesStore = getSimpleChangesStore(this);
    var current = simpleChangesStore && simpleChangesStore.current;
    if (current) {
      var previous = simpleChangesStore.previous;
      if (previous === EMPTY_OBJ) {
        simpleChangesStore.previous = current;
      } else {
        for (var key in current) {
          previous[key] = current[key];
        }
      }
      simpleChangesStore.current = null;
      this.ngOnChanges(current);
    }
  };
}
function ngOnChangesSetInput(instance, value, publicName, privateName) {
  var simpleChangesStore = getSimpleChangesStore(instance) || setSimpleChangesStore(instance, {
    previous: EMPTY_OBJ,
    current: null
  });
  var current = simpleChangesStore.current || (simpleChangesStore.current = {});
  var previous = simpleChangesStore.previous;
  var declaredName = this.declaredInputs[publicName];
  var previousChange = previous[declaredName];
  current[declaredName] = new SimpleChange(previousChange && previousChange.currentValue, value, previous === EMPTY_OBJ);
  instance[privateName] = value;
}
var SIMPLE_CHANGES_STORE = "__ngSimpleChanges__";
function getSimpleChangesStore(instance) {
  return instance[SIMPLE_CHANGES_STORE] || null;
}
function setSimpleChangesStore(instance, store) {
  return instance[SIMPLE_CHANGES_STORE] = store;
}
function getSuperType(type) {
  return Object.getPrototypeOf(type.prototype).constructor;
}
function ɵɵInheritDefinitionFeature(definition) {
  var e_1, _a;
  var superType = getSuperType(definition.type);
  while (superType) {
    var superDef = undefined;
    if (isComponentDef(definition)) {
      superDef = superType.ngComponentDef || superType.ngDirectiveDef;
    } else {
      if (superType.ngComponentDef) {
        throw new Error("Directives cannot inherit Components");
      }
      superDef = superType.ngDirectiveDef;
    }
    var baseDef = superType.ngBaseDef;
    if (baseDef || superDef) {
      var writeableDef = definition;
      writeableDef.inputs = maybeUnwrapEmpty(definition.inputs);
      writeableDef.declaredInputs = maybeUnwrapEmpty(definition.declaredInputs);
      writeableDef.outputs = maybeUnwrapEmpty(definition.outputs);
    }
    if (baseDef) {
      var baseViewQuery = baseDef.viewQuery;
      var baseContentQueries = baseDef.contentQueries;
      var baseHostBindings = baseDef.hostBindings;
      baseHostBindings && inheritHostBindings(definition, baseHostBindings);
      baseViewQuery && inheritViewQuery(definition, baseViewQuery);
      baseContentQueries && inheritContentQueries(definition, baseContentQueries);
      fillProperties(definition.inputs, baseDef.inputs);
      fillProperties(definition.declaredInputs, baseDef.declaredInputs);
      fillProperties(definition.outputs, baseDef.outputs);
    }
    if (superDef) {
      var superHostBindings = superDef.hostBindings;
      superHostBindings && inheritHostBindings(definition, superHostBindings);
      var superViewQuery = superDef.viewQuery;
      var superContentQueries = superDef.contentQueries;
      superViewQuery && inheritViewQuery(definition, superViewQuery);
      superContentQueries && inheritContentQueries(definition, superContentQueries);
      fillProperties(definition.inputs, superDef.inputs);
      fillProperties(definition.declaredInputs, superDef.declaredInputs);
      fillProperties(definition.outputs, superDef.outputs);
      definition.afterContentChecked = definition.afterContentChecked || superDef.afterContentChecked;
      definition.afterContentInit = definition.afterContentInit || superDef.afterContentInit;
      definition.afterViewChecked = definition.afterViewChecked || superDef.afterViewChecked;
      definition.afterViewInit = definition.afterViewInit || superDef.afterViewInit;
      definition.doCheck = definition.doCheck || superDef.doCheck;
      definition.onDestroy = definition.onDestroy || superDef.onDestroy;
      definition.onInit = definition.onInit || superDef.onInit;
      var features = superDef.features;
      if (features) {
        try {
          for (var features_1 = (e_1 = void 0, tslib_1.__values(features)), features_1_1 = features_1.next(); !features_1_1.done; features_1_1 = features_1.next()) {
            var feature = features_1_1.value;
            if (feature && feature.ngInherit) {
              feature(definition);
            }
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (features_1_1 && !features_1_1.done && (_a = features_1.return)) _a.call(features_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
    } else {
      var superPrototype = superType.prototype;
      if (superPrototype) {
        definition.afterContentChecked = definition.afterContentChecked || superPrototype.ngAfterContentChecked;
        definition.afterContentInit = definition.afterContentInit || superPrototype.ngAfterContentInit;
        definition.afterViewChecked = definition.afterViewChecked || superPrototype.ngAfterViewChecked;
        definition.afterViewInit = definition.afterViewInit || superPrototype.ngAfterViewInit;
        definition.doCheck = definition.doCheck || superPrototype.ngDoCheck;
        definition.onDestroy = definition.onDestroy || superPrototype.ngOnDestroy;
        definition.onInit = definition.onInit || superPrototype.ngOnInit;
        if (superPrototype.ngOnChanges) {
          ɵɵNgOnChangesFeature()(definition);
        }
      }
    }
    superType = Object.getPrototypeOf(superType);
  }
}
exports.ɵɵInheritDefinitionFeature = ɵɵInheritDefinitionFeature;
function maybeUnwrapEmpty(value) {
  if (value === EMPTY_OBJ) {
    return {};
  } else if (value === EMPTY_ARRAY) {
    return [];
  } else {
    return value;
  }
}
function inheritViewQuery(definition, superViewQuery) {
  var prevViewQuery = definition.viewQuery;
  if (prevViewQuery) {
    definition.viewQuery = function (rf, ctx) {
      superViewQuery(rf, ctx);
      prevViewQuery(rf, ctx);
    };
  } else {
    definition.viewQuery = superViewQuery;
  }
}
function inheritContentQueries(definition, superContentQueries) {
  var prevContentQueries = definition.contentQueries;
  if (prevContentQueries) {
    definition.contentQueries = function (rf, ctx, directiveIndex) {
      superContentQueries(rf, ctx, directiveIndex);
      prevContentQueries(rf, ctx, directiveIndex);
    };
  } else {
    definition.contentQueries = superContentQueries;
  }
}
function inheritHostBindings(definition, superHostBindings) {
  var prevHostBindings = definition.hostBindings;
  if (superHostBindings !== prevHostBindings) {
    if (prevHostBindings) {
      definition.hostBindings = function (rf, ctx, elementIndex) {
        adjustActiveDirectiveSuperClassDepthPosition(1);
        try {
          superHostBindings(rf, ctx, elementIndex);
        } finally {
          adjustActiveDirectiveSuperClassDepthPosition(-1);
        }
        prevHostBindings(rf, ctx, elementIndex);
      };
    } else {
      definition.hostBindings = superHostBindings;
    }
  }
}
function providersResolver(def, providers, viewProviders) {
  var lView = getLView();
  var tView = lView[TVIEW];
  if (tView.firstTemplatePass) {
    var isComponent = isComponentDef(def);
    resolveProvider$1(viewProviders, tView.data, tView.blueprint, isComponent, true);
    resolveProvider$1(providers, tView.data, tView.blueprint, isComponent, false);
  }
}
function resolveProvider$1(provider, tInjectables, lInjectablesBlueprint, isComponent, isViewProvider) {
  provider = resolveForwardRef(provider);
  if (Array.isArray(provider)) {
    for (var i = 0; i < provider.length; i++) {
      resolveProvider$1(provider[i], tInjectables, lInjectablesBlueprint, isComponent, isViewProvider);
    }
  } else {
    var lView = getLView();
    var tView = lView[TVIEW];
    var token = isTypeProvider(provider) ? provider : resolveForwardRef(provider.provide);
    var providerFactory = providerToFactory(provider);
    var tNode = getPreviousOrParentTNode();
    var beginIndex = tNode.providerIndexes & 65535;
    var endIndex = tNode.directiveStart;
    var cptViewProvidersCount = tNode.providerIndexes >> 16;
    if (isClassProvider(provider) || isTypeProvider(provider)) {
      var prototype = (provider.useClass || provider).prototype;
      var ngOnDestroy = prototype.ngOnDestroy;
      if (ngOnDestroy) {
        (tView.destroyHooks || (tView.destroyHooks = [])).push(tInjectables.length, ngOnDestroy);
      }
    }
    if (isTypeProvider(provider) || !provider.multi) {
      var factory = new NodeInjectorFactory(providerFactory, isViewProvider, ɵɵdirectiveInject);
      var existingFactoryIndex = indexOf(token, tInjectables, isViewProvider ? beginIndex : beginIndex + cptViewProvidersCount, endIndex);
      if (existingFactoryIndex == -1) {
        diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, lView), tView, token);
        tInjectables.push(token);
        tNode.directiveStart++;
        tNode.directiveEnd++;
        if (isViewProvider) {
          tNode.providerIndexes += 65536;
        }
        lInjectablesBlueprint.push(factory);
        lView.push(factory);
      } else {
        lInjectablesBlueprint[existingFactoryIndex] = factory;
        lView[existingFactoryIndex] = factory;
      }
    } else {
      var existingProvidersFactoryIndex = indexOf(token, tInjectables, beginIndex + cptViewProvidersCount, endIndex);
      var existingViewProvidersFactoryIndex = indexOf(token, tInjectables, beginIndex, beginIndex + cptViewProvidersCount);
      var doesProvidersFactoryExist = existingProvidersFactoryIndex >= 0 && lInjectablesBlueprint[existingProvidersFactoryIndex];
      var doesViewProvidersFactoryExist = existingViewProvidersFactoryIndex >= 0 && lInjectablesBlueprint[existingViewProvidersFactoryIndex];
      if (isViewProvider && !doesViewProvidersFactoryExist || !isViewProvider && !doesProvidersFactoryExist) {
        diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, lView), tView, token);
        var factory = multiFactory(isViewProvider ? multiViewProvidersFactoryResolver : multiProvidersFactoryResolver, lInjectablesBlueprint.length, isViewProvider, isComponent, providerFactory);
        if (!isViewProvider && doesViewProvidersFactoryExist) {
          lInjectablesBlueprint[existingViewProvidersFactoryIndex].providerFactory = factory;
        }
        tInjectables.push(token);
        tNode.directiveStart++;
        tNode.directiveEnd++;
        if (isViewProvider) {
          tNode.providerIndexes += 65536;
        }
        lInjectablesBlueprint.push(factory);
        lView.push(factory);
      } else {
        multiFactoryAdd(lInjectablesBlueprint[isViewProvider ? existingViewProvidersFactoryIndex : existingProvidersFactoryIndex], providerFactory, !isViewProvider && isComponent);
      }
      if (!isViewProvider && isComponent && doesViewProvidersFactoryExist) {
        lInjectablesBlueprint[existingViewProvidersFactoryIndex].componentProviders++;
      }
    }
  }
}
function multiFactoryAdd(multiFactory, factory, isComponentProvider) {
  multiFactory.multi.push(factory);
  if (isComponentProvider) {
    multiFactory.componentProviders++;
  }
}
function indexOf(item, arr, begin, end) {
  for (var i = begin; i < end; i++) {
    if (arr[i] === item) return i;
  }
  return -1;
}
function multiProvidersFactoryResolver(_, tData, lData, tNode) {
  return multiResolve(this.multi, []);
}
function multiViewProvidersFactoryResolver(_, tData, lData, tNode) {
  var factories = this.multi;
  var result;
  if (this.providerFactory) {
    var componentCount = this.providerFactory.componentProviders;
    var multiProviders = getNodeInjectable(tData, lData, this.providerFactory.index, tNode);
    result = multiProviders.slice(0, componentCount);
    multiResolve(factories, result);
    for (var i = componentCount; i < multiProviders.length; i++) {
      result.push(multiProviders[i]);
    }
  } else {
    result = [];
    multiResolve(factories, result);
  }
  return result;
}
function multiResolve(factories, result) {
  for (var i = 0; i < factories.length; i++) {
    var factory = factories[i];
    result.push(factory());
  }
  return result;
}
function multiFactory(factoryFn, index, isViewProvider, isComponent, f) {
  var factory = new NodeInjectorFactory(factoryFn, isViewProvider, ɵɵdirectiveInject);
  factory.multi = [];
  factory.index = index;
  factory.componentProviders = 0;
  multiFactoryAdd(factory, f, isComponent && !isViewProvider);
  return factory;
}
function ɵɵProvidersFeature(providers, viewProviders) {
  if (viewProviders === void 0) {
    viewProviders = [];
  }
  return function (definition) {
    definition.providersResolver = function (def, processProvidersFn) {
      return providersResolver(def, processProvidersFn ? processProvidersFn(providers) : providers, viewProviders);
    };
  };
}
exports.ɵɵProvidersFeature = ɵɵProvidersFeature;
var ComponentRef = (function () {
  function ComponentRef() {}
  exports.ComponentRef = ComponentRef;
  return ComponentRef;
})();
exports.ComponentRef = ComponentRef;
var ComponentFactory = (function () {
  function ComponentFactory() {}
  exports.ɵComponentFactory = ComponentFactory;
  return ComponentFactory;
})();
exports.ɵComponentFactory = ComponentFactory;
function noComponentFactoryError(component) {
  var error = Error("No component factory found for " + stringify(component) + ". Did you add it to @NgModule.entryComponents?");
  error[ERROR_COMPONENT] = component;
  return error;
}
var ERROR_COMPONENT = "ngComponent";
function getComponent$1(error) {
  return error[ERROR_COMPONENT];
}
var _NullComponentFactoryResolver = (function () {
  function _NullComponentFactoryResolver() {}
  _NullComponentFactoryResolver.prototype.resolveComponentFactory = function (component) {
    throw noComponentFactoryError(component);
  };
  return _NullComponentFactoryResolver;
})();
var ComponentFactoryResolver = (function () {
  function ComponentFactoryResolver() {}
  exports.ComponentFactoryResolver = ComponentFactoryResolver;
  ComponentFactoryResolver.NULL = new _NullComponentFactoryResolver();
  return ComponentFactoryResolver;
})();
exports.ComponentFactoryResolver = ComponentFactoryResolver;
var CodegenComponentFactoryResolver = (function () {
  function CodegenComponentFactoryResolver(factories, _parent, _ngModule) {
    this._parent = _parent;
    this._ngModule = _ngModule;
    this._factories = new Map();
    for (var i = 0; i < factories.length; i++) {
      var factory = factories[i];
      this._factories.set(factory.componentType, factory);
    }
  }
  exports.ɵCodegenComponentFactoryResolver = CodegenComponentFactoryResolver;
  CodegenComponentFactoryResolver.prototype.resolveComponentFactory = function (component) {
    var factory = this._factories.get(component);
    if (!factory && this._parent) {
      factory = this._parent.resolveComponentFactory(component);
    }
    if (!factory) {
      throw noComponentFactoryError(component);
    }
    return new ComponentFactoryBoundToModule(factory, this._ngModule);
  };
  return CodegenComponentFactoryResolver;
})();
exports.ɵCodegenComponentFactoryResolver = CodegenComponentFactoryResolver;
var ComponentFactoryBoundToModule = (function (_super) {
  tslib_1.__extends(ComponentFactoryBoundToModule, _super);
  function ComponentFactoryBoundToModule(factory, ngModule) {
    var _this = _super.call(this) || this;
    _this.factory = factory;
    _this.ngModule = ngModule;
    _this.selector = factory.selector;
    _this.componentType = factory.componentType;
    _this.ngContentSelectors = factory.ngContentSelectors;
    _this.inputs = factory.inputs;
    _this.outputs = factory.outputs;
    return _this;
  }
  ComponentFactoryBoundToModule.prototype.create = function (injector, projectableNodes, rootSelectorOrNode, ngModule) {
    return this.factory.create(injector, projectableNodes, rootSelectorOrNode, ngModule || this.ngModule);
  };
  return ComponentFactoryBoundToModule;
})(ComponentFactory);
function noop() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
}
var ElementRef = (function () {
  function ElementRef(nativeElement) {
    this.nativeElement = nativeElement;
  }
  exports.ElementRef = ElementRef;
  ElementRef.__NG_ELEMENT_ID__ = function () {
    return SWITCH_ELEMENT_REF_FACTORY(ElementRef);
  };
  return ElementRef;
})();
exports.ElementRef = ElementRef;
var SWITCH_ELEMENT_REF_FACTORY__POST_R3__ = injectElementRef;
exports.ɵSWITCH_ELEMENT_REF_FACTORY__POST_R3__ = SWITCH_ELEMENT_REF_FACTORY__POST_R3__;
var SWITCH_ELEMENT_REF_FACTORY__PRE_R3__ = noop;
var SWITCH_ELEMENT_REF_FACTORY = SWITCH_ELEMENT_REF_FACTORY__PRE_R3__;
var RenderComponentType = (function () {
  function RenderComponentType(id, templateUrl, slotCount, encapsulation, styles, animations) {
    this.id = id;
    this.templateUrl = templateUrl;
    this.slotCount = slotCount;
    this.encapsulation = encapsulation;
    this.styles = styles;
    this.animations = animations;
  }
  exports.RenderComponentType = RenderComponentType;
  return RenderComponentType;
})();
exports.RenderComponentType = RenderComponentType;
var RenderDebugInfo = (function () {
  function RenderDebugInfo() {}
  exports.ɵRenderDebugInfo = RenderDebugInfo;
  return RenderDebugInfo;
})();
exports.ɵRenderDebugInfo = RenderDebugInfo;
var Renderer = (function () {
  function Renderer() {}
  exports.Renderer = Renderer;
  return Renderer;
})();
exports.Renderer = Renderer;
var Renderer2Interceptor = new InjectionToken("Renderer2Interceptor");
var RootRenderer = (function () {
  function RootRenderer() {}
  exports.RootRenderer = RootRenderer;
  return RootRenderer;
})();
exports.RootRenderer = RootRenderer;
var RendererFactory2 = (function () {
  function RendererFactory2() {}
  exports.RendererFactory2 = RendererFactory2;
  return RendererFactory2;
})();
exports.RendererFactory2 = RendererFactory2;
var RendererStyleFlags2;
exports.RendererStyleFlags2 = RendererStyleFlags2;
(function (RendererStyleFlags2) {
  RendererStyleFlags2[RendererStyleFlags2["Important"] = 1] = "Important";
  RendererStyleFlags2[RendererStyleFlags2["DashCase"] = 2] = "DashCase";
})(RendererStyleFlags2 || (RendererStyleFlags2 = {}));
var Renderer2 = (function () {
  function Renderer2() {}
  exports.Renderer2 = Renderer2;
  Renderer2.__NG_ELEMENT_ID__ = function () {
    return SWITCH_RENDERER2_FACTORY();
  };
  return Renderer2;
})();
exports.Renderer2 = Renderer2;
var SWITCH_RENDERER2_FACTORY__POST_R3__ = injectRenderer2;
exports.ɵSWITCH_RENDERER2_FACTORY__POST_R3__ = SWITCH_RENDERER2_FACTORY__POST_R3__;
var SWITCH_RENDERER2_FACTORY__PRE_R3__ = noop;
var SWITCH_RENDERER2_FACTORY = SWITCH_RENDERER2_FACTORY__PRE_R3__;
var Version = (function () {
  function Version(full) {
    this.full = full;
    this.major = full.split(".")[0];
    this.minor = full.split(".")[1];
    this.patch = full.split(".").slice(2).join(".");
  }
  exports.Version = Version;
  return Version;
})();
exports.Version = Version;
var VERSION = new Version("8.2.4");
exports.VERSION = VERSION;
var DefaultIterableDifferFactory = (function () {
  function DefaultIterableDifferFactory() {}
  exports.ɵangular_packages_core_core_l = DefaultIterableDifferFactory;
  DefaultIterableDifferFactory.prototype.supports = function (obj) {
    return isListLikeIterable$1(obj);
  };
  DefaultIterableDifferFactory.prototype.create = function (trackByFn) {
    return new DefaultIterableDiffer(trackByFn);
  };
  return DefaultIterableDifferFactory;
})();
exports.ɵangular_packages_core_core_l = DefaultIterableDifferFactory;
var trackByIdentity = function (index, item) {
  return item;
};
var ɵ0$d = trackByIdentity;
var DefaultIterableDiffer = (function () {
  function DefaultIterableDiffer(trackByFn) {
    this.length = 0;
    this._linkedRecords = null;
    this._unlinkedRecords = null;
    this._previousItHead = null;
    this._itHead = null;
    this._itTail = null;
    this._additionsHead = null;
    this._additionsTail = null;
    this._movesHead = null;
    this._movesTail = null;
    this._removalsHead = null;
    this._removalsTail = null;
    this._identityChangesHead = null;
    this._identityChangesTail = null;
    this._trackByFn = trackByFn || trackByIdentity;
  }
  exports.DefaultIterableDiffer = DefaultIterableDiffer;
  DefaultIterableDiffer.prototype.forEachItem = function (fn) {
    var record;
    for (record = this._itHead; record !== null; record = record._next) {
      fn(record);
    }
  };
  DefaultIterableDiffer.prototype.forEachOperation = function (fn) {
    var nextIt = this._itHead;
    var nextRemove = this._removalsHead;
    var addRemoveOffset = 0;
    var moveOffsets = null;
    while (nextIt || nextRemove) {
      var record = !nextRemove || nextIt && nextIt.currentIndex < getPreviousIndex(nextRemove, addRemoveOffset, moveOffsets) ? nextIt : nextRemove;
      var adjPreviousIndex = getPreviousIndex(record, addRemoveOffset, moveOffsets);
      var currentIndex = record.currentIndex;
      if (record === nextRemove) {
        addRemoveOffset--;
        nextRemove = nextRemove._nextRemoved;
      } else {
        nextIt = nextIt._next;
        if (record.previousIndex == null) {
          addRemoveOffset++;
        } else {
          if (!moveOffsets) moveOffsets = [];
          var localMovePreviousIndex = adjPreviousIndex - addRemoveOffset;
          var localCurrentIndex = currentIndex - addRemoveOffset;
          if (localMovePreviousIndex != localCurrentIndex) {
            for (var i = 0; i < localMovePreviousIndex; i++) {
              var offset = i < moveOffsets.length ? moveOffsets[i] : moveOffsets[i] = 0;
              var index = offset + i;
              if (localCurrentIndex <= index && index < localMovePreviousIndex) {
                moveOffsets[i] = offset + 1;
              }
            }
            var previousIndex = record.previousIndex;
            moveOffsets[previousIndex] = localCurrentIndex - localMovePreviousIndex;
          }
        }
      }
      if (adjPreviousIndex !== currentIndex) {
        fn(record, adjPreviousIndex, currentIndex);
      }
    }
  };
  DefaultIterableDiffer.prototype.forEachPreviousItem = function (fn) {
    var record;
    for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
      fn(record);
    }
  };
  DefaultIterableDiffer.prototype.forEachAddedItem = function (fn) {
    var record;
    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
      fn(record);
    }
  };
  DefaultIterableDiffer.prototype.forEachMovedItem = function (fn) {
    var record;
    for (record = this._movesHead; record !== null; record = record._nextMoved) {
      fn(record);
    }
  };
  DefaultIterableDiffer.prototype.forEachRemovedItem = function (fn) {
    var record;
    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
      fn(record);
    }
  };
  DefaultIterableDiffer.prototype.forEachIdentityChange = function (fn) {
    var record;
    for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
      fn(record);
    }
  };
  DefaultIterableDiffer.prototype.diff = function (collection) {
    if (collection == null) collection = [];
    if (!isListLikeIterable$1(collection)) {
      throw new Error("Error trying to diff '" + stringify(collection) + "'. Only arrays and iterables are allowed");
    }
    if (this.check(collection)) {
      return this;
    } else {
      return null;
    }
  };
  DefaultIterableDiffer.prototype.onDestroy = function () {};
  DefaultIterableDiffer.prototype.check = function (collection) {
    var _this = this;
    this._reset();
    var record = this._itHead;
    var mayBeDirty = false;
    var index;
    var item;
    var itemTrackBy;
    if (Array.isArray(collection)) {
      this.length = collection.length;
      for (var index_1 = 0; index_1 < this.length; index_1++) {
        item = collection[index_1];
        itemTrackBy = this._trackByFn(index_1, item);
        if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
          record = this._mismatch(record, item, itemTrackBy, index_1);
          mayBeDirty = true;
        } else {
          if (mayBeDirty) {
            record = this._verifyReinsertion(record, item, itemTrackBy, index_1);
          }
          if (!looseIdentical(record.item, item)) this._addIdentityChange(record, item);
        }
        record = record._next;
      }
    } else {
      index = 0;
      iterateListLike$1(collection, function (item) {
        itemTrackBy = _this._trackByFn(index, item);
        if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
          record = _this._mismatch(record, item, itemTrackBy, index);
          mayBeDirty = true;
        } else {
          if (mayBeDirty) {
            record = _this._verifyReinsertion(record, item, itemTrackBy, index);
          }
          if (!looseIdentical(record.item, item)) _this._addIdentityChange(record, item);
        }
        record = record._next;
        index++;
      });
      this.length = index;
    }
    this._truncate(record);
    this.collection = collection;
    return this.isDirty;
  };
  Object.defineProperty(DefaultIterableDiffer.prototype, "isDirty", {
    get: function () {
      return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null;
    },
    enumerable: true,
    configurable: true
  });
  DefaultIterableDiffer.prototype._reset = function () {
    if (this.isDirty) {
      var record = void 0;
      var nextRecord = void 0;
      for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
        record._nextPrevious = record._next;
      }
      for (record = this._additionsHead; record !== null; record = record._nextAdded) {
        record.previousIndex = record.currentIndex;
      }
      this._additionsHead = this._additionsTail = null;
      for (record = this._movesHead; record !== null; record = nextRecord) {
        record.previousIndex = record.currentIndex;
        nextRecord = record._nextMoved;
      }
      this._movesHead = this._movesTail = null;
      this._removalsHead = this._removalsTail = null;
      this._identityChangesHead = this._identityChangesTail = null;
    }
  };
  DefaultIterableDiffer.prototype._mismatch = function (record, item, itemTrackBy, index) {
    var previousRecord;
    if (record === null) {
      previousRecord = this._itTail;
    } else {
      previousRecord = record._prev;
      this._remove(record);
    }
    record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
    if (record !== null) {
      if (!looseIdentical(record.item, item)) this._addIdentityChange(record, item);
      this._moveAfter(record, previousRecord, index);
    } else {
      record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy, null);
      if (record !== null) {
        if (!looseIdentical(record.item, item)) this._addIdentityChange(record, item);
        this._reinsertAfter(record, previousRecord, index);
      } else {
        record = this._addAfter(new IterableChangeRecord_(item, itemTrackBy), previousRecord, index);
      }
    }
    return record;
  };
  DefaultIterableDiffer.prototype._verifyReinsertion = function (record, item, itemTrackBy, index) {
    var reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy, null);
    if (reinsertRecord !== null) {
      record = this._reinsertAfter(reinsertRecord, record._prev, index);
    } else if (record.currentIndex != index) {
      record.currentIndex = index;
      this._addToMoves(record, index);
    }
    return record;
  };
  DefaultIterableDiffer.prototype._truncate = function (record) {
    while (record !== null) {
      var nextRecord = record._next;
      this._addToRemovals(this._unlink(record));
      record = nextRecord;
    }
    if (this._unlinkedRecords !== null) {
      this._unlinkedRecords.clear();
    }
    if (this._additionsTail !== null) {
      this._additionsTail._nextAdded = null;
    }
    if (this._movesTail !== null) {
      this._movesTail._nextMoved = null;
    }
    if (this._itTail !== null) {
      this._itTail._next = null;
    }
    if (this._removalsTail !== null) {
      this._removalsTail._nextRemoved = null;
    }
    if (this._identityChangesTail !== null) {
      this._identityChangesTail._nextIdentityChange = null;
    }
  };
  DefaultIterableDiffer.prototype._reinsertAfter = function (record, prevRecord, index) {
    if (this._unlinkedRecords !== null) {
      this._unlinkedRecords.remove(record);
    }
    var prev = record._prevRemoved;
    var next = record._nextRemoved;
    if (prev === null) {
      this._removalsHead = next;
    } else {
      prev._nextRemoved = next;
    }
    if (next === null) {
      this._removalsTail = prev;
    } else {
      next._prevRemoved = prev;
    }
    this._insertAfter(record, prevRecord, index);
    this._addToMoves(record, index);
    return record;
  };
  DefaultIterableDiffer.prototype._moveAfter = function (record, prevRecord, index) {
    this._unlink(record);
    this._insertAfter(record, prevRecord, index);
    this._addToMoves(record, index);
    return record;
  };
  DefaultIterableDiffer.prototype._addAfter = function (record, prevRecord, index) {
    this._insertAfter(record, prevRecord, index);
    if (this._additionsTail === null) {
      this._additionsTail = this._additionsHead = record;
    } else {
      this._additionsTail = this._additionsTail._nextAdded = record;
    }
    return record;
  };
  DefaultIterableDiffer.prototype._insertAfter = function (record, prevRecord, index) {
    var next = prevRecord === null ? this._itHead : prevRecord._next;
    record._next = next;
    record._prev = prevRecord;
    if (next === null) {
      this._itTail = record;
    } else {
      next._prev = record;
    }
    if (prevRecord === null) {
      this._itHead = record;
    } else {
      prevRecord._next = record;
    }
    if (this._linkedRecords === null) {
      this._linkedRecords = new _DuplicateMap();
    }
    this._linkedRecords.put(record);
    record.currentIndex = index;
    return record;
  };
  DefaultIterableDiffer.prototype._remove = function (record) {
    return this._addToRemovals(this._unlink(record));
  };
  DefaultIterableDiffer.prototype._unlink = function (record) {
    if (this._linkedRecords !== null) {
      this._linkedRecords.remove(record);
    }
    var prev = record._prev;
    var next = record._next;
    if (prev === null) {
      this._itHead = next;
    } else {
      prev._next = next;
    }
    if (next === null) {
      this._itTail = prev;
    } else {
      next._prev = prev;
    }
    return record;
  };
  DefaultIterableDiffer.prototype._addToMoves = function (record, toIndex) {
    if (record.previousIndex === toIndex) {
      return record;
    }
    if (this._movesTail === null) {
      this._movesTail = this._movesHead = record;
    } else {
      this._movesTail = this._movesTail._nextMoved = record;
    }
    return record;
  };
  DefaultIterableDiffer.prototype._addToRemovals = function (record) {
    if (this._unlinkedRecords === null) {
      this._unlinkedRecords = new _DuplicateMap();
    }
    this._unlinkedRecords.put(record);
    record.currentIndex = null;
    record._nextRemoved = null;
    if (this._removalsTail === null) {
      this._removalsTail = this._removalsHead = record;
      record._prevRemoved = null;
    } else {
      record._prevRemoved = this._removalsTail;
      this._removalsTail = this._removalsTail._nextRemoved = record;
    }
    return record;
  };
  DefaultIterableDiffer.prototype._addIdentityChange = function (record, item) {
    record.item = item;
    if (this._identityChangesTail === null) {
      this._identityChangesTail = this._identityChangesHead = record;
    } else {
      this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
    }
    return record;
  };
  return DefaultIterableDiffer;
})();
exports.DefaultIterableDiffer = DefaultIterableDiffer;
var IterableChangeRecord_ = (function () {
  function IterableChangeRecord_(item, trackById) {
    this.item = item;
    this.trackById = trackById;
    this.currentIndex = null;
    this.previousIndex = null;
    this._nextPrevious = null;
    this._prev = null;
    this._next = null;
    this._prevDup = null;
    this._nextDup = null;
    this._prevRemoved = null;
    this._nextRemoved = null;
    this._nextAdded = null;
    this._nextMoved = null;
    this._nextIdentityChange = null;
  }
  return IterableChangeRecord_;
})();
var _DuplicateItemRecordList = (function () {
  function _DuplicateItemRecordList() {
    this._head = null;
    this._tail = null;
  }
  _DuplicateItemRecordList.prototype.add = function (record) {
    if (this._head === null) {
      this._head = this._tail = record;
      record._nextDup = null;
      record._prevDup = null;
    } else {
      this._tail._nextDup = record;
      record._prevDup = this._tail;
      record._nextDup = null;
      this._tail = record;
    }
  };
  _DuplicateItemRecordList.prototype.get = function (trackById, atOrAfterIndex) {
    var record;
    for (record = this._head; record !== null; record = record._nextDup) {
      if ((atOrAfterIndex === null || atOrAfterIndex <= record.currentIndex) && looseIdentical(record.trackById, trackById)) {
        return record;
      }
    }
    return null;
  };
  _DuplicateItemRecordList.prototype.remove = function (record) {
    var prev = record._prevDup;
    var next = record._nextDup;
    if (prev === null) {
      this._head = next;
    } else {
      prev._nextDup = next;
    }
    if (next === null) {
      this._tail = prev;
    } else {
      next._prevDup = prev;
    }
    return this._head === null;
  };
  return _DuplicateItemRecordList;
})();
var _DuplicateMap = (function () {
  function _DuplicateMap() {
    this.map = new Map();
  }
  _DuplicateMap.prototype.put = function (record) {
    var key = record.trackById;
    var duplicates = this.map.get(key);
    if (!duplicates) {
      duplicates = new _DuplicateItemRecordList();
      this.map.set(key, duplicates);
    }
    duplicates.add(record);
  };
  _DuplicateMap.prototype.get = function (trackById, atOrAfterIndex) {
    var key = trackById;
    var recordList = this.map.get(key);
    return recordList ? recordList.get(trackById, atOrAfterIndex) : null;
  };
  _DuplicateMap.prototype.remove = function (record) {
    var key = record.trackById;
    var recordList = this.map.get(key);
    if (recordList.remove(record)) {
      this.map.delete(key);
    }
    return record;
  };
  Object.defineProperty(_DuplicateMap.prototype, "isEmpty", {
    get: function () {
      return this.map.size === 0;
    },
    enumerable: true,
    configurable: true
  });
  _DuplicateMap.prototype.clear = function () {
    this.map.clear();
  };
  return _DuplicateMap;
})();
function getPreviousIndex(item, addRemoveOffset, moveOffsets) {
  var previousIndex = item.previousIndex;
  if (previousIndex === null) return previousIndex;
  var moveOffset = 0;
  if (moveOffsets && previousIndex < moveOffsets.length) {
    moveOffset = moveOffsets[previousIndex];
  }
  return previousIndex + addRemoveOffset + moveOffset;
}
var DefaultKeyValueDifferFactory = (function () {
  function DefaultKeyValueDifferFactory() {}
  exports.ɵangular_packages_core_core_m = DefaultKeyValueDifferFactory;
  DefaultKeyValueDifferFactory.prototype.supports = function (obj) {
    return obj instanceof Map || isJsObject$1(obj);
  };
  DefaultKeyValueDifferFactory.prototype.create = function () {
    return new DefaultKeyValueDiffer();
  };
  return DefaultKeyValueDifferFactory;
})();
exports.ɵangular_packages_core_core_m = DefaultKeyValueDifferFactory;
var DefaultKeyValueDiffer = (function () {
  function DefaultKeyValueDiffer() {
    this._records = new Map();
    this._mapHead = null;
    this._appendAfter = null;
    this._previousMapHead = null;
    this._changesHead = null;
    this._changesTail = null;
    this._additionsHead = null;
    this._additionsTail = null;
    this._removalsHead = null;
    this._removalsTail = null;
  }
  Object.defineProperty(DefaultKeyValueDiffer.prototype, "isDirty", {
    get: function () {
      return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null;
    },
    enumerable: true,
    configurable: true
  });
  DefaultKeyValueDiffer.prototype.forEachItem = function (fn) {
    var record;
    for (record = this._mapHead; record !== null; record = record._next) {
      fn(record);
    }
  };
  DefaultKeyValueDiffer.prototype.forEachPreviousItem = function (fn) {
    var record;
    for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
      fn(record);
    }
  };
  DefaultKeyValueDiffer.prototype.forEachChangedItem = function (fn) {
    var record;
    for (record = this._changesHead; record !== null; record = record._nextChanged) {
      fn(record);
    }
  };
  DefaultKeyValueDiffer.prototype.forEachAddedItem = function (fn) {
    var record;
    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
      fn(record);
    }
  };
  DefaultKeyValueDiffer.prototype.forEachRemovedItem = function (fn) {
    var record;
    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
      fn(record);
    }
  };
  DefaultKeyValueDiffer.prototype.diff = function (map) {
    if (!map) {
      map = new Map();
    } else if (!(map instanceof Map || isJsObject$1(map))) {
      throw new Error("Error trying to diff '" + stringify(map) + "'. Only maps and objects are allowed");
    }
    return this.check(map) ? this : null;
  };
  DefaultKeyValueDiffer.prototype.onDestroy = function () {};
  DefaultKeyValueDiffer.prototype.check = function (map) {
    var _this = this;
    this._reset();
    var insertBefore = this._mapHead;
    this._appendAfter = null;
    this._forEach(map, function (value, key) {
      if (insertBefore && insertBefore.key === key) {
        _this._maybeAddToChanges(insertBefore, value);
        _this._appendAfter = insertBefore;
        insertBefore = insertBefore._next;
      } else {
        var record = _this._getOrCreateRecordForKey(key, value);
        insertBefore = _this._insertBeforeOrAppend(insertBefore, record);
      }
    });
    if (insertBefore) {
      if (insertBefore._prev) {
        insertBefore._prev._next = null;
      }
      this._removalsHead = insertBefore;
      for (var record = insertBefore; record !== null; record = record._nextRemoved) {
        if (record === this._mapHead) {
          this._mapHead = null;
        }
        this._records.delete(record.key);
        record._nextRemoved = record._next;
        record.previousValue = record.currentValue;
        record.currentValue = null;
        record._prev = null;
        record._next = null;
      }
    }
    if (this._changesTail) this._changesTail._nextChanged = null;
    if (this._additionsTail) this._additionsTail._nextAdded = null;
    return this.isDirty;
  };
  DefaultKeyValueDiffer.prototype._insertBeforeOrAppend = function (before, record) {
    if (before) {
      var prev = before._prev;
      record._next = before;
      record._prev = prev;
      before._prev = record;
      if (prev) {
        prev._next = record;
      }
      if (before === this._mapHead) {
        this._mapHead = record;
      }
      this._appendAfter = before;
      return before;
    }
    if (this._appendAfter) {
      this._appendAfter._next = record;
      record._prev = this._appendAfter;
    } else {
      this._mapHead = record;
    }
    this._appendAfter = record;
    return null;
  };
  DefaultKeyValueDiffer.prototype._getOrCreateRecordForKey = function (key, value) {
    if (this._records.has(key)) {
      var record_1 = this._records.get(key);
      this._maybeAddToChanges(record_1, value);
      var prev = record_1._prev;
      var next = record_1._next;
      if (prev) {
        prev._next = next;
      }
      if (next) {
        next._prev = prev;
      }
      record_1._next = null;
      record_1._prev = null;
      return record_1;
    }
    var record = new KeyValueChangeRecord_(key);
    this._records.set(key, record);
    record.currentValue = value;
    this._addToAdditions(record);
    return record;
  };
  DefaultKeyValueDiffer.prototype._reset = function () {
    if (this.isDirty) {
      var record = void 0;
      this._previousMapHead = this._mapHead;
      for (record = this._previousMapHead; record !== null; record = record._next) {
        record._nextPrevious = record._next;
      }
      for (record = this._changesHead; record !== null; record = record._nextChanged) {
        record.previousValue = record.currentValue;
      }
      for (record = this._additionsHead; record != null; record = record._nextAdded) {
        record.previousValue = record.currentValue;
      }
      this._changesHead = this._changesTail = null;
      this._additionsHead = this._additionsTail = null;
      this._removalsHead = null;
    }
  };
  DefaultKeyValueDiffer.prototype._maybeAddToChanges = function (record, newValue) {
    if (!looseIdentical(newValue, record.currentValue)) {
      record.previousValue = record.currentValue;
      record.currentValue = newValue;
      this._addToChanges(record);
    }
  };
  DefaultKeyValueDiffer.prototype._addToAdditions = function (record) {
    if (this._additionsHead === null) {
      this._additionsHead = this._additionsTail = record;
    } else {
      this._additionsTail._nextAdded = record;
      this._additionsTail = record;
    }
  };
  DefaultKeyValueDiffer.prototype._addToChanges = function (record) {
    if (this._changesHead === null) {
      this._changesHead = this._changesTail = record;
    } else {
      this._changesTail._nextChanged = record;
      this._changesTail = record;
    }
  };
  DefaultKeyValueDiffer.prototype._forEach = function (obj, fn) {
    if (obj instanceof Map) {
      obj.forEach(fn);
    } else {
      Object.keys(obj).forEach(function (k) {
        return fn(obj[k], k);
      });
    }
  };
  return DefaultKeyValueDiffer;
})();
var KeyValueChangeRecord_ = (function () {
  function KeyValueChangeRecord_(key) {
    this.key = key;
    this.previousValue = null;
    this.currentValue = null;
    this._nextPrevious = null;
    this._next = null;
    this._prev = null;
    this._nextAdded = null;
    this._nextRemoved = null;
    this._nextChanged = null;
  }
  return KeyValueChangeRecord_;
})();
var IterableDiffers = (function () {
  function IterableDiffers(factories) {
    this.factories = factories;
  }
  exports.IterableDiffers = IterableDiffers;
  IterableDiffers.create = function (factories, parent) {
    if (parent != null) {
      var copied = parent.factories.slice();
      factories = factories.concat(copied);
    }
    return new IterableDiffers(factories);
  };
  IterableDiffers.extend = function (factories) {
    return {
      provide: IterableDiffers,
      useFactory: function (parent) {
        if (!parent) {
          throw new Error("Cannot extend IterableDiffers without a parent injector");
        }
        return IterableDiffers.create(factories, parent);
      },
      deps: [[IterableDiffers, new SkipSelf(), new Optional()]]
    };
  };
  IterableDiffers.prototype.find = function (iterable) {
    var factory = this.factories.find(function (f) {
      return f.supports(iterable);
    });
    if (factory != null) {
      return factory;
    } else {
      throw new Error("Cannot find a differ supporting object '" + iterable + "' of type '" + getTypeNameForDebugging(iterable) + "'");
    }
  };
  IterableDiffers.ngInjectableDef = ɵɵdefineInjectable({
    token: IterableDiffers,
    providedIn: "root",
    factory: function () {
      return new IterableDiffers([new DefaultIterableDifferFactory()]);
    }
  });
  return IterableDiffers;
})();
exports.IterableDiffers = IterableDiffers;
function getTypeNameForDebugging(type) {
  return type["name"] || typeof type;
}
var KeyValueDiffers = (function () {
  function KeyValueDiffers(factories) {
    this.factories = factories;
  }
  exports.KeyValueDiffers = KeyValueDiffers;
  KeyValueDiffers.create = function (factories, parent) {
    if (parent) {
      var copied = parent.factories.slice();
      factories = factories.concat(copied);
    }
    return new KeyValueDiffers(factories);
  };
  KeyValueDiffers.extend = function (factories) {
    return {
      provide: KeyValueDiffers,
      useFactory: function (parent) {
        if (!parent) {
          throw new Error("Cannot extend KeyValueDiffers without a parent injector");
        }
        return KeyValueDiffers.create(factories, parent);
      },
      deps: [[KeyValueDiffers, new SkipSelf(), new Optional()]]
    };
  };
  KeyValueDiffers.prototype.find = function (kv) {
    var factory = this.factories.find(function (f) {
      return f.supports(kv);
    });
    if (factory) {
      return factory;
    }
    throw new Error("Cannot find a differ supporting object '" + kv + "'");
  };
  KeyValueDiffers.ngInjectableDef = ɵɵdefineInjectable({
    token: KeyValueDiffers,
    providedIn: "root",
    factory: function () {
      return new KeyValueDiffers([new DefaultKeyValueDifferFactory()]);
    }
  });
  return KeyValueDiffers;
})();
exports.KeyValueDiffers = KeyValueDiffers;
var keyValDiff = [new DefaultKeyValueDifferFactory()];
var iterableDiff = [new DefaultIterableDifferFactory()];
var defaultIterableDiffers = new IterableDiffers(iterableDiff);
exports.ɵdefaultIterableDiffers = defaultIterableDiffers;
var defaultKeyValueDiffers = new KeyValueDiffers(keyValDiff);
exports.ɵdefaultKeyValueDiffers = defaultKeyValueDiffers;
var TemplateRef = (function () {
  function TemplateRef() {}
  exports.TemplateRef = TemplateRef;
  TemplateRef.__NG_ELEMENT_ID__ = function () {
    return SWITCH_TEMPLATE_REF_FACTORY(TemplateRef, ElementRef);
  };
  return TemplateRef;
})();
exports.TemplateRef = TemplateRef;
var SWITCH_TEMPLATE_REF_FACTORY__POST_R3__ = injectTemplateRef;
exports.ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__ = SWITCH_TEMPLATE_REF_FACTORY__POST_R3__;
var SWITCH_TEMPLATE_REF_FACTORY__PRE_R3__ = noop;
var SWITCH_TEMPLATE_REF_FACTORY = SWITCH_TEMPLATE_REF_FACTORY__PRE_R3__;
var ViewContainerRef = (function () {
  function ViewContainerRef() {}
  exports.ViewContainerRef = ViewContainerRef;
  ViewContainerRef.__NG_ELEMENT_ID__ = function () {
    return SWITCH_VIEW_CONTAINER_REF_FACTORY(ViewContainerRef, ElementRef);
  };
  return ViewContainerRef;
})();
exports.ViewContainerRef = ViewContainerRef;
var SWITCH_VIEW_CONTAINER_REF_FACTORY__POST_R3__ = injectViewContainerRef;
exports.ɵSWITCH_VIEW_CONTAINER_REF_FACTORY__POST_R3__ = SWITCH_VIEW_CONTAINER_REF_FACTORY__POST_R3__;
var SWITCH_VIEW_CONTAINER_REF_FACTORY__PRE_R3__ = noop;
var SWITCH_VIEW_CONTAINER_REF_FACTORY = SWITCH_VIEW_CONTAINER_REF_FACTORY__PRE_R3__;
function expressionChangedAfterItHasBeenCheckedError(context, oldValue, currValue, isFirstCheck) {
  var msg = "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: '" + oldValue + "'. Current value: '" + currValue + "'.";
  if (isFirstCheck) {
    msg += " It seems like the view has been created after its parent and its children have been dirty checked." + " Has it been created in a change detection hook ?";
  }
  return viewDebugError(msg, context);
}
function viewWrappedDebugError(err, context) {
  if (!(err instanceof Error)) {
    err = new Error(err.toString());
  }
  _addDebugContext(err, context);
  return err;
}
function viewDebugError(msg, context) {
  var err = new Error(msg);
  _addDebugContext(err, context);
  return err;
}
function _addDebugContext(err, context) {
  err[ERROR_DEBUG_CONTEXT] = context;
  err[ERROR_LOGGER] = context.logError.bind(context);
}
function isViewDebugError(err) {
  return !!getDebugContext(err);
}
function viewDestroyedError(action) {
  return new Error("ViewDestroyedError: Attempt to use a destroyed view: " + action);
}
function shiftInitState(view, priorInitState, newInitState) {
  var state = view.state;
  var initState = state & 1792;
  if (initState === priorInitState) {
    view.state = state & ~1792 | newInitState;
    view.initIndex = -1;
    return true;
  }
  return initState === newInitState;
}
function shouldCallLifecycleInitHook(view, initState, index) {
  if ((view.state & 1792) === initState && view.initIndex <= index) {
    view.initIndex = index + 1;
    return true;
  }
  return false;
}
var NodeData = (function () {
  function NodeData() {}
  return NodeData;
})();
function asTextData(view, index) {
  return view.nodes[index];
}
function asElementData(view, index) {
  return view.nodes[index];
}
function asProviderData(view, index) {
  return view.nodes[index];
}
function asPureExpressionData(view, index) {
  return view.nodes[index];
}
function asQueryList(view, index) {
  return view.nodes[index];
}
var DebugContext = (function () {
  function DebugContext() {}
  exports.ɵangular_packages_core_core_z = DebugContext;
  return DebugContext;
})();
exports.ɵangular_packages_core_core_z = DebugContext;
var Services = {
  setCurrentNode: undefined,
  createRootView: undefined,
  createEmbeddedView: undefined,
  createComponentView: undefined,
  createNgModuleRef: undefined,
  overrideProvider: undefined,
  overrideComponentView: undefined,
  clearOverrides: undefined,
  checkAndUpdateView: undefined,
  checkNoChangesView: undefined,
  destroyView: undefined,
  resolveDep: undefined,
  createDebugContext: undefined,
  handleEvent: undefined,
  updateDirectives: undefined,
  updateRenderer: undefined,
  dirtyParentQueries: undefined
};
var NOOP = function () {};
var _tokenKeyCache = new Map();
function tokenKey(token) {
  var key = _tokenKeyCache.get(token);
  if (!key) {
    key = stringify(token) + "_" + _tokenKeyCache.size;
    _tokenKeyCache.set(token, key);
  }
  return key;
}
function unwrapValue(view, nodeIdx, bindingIdx, value) {
  if (WrappedValue.isWrapped(value)) {
    value = WrappedValue.unwrap(value);
    var globalBindingIdx = view.def.nodes[nodeIdx].bindingIndex + bindingIdx;
    var oldValue = WrappedValue.unwrap(view.oldValues[globalBindingIdx]);
    view.oldValues[globalBindingIdx] = new WrappedValue(oldValue);
  }
  return value;
}
exports.ɵunv = unwrapValue;
var UNDEFINED_RENDERER_TYPE_ID = "$$undefined";
var EMPTY_RENDERER_TYPE_ID = "$$empty";
function createRendererType2(values) {
  return {
    id: UNDEFINED_RENDERER_TYPE_ID,
    styles: values.styles,
    encapsulation: values.encapsulation,
    data: values.data
  };
}
exports.ɵcrt = createRendererType2;
var _renderCompCount$1 = 0;
function resolveRendererType2(type) {
  if (type && type.id === UNDEFINED_RENDERER_TYPE_ID) {
    var isFilled = type.encapsulation != null && type.encapsulation !== ViewEncapsulation.None || type.styles.length || Object.keys(type.data).length;
    if (isFilled) {
      type.id = "c" + _renderCompCount$1++;
    } else {
      type.id = EMPTY_RENDERER_TYPE_ID;
    }
  }
  if (type && type.id === EMPTY_RENDERER_TYPE_ID) {
    type = null;
  }
  return type || null;
}
function checkBinding(view, def, bindingIdx, value) {
  var oldValues = view.oldValues;
  if (view.state & 2 || !looseIdentical(oldValues[def.bindingIndex + bindingIdx], value)) {
    return true;
  }
  return false;
}
function checkAndUpdateBinding(view, def, bindingIdx, value) {
  if (checkBinding(view, def, bindingIdx, value)) {
    view.oldValues[def.bindingIndex + bindingIdx] = value;
    return true;
  }
  return false;
}
function checkBindingNoChanges(view, def, bindingIdx, value) {
  var oldValue = view.oldValues[def.bindingIndex + bindingIdx];
  if (view.state & 1 || !devModeEqual$1(oldValue, value)) {
    var bindingName = def.bindings[bindingIdx].name;
    throw expressionChangedAfterItHasBeenCheckedError(Services.createDebugContext(view, def.nodeIndex), bindingName + ": " + oldValue, bindingName + ": " + value, (view.state & 1) !== 0);
  }
}
function markParentViewsForCheck(view) {
  var currView = view;
  while (currView) {
    if (currView.def.flags & 2) {
      currView.state |= 8;
    }
    currView = currView.viewContainerParent || currView.parent;
  }
}
function markParentViewsForCheckProjectedViews(view, endView) {
  var currView = view;
  while (currView && currView !== endView) {
    currView.state |= 64;
    currView = currView.viewContainerParent || currView.parent;
  }
}
function dispatchEvent(view, nodeIndex, eventName, event) {
  try {
    var nodeDef = view.def.nodes[nodeIndex];
    var startView = nodeDef.flags & 33554432 ? asElementData(view, nodeIndex).componentView : view;
    markParentViewsForCheck(startView);
    return Services.handleEvent(view, nodeIndex, eventName, event);
  } catch (e) {
    view.root.errorHandler.handleError(e);
  }
}
function declaredViewContainer(view) {
  if (view.parent) {
    var parentView = view.parent;
    return asElementData(parentView, view.parentNodeDef.nodeIndex);
  }
  return null;
}
function viewParentEl(view) {
  var parentView = view.parent;
  if (parentView) {
    return view.parentNodeDef.parent;
  } else {
    return null;
  }
}
function renderNode(view, def) {
  switch (def.flags & 201347067) {
    case 1:
      return asElementData(view, def.nodeIndex).renderElement;
    case 2:
      return asTextData(view, def.nodeIndex).renderText;
  }
}
function elementEventFullName(target, name) {
  return target ? target + ":" + name : name;
}
function isComponentView(view) {
  return !!view.parent && !!(view.parentNodeDef.flags & 32768);
}
function isEmbeddedView(view) {
  return !!view.parent && !(view.parentNodeDef.flags & 32768);
}
function filterQueryId(queryId) {
  return 1 << queryId % 32;
}
function splitMatchedQueriesDsl(matchedQueriesDsl) {
  var matchedQueries = {};
  var matchedQueryIds = 0;
  var references = {};
  if (matchedQueriesDsl) {
    matchedQueriesDsl.forEach(function (_a) {
      var _b = tslib_1.__read(_a, 2), queryId = _b[0], valueType = _b[1];
      if (typeof queryId === "number") {
        matchedQueries[queryId] = valueType;
        matchedQueryIds |= filterQueryId(queryId);
      } else {
        references[queryId] = valueType;
      }
    });
  }
  return {
    matchedQueries: matchedQueries,
    references: references,
    matchedQueryIds: matchedQueryIds
  };
}
function splitDepsDsl(deps, sourceName) {
  return deps.map(function (value) {
    var _a;
    var token;
    var flags;
    if (Array.isArray(value)) {
      (_a = tslib_1.__read(value, 2), flags = _a[0], token = _a[1]);
    } else {
      flags = 0;
      token = value;
    }
    if (token && (typeof token === "function" || typeof token === "object") && sourceName) {
      Object.defineProperty(token, SOURCE, {
        value: sourceName,
        configurable: true
      });
    }
    return {
      flags: flags,
      token: token,
      tokenKey: tokenKey(token)
    };
  });
}
function getParentRenderElement(view, renderHost, def) {
  var renderParent = def.renderParent;
  if (renderParent) {
    if ((renderParent.flags & 1) === 0 || (renderParent.flags & 33554432) === 0 || renderParent.element.componentRendererType && renderParent.element.componentRendererType.encapsulation === ViewEncapsulation.Native) {
      return asElementData(view, def.renderParent.nodeIndex).renderElement;
    }
  } else {
    return renderHost;
  }
}
var DEFINITION_CACHE = new WeakMap();
function resolveDefinition(factory) {
  var value = DEFINITION_CACHE.get(factory);
  if (!value) {
    value = factory(function () {
      return NOOP;
    });
    value.factory = factory;
    DEFINITION_CACHE.set(factory, value);
  }
  return value;
}
function rootRenderNodes(view) {
  var renderNodes = [];
  visitRootRenderNodes(view, 0, undefined, undefined, renderNodes);
  return renderNodes;
}
function visitRootRenderNodes(view, action, parentNode, nextSibling, target) {
  if (action === 3) {
    parentNode = view.renderer.parentNode(renderNode(view, view.def.lastRenderRootNode));
  }
  visitSiblingRenderNodes(view, action, 0, view.def.nodes.length - 1, parentNode, nextSibling, target);
}
function visitSiblingRenderNodes(view, action, startIndex, endIndex, parentNode, nextSibling, target) {
  for (var i = startIndex; i <= endIndex; i++) {
    var nodeDef = view.def.nodes[i];
    if (nodeDef.flags & (1 | 2 | 8)) {
      visitRenderNode(view, nodeDef, action, parentNode, nextSibling, target);
    }
    i += nodeDef.childCount;
  }
}
function visitProjectedRenderNodes(view, ngContentIndex, action, parentNode, nextSibling, target) {
  var compView = view;
  while (compView && !isComponentView(compView)) {
    compView = compView.parent;
  }
  var hostView = compView.parent;
  var hostElDef = viewParentEl(compView);
  var startIndex = hostElDef.nodeIndex + 1;
  var endIndex = hostElDef.nodeIndex + hostElDef.childCount;
  for (var i = startIndex; i <= endIndex; i++) {
    var nodeDef = hostView.def.nodes[i];
    if (nodeDef.ngContentIndex === ngContentIndex) {
      visitRenderNode(hostView, nodeDef, action, parentNode, nextSibling, target);
    }
    i += nodeDef.childCount;
  }
  if (!hostView.parent) {
    var projectedNodes = view.root.projectableNodes[ngContentIndex];
    if (projectedNodes) {
      for (var i = 0; i < projectedNodes.length; i++) {
        execRenderNodeAction(view, projectedNodes[i], action, parentNode, nextSibling, target);
      }
    }
  }
}
function visitRenderNode(view, nodeDef, action, parentNode, nextSibling, target) {
  if (nodeDef.flags & 8) {
    visitProjectedRenderNodes(view, nodeDef.ngContent.index, action, parentNode, nextSibling, target);
  } else {
    var rn = renderNode(view, nodeDef);
    if (action === 3 && nodeDef.flags & 33554432 && nodeDef.bindingFlags & 48) {
      if (nodeDef.bindingFlags & 16) {
        execRenderNodeAction(view, rn, action, parentNode, nextSibling, target);
      }
      if (nodeDef.bindingFlags & 32) {
        var compView = asElementData(view, nodeDef.nodeIndex).componentView;
        execRenderNodeAction(compView, rn, action, parentNode, nextSibling, target);
      }
    } else {
      execRenderNodeAction(view, rn, action, parentNode, nextSibling, target);
    }
    if (nodeDef.flags & 16777216) {
      var embeddedViews = asElementData(view, nodeDef.nodeIndex).viewContainer._embeddedViews;
      for (var k = 0; k < embeddedViews.length; k++) {
        visitRootRenderNodes(embeddedViews[k], action, parentNode, nextSibling, target);
      }
    }
    if (nodeDef.flags & 1 && !nodeDef.element.name) {
      visitSiblingRenderNodes(view, action, nodeDef.nodeIndex + 1, nodeDef.nodeIndex + nodeDef.childCount, parentNode, nextSibling, target);
    }
  }
}
function execRenderNodeAction(view, renderNode, action, parentNode, nextSibling, target) {
  var renderer = view.renderer;
  switch (action) {
    case 1:
      renderer.appendChild(parentNode, renderNode);
      break;
    case 2:
      renderer.insertBefore(parentNode, renderNode, nextSibling);
      break;
    case 3:
      renderer.removeChild(parentNode, renderNode);
      break;
    case 0:
      target.push(renderNode);
      break;
  }
}
var NS_PREFIX_RE = /^:([^:]+):(.+)$/;
function splitNamespace(name) {
  if (name[0] === ":") {
    var match = name.match(NS_PREFIX_RE);
    return [match[1], match[2]];
  }
  return ["", name];
}
function calcBindingFlags(bindings) {
  var flags = 0;
  for (var i = 0; i < bindings.length; i++) {
    flags |= bindings[i].flags;
  }
  return flags;
}
function interpolate(valueCount, constAndInterp) {
  var result = "";
  for (var i = 0; i < valueCount * 2; i = i + 2) {
    result = result + constAndInterp[i] + _toStringWithNull(constAndInterp[i + 1]);
  }
  return result + constAndInterp[valueCount * 2];
}
exports.ɵinterpolate = interpolate;
function inlineInterpolate(valueCount, c0, a1, c1, a2, c2, a3, c3, a4, c4, a5, c5, a6, c6, a7, c7, a8, c8, a9, c9) {
  switch (valueCount) {
    case 1:
      return c0 + _toStringWithNull(a1) + c1;
    case 2:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2;
    case 3:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3;
    case 4:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4;
    case 5:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5;
    case 6:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6;
    case 7:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7;
    case 8:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8;
    case 9:
      return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8 + _toStringWithNull(a9) + c9;
    default:
      throw new Error("Does not support more than 9 expressions");
  }
}
exports.ɵinlineInterpolate = inlineInterpolate;
function _toStringWithNull(v) {
  return v != null ? v.toString() : "";
}
var EMPTY_ARRAY$3 = [];
exports.ɵEMPTY_ARRAY = EMPTY_ARRAY$3;
var EMPTY_MAP = {};
exports.ɵEMPTY_MAP = EMPTY_MAP;
var UNDEFINED_VALUE = new Object();
var InjectorRefTokenKey = tokenKey(Injector);
var INJECTORRefTokenKey = tokenKey(INJECTOR);
var NgModuleRefTokenKey = tokenKey(NgModuleRef);
function moduleProvideDef(flags, token, value, deps) {
  value = resolveForwardRef(value);
  var depDefs = splitDepsDsl(deps, stringify(token));
  return {
    index: -1,
    deps: depDefs,
    flags: flags,
    token: token,
    value: value
  };
}
exports.ɵmpd = moduleProvideDef;
function moduleDef(providers) {
  var providersByKey = {};
  var modules = [];
  var isRoot = false;
  for (var i = 0; i < providers.length; i++) {
    var provider = providers[i];
    if (provider.token === APP_ROOT && provider.value === true) {
      isRoot = true;
    }
    if (provider.flags & 1073741824) {
      modules.push(provider.token);
    }
    provider.index = i;
    providersByKey[tokenKey(provider.token)] = provider;
  }
  return {
    factory: null,
    providersByKey: providersByKey,
    providers: providers,
    modules: modules,
    isRoot: isRoot
  };
}
exports.ɵmod = moduleDef;
function initNgModule(data) {
  var def = data._def;
  var providers = data._providers = new Array(def.providers.length);
  for (var i = 0; i < def.providers.length; i++) {
    var provDef = def.providers[i];
    if (!(provDef.flags & 4096)) {
      if (providers[i] === undefined) {
        providers[i] = _createProviderInstance(data, provDef);
      }
    }
  }
}
function resolveNgModuleDep(data, depDef, notFoundValue) {
  if (notFoundValue === void 0) {
    notFoundValue = Injector.THROW_IF_NOT_FOUND;
  }
  var former = setCurrentInjector(data);
  try {
    if (depDef.flags & 8) {
      return depDef.token;
    }
    if (depDef.flags & 2) {
      notFoundValue = null;
    }
    if (depDef.flags & 1) {
      return data._parent.get(depDef.token, notFoundValue);
    }
    var tokenKey_1 = depDef.tokenKey;
    switch (tokenKey_1) {
      case InjectorRefTokenKey:
      case INJECTORRefTokenKey:
      case NgModuleRefTokenKey:
        return data;
    }
    var providerDef = data._def.providersByKey[tokenKey_1];
    exports.ɵprd = providerDef;
    var injectableDef = void 0;
    if (providerDef) {
      var providerInstance = data._providers[providerDef.index];
      if (providerInstance === undefined) {
        providerInstance = data._providers[providerDef.index] = _createProviderInstance(data, providerDef);
      }
      return providerInstance === UNDEFINED_VALUE ? undefined : providerInstance;
    } else if ((injectableDef = getInjectableDef(depDef.token)) && targetsModule(data, injectableDef)) {
      var index = data._providers.length;
      data._def.providers[index] = data._def.providersByKey[depDef.tokenKey] = {
        flags: 1024 | 4096,
        value: injectableDef.factory,
        deps: [],
        index: index,
        token: depDef.token
      };
      data._providers[index] = UNDEFINED_VALUE;
      return data._providers[index] = _createProviderInstance(data, data._def.providersByKey[depDef.tokenKey]);
    } else if (depDef.flags & 4) {
      return notFoundValue;
    }
    return data._parent.get(depDef.token, notFoundValue);
  } finally {
    setCurrentInjector(former);
  }
}
function moduleTransitivelyPresent(ngModule, scope) {
  return ngModule._def.modules.indexOf(scope) > -1;
}
function targetsModule(ngModule, def) {
  return def.providedIn != null && (moduleTransitivelyPresent(ngModule, def.providedIn) || def.providedIn === "root" && ngModule._def.isRoot);
}
function _createProviderInstance(ngModule, providerDef) {
  var injectable;
  switch (providerDef.flags & 201347067) {
    case 512:
      injectable = _createClass(ngModule, providerDef.value, providerDef.deps);
      break;
    case 1024:
      injectable = _callFactory(ngModule, providerDef.value, providerDef.deps);
      break;
    case 2048:
      injectable = resolveNgModuleDep(ngModule, providerDef.deps[0]);
      break;
    case 256:
      injectable = providerDef.value;
      break;
  }
  if (injectable !== UNDEFINED_VALUE && injectable !== null && typeof injectable === "object" && !(providerDef.flags & 131072) && typeof injectable.ngOnDestroy === "function") {
    providerDef.flags |= 131072;
  }
  return injectable === undefined ? UNDEFINED_VALUE : injectable;
}
function _createClass(ngModule, ctor, deps) {
  var len = deps.length;
  switch (len) {
    case 0:
      return new ctor();
    case 1:
      return new ctor(resolveNgModuleDep(ngModule, deps[0]));
    case 2:
      return new ctor(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]));
    case 3:
      return new ctor(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]), resolveNgModuleDep(ngModule, deps[2]));
    default:
      var depValues = new Array(len);
      for (var i = 0; i < len; i++) {
        depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
      }
      return new (ctor.bind.apply(ctor, tslib_1.__spread([void 0], depValues)))();
  }
}
function _callFactory(ngModule, factory, deps) {
  var len = deps.length;
  switch (len) {
    case 0:
      return factory();
    case 1:
      return factory(resolveNgModuleDep(ngModule, deps[0]));
    case 2:
      return factory(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]));
    case 3:
      return factory(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]), resolveNgModuleDep(ngModule, deps[2]));
    default:
      var depValues = Array(len);
      for (var i = 0; i < len; i++) {
        depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
      }
      return factory.apply(void 0, tslib_1.__spread(depValues));
  }
}
function callNgModuleLifecycle(ngModule, lifecycles) {
  var def = ngModule._def;
  var destroyed = new Set();
  for (var i = 0; i < def.providers.length; i++) {
    var provDef = def.providers[i];
    if (provDef.flags & 131072) {
      var instance = ngModule._providers[i];
      if (instance && instance !== UNDEFINED_VALUE) {
        var onDestroy = instance.ngOnDestroy;
        if (typeof onDestroy === "function" && !destroyed.has(instance)) {
          onDestroy.apply(instance);
          destroyed.add(instance);
        }
      }
    }
  }
}
function attachEmbeddedView(parentView, elementData, viewIndex, view) {
  var embeddedViews = elementData.viewContainer._embeddedViews;
  if (viewIndex === null || viewIndex === undefined) {
    viewIndex = embeddedViews.length;
  }
  view.viewContainerParent = parentView;
  addToArray(embeddedViews, viewIndex, view);
  attachProjectedView(elementData, view);
  Services.dirtyParentQueries(view);
  var prevView = viewIndex > 0 ? embeddedViews[viewIndex - 1] : null;
  renderAttachEmbeddedView(elementData, prevView, view);
}
function attachProjectedView(vcElementData, view) {
  var dvcElementData = declaredViewContainer(view);
  if (!dvcElementData || dvcElementData === vcElementData || view.state & 16) {
    return;
  }
  view.state |= 16;
  var projectedViews = dvcElementData.template._projectedViews;
  if (!projectedViews) {
    projectedViews = dvcElementData.template._projectedViews = [];
  }
  projectedViews.push(view);
  markNodeAsProjectedTemplate(view.parent.def, view.parentNodeDef);
}
function markNodeAsProjectedTemplate(viewDef, nodeDef) {
  if (nodeDef.flags & 4) {
    return;
  }
  viewDef.nodeFlags |= 4;
  nodeDef.flags |= 4;
  var parentNodeDef = nodeDef.parent;
  while (parentNodeDef) {
    parentNodeDef.childFlags |= 4;
    parentNodeDef = parentNodeDef.parent;
  }
}
function detachEmbeddedView(elementData, viewIndex) {
  var embeddedViews = elementData.viewContainer._embeddedViews;
  if (viewIndex == null || viewIndex >= embeddedViews.length) {
    viewIndex = embeddedViews.length - 1;
  }
  if (viewIndex < 0) {
    return null;
  }
  var view = embeddedViews[viewIndex];
  view.viewContainerParent = null;
  removeFromArray(embeddedViews, viewIndex);
  Services.dirtyParentQueries(view);
  renderDetachView$1(view);
  return view;
}
function detachProjectedView(view) {
  if (!(view.state & 16)) {
    return;
  }
  var dvcElementData = declaredViewContainer(view);
  if (dvcElementData) {
    var projectedViews = dvcElementData.template._projectedViews;
    if (projectedViews) {
      removeFromArray(projectedViews, projectedViews.indexOf(view));
      Services.dirtyParentQueries(view);
    }
  }
}
function moveEmbeddedView(elementData, oldViewIndex, newViewIndex) {
  var embeddedViews = elementData.viewContainer._embeddedViews;
  var view = embeddedViews[oldViewIndex];
  removeFromArray(embeddedViews, oldViewIndex);
  if (newViewIndex == null) {
    newViewIndex = embeddedViews.length;
  }
  addToArray(embeddedViews, newViewIndex, view);
  Services.dirtyParentQueries(view);
  renderDetachView$1(view);
  var prevView = newViewIndex > 0 ? embeddedViews[newViewIndex - 1] : null;
  renderAttachEmbeddedView(elementData, prevView, view);
  return view;
}
function renderAttachEmbeddedView(elementData, prevView, view) {
  var prevRenderNode = prevView ? renderNode(prevView, prevView.def.lastRenderRootNode) : elementData.renderElement;
  var parentNode = view.renderer.parentNode(prevRenderNode);
  var nextSibling = view.renderer.nextSibling(prevRenderNode);
  visitRootRenderNodes(view, 2, parentNode, nextSibling, undefined);
}
function renderDetachView$1(view) {
  visitRootRenderNodes(view, 3, null, null, undefined);
}
var EMPTY_CONTEXT = new Object();
function createComponentFactory(selector, componentType, viewDefFactory, inputs, outputs, ngContentSelectors) {
  return new ComponentFactory_(selector, componentType, viewDefFactory, inputs, outputs, ngContentSelectors);
}
exports.ɵccf = createComponentFactory;
function getComponentViewDefinitionFactory(componentFactory) {
  return componentFactory.viewDefFactory;
}
exports.ɵgetComponentViewDefinitionFactory = getComponentViewDefinitionFactory;
var ComponentFactory_ = (function (_super) {
  tslib_1.__extends(ComponentFactory_, _super);
  function ComponentFactory_(selector, componentType, viewDefFactory, _inputs, _outputs, ngContentSelectors) {
    var _this = _super.call(this) || this;
    _this.selector = selector;
    _this.componentType = componentType;
    _this._inputs = _inputs;
    _this._outputs = _outputs;
    _this.ngContentSelectors = ngContentSelectors;
    _this.viewDefFactory = viewDefFactory;
    return _this;
  }
  Object.defineProperty(ComponentFactory_.prototype, "inputs", {
    get: function () {
      var inputsArr = [];
      var inputs = this._inputs;
      for (var propName in inputs) {
        var templateName = inputs[propName];
        inputsArr.push({
          propName: propName,
          templateName: templateName
        });
      }
      return inputsArr;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ComponentFactory_.prototype, "outputs", {
    get: function () {
      var outputsArr = [];
      for (var propName in this._outputs) {
        var templateName = this._outputs[propName];
        outputsArr.push({
          propName: propName,
          templateName: templateName
        });
      }
      return outputsArr;
    },
    enumerable: true,
    configurable: true
  });
  ComponentFactory_.prototype.create = function (injector, projectableNodes, rootSelectorOrNode, ngModule) {
    if (!ngModule) {
      throw new Error("ngModule should be provided");
    }
    var viewDef = resolveDefinition(this.viewDefFactory);
    exports.ɵvid = viewDef;
    var componentNodeIndex = viewDef.nodes[0].element.componentProvider.nodeIndex;
    var view = Services.createRootView(injector, projectableNodes || [], rootSelectorOrNode, viewDef, ngModule, EMPTY_CONTEXT);
    var component = asProviderData(view, componentNodeIndex).instance;
    if (rootSelectorOrNode) {
      view.renderer.setAttribute(asElementData(view, 0).renderElement, "ng-version", VERSION.full);
    }
    return new ComponentRef_(view, new ViewRef_(view), component);
  };
  return ComponentFactory_;
})(ComponentFactory);
var ComponentRef_ = (function (_super) {
  tslib_1.__extends(ComponentRef_, _super);
  function ComponentRef_(_view, _viewRef, _component) {
    var _this = _super.call(this) || this;
    _this._view = _view;
    _this._viewRef = _viewRef;
    _this._component = _component;
    _this._elDef = _this._view.def.nodes[0];
    _this.hostView = _viewRef;
    _this.changeDetectorRef = _viewRef;
    _this.instance = _component;
    return _this;
  }
  Object.defineProperty(ComponentRef_.prototype, "location", {
    get: function () {
      return new ElementRef(asElementData(this._view, this._elDef.nodeIndex).renderElement);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ComponentRef_.prototype, "injector", {
    get: function () {
      return new Injector_(this._view, this._elDef);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ComponentRef_.prototype, "componentType", {
    get: function () {
      return this._component.constructor;
    },
    enumerable: true,
    configurable: true
  });
  ComponentRef_.prototype.destroy = function () {
    this._viewRef.destroy();
  };
  ComponentRef_.prototype.onDestroy = function (callback) {
    this._viewRef.onDestroy(callback);
  };
  return ComponentRef_;
})(ComponentRef);
function createViewContainerData(view, elDef, elData) {
  return new ViewContainerRef_(view, elDef, elData);
}
var ViewContainerRef_ = (function () {
  function ViewContainerRef_(_view, _elDef, _data) {
    this._view = _view;
    this._elDef = _elDef;
    this._data = _data;
    this._embeddedViews = [];
  }
  Object.defineProperty(ViewContainerRef_.prototype, "element", {
    get: function () {
      return new ElementRef(this._data.renderElement);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewContainerRef_.prototype, "injector", {
    get: function () {
      return new Injector_(this._view, this._elDef);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewContainerRef_.prototype, "parentInjector", {
    get: function () {
      var view = this._view;
      var elDef = this._elDef.parent;
      while (!elDef && view) {
        elDef = viewParentEl(view);
        view = view.parent;
      }
      return view ? new Injector_(view, elDef) : new Injector_(this._view, null);
    },
    enumerable: true,
    configurable: true
  });
  ViewContainerRef_.prototype.clear = function () {
    var len = this._embeddedViews.length;
    for (var i = len - 1; i >= 0; i--) {
      var view = detachEmbeddedView(this._data, i);
      Services.destroyView(view);
    }
  };
  ViewContainerRef_.prototype.get = function (index) {
    var view = this._embeddedViews[index];
    if (view) {
      var ref = new ViewRef_(view);
      ref.attachToViewContainerRef(this);
      return ref;
    }
    return null;
  };
  Object.defineProperty(ViewContainerRef_.prototype, "length", {
    get: function () {
      return this._embeddedViews.length;
    },
    enumerable: true,
    configurable: true
  });
  ViewContainerRef_.prototype.createEmbeddedView = function (templateRef, context, index) {
    var viewRef = templateRef.createEmbeddedView(context || ({}));
    this.insert(viewRef, index);
    return viewRef;
  };
  ViewContainerRef_.prototype.createComponent = function (componentFactory, index, injector, projectableNodes, ngModuleRef) {
    var contextInjector = injector || this.parentInjector;
    if (!ngModuleRef && !(componentFactory instanceof ComponentFactoryBoundToModule)) {
      ngModuleRef = contextInjector.get(NgModuleRef);
    }
    var componentRef = componentFactory.create(contextInjector, projectableNodes, undefined, ngModuleRef);
    this.insert(componentRef.hostView, index);
    return componentRef;
  };
  ViewContainerRef_.prototype.insert = function (viewRef, index) {
    if (viewRef.destroyed) {
      throw new Error("Cannot insert a destroyed View in a ViewContainer!");
    }
    var viewRef_ = viewRef;
    var viewData = viewRef_._view;
    attachEmbeddedView(this._view, this._data, index, viewData);
    viewRef_.attachToViewContainerRef(this);
    return viewRef;
  };
  ViewContainerRef_.prototype.move = function (viewRef, currentIndex) {
    if (viewRef.destroyed) {
      throw new Error("Cannot move a destroyed View in a ViewContainer!");
    }
    var previousIndex = this._embeddedViews.indexOf(viewRef._view);
    moveEmbeddedView(this._data, previousIndex, currentIndex);
    return viewRef;
  };
  ViewContainerRef_.prototype.indexOf = function (viewRef) {
    return this._embeddedViews.indexOf(viewRef._view);
  };
  ViewContainerRef_.prototype.remove = function (index) {
    var viewData = detachEmbeddedView(this._data, index);
    if (viewData) {
      Services.destroyView(viewData);
    }
  };
  ViewContainerRef_.prototype.detach = function (index) {
    var view = detachEmbeddedView(this._data, index);
    return view ? new ViewRef_(view) : null;
  };
  return ViewContainerRef_;
})();
function createChangeDetectorRef(view) {
  return new ViewRef_(view);
}
var ViewRef_ = (function () {
  function ViewRef_(_view) {
    this._view = _view;
    this._viewContainerRef = null;
    this._appRef = null;
  }
  Object.defineProperty(ViewRef_.prototype, "rootNodes", {
    get: function () {
      return rootRenderNodes(this._view);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewRef_.prototype, "context", {
    get: function () {
      return this._view.context;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ViewRef_.prototype, "destroyed", {
    get: function () {
      return (this._view.state & 128) !== 0;
    },
    enumerable: true,
    configurable: true
  });
  ViewRef_.prototype.markForCheck = function () {
    markParentViewsForCheck(this._view);
  };
  ViewRef_.prototype.detach = function () {
    this._view.state &= ~4;
  };
  ViewRef_.prototype.detectChanges = function () {
    var fs = this._view.root.rendererFactory;
    if (fs.begin) {
      fs.begin();
    }
    try {
      Services.checkAndUpdateView(this._view);
    } finally {
      if (fs.end) {
        fs.end();
      }
    }
  };
  ViewRef_.prototype.checkNoChanges = function () {
    Services.checkNoChangesView(this._view);
  };
  ViewRef_.prototype.reattach = function () {
    this._view.state |= 4;
  };
  ViewRef_.prototype.onDestroy = function (callback) {
    if (!this._view.disposables) {
      this._view.disposables = [];
    }
    this._view.disposables.push(callback);
  };
  ViewRef_.prototype.destroy = function () {
    if (this._appRef) {
      this._appRef.detachView(this);
    } else if (this._viewContainerRef) {
      this._viewContainerRef.detach(this._viewContainerRef.indexOf(this));
    }
    Services.destroyView(this._view);
  };
  ViewRef_.prototype.detachFromAppRef = function () {
    this._appRef = null;
    renderDetachView$1(this._view);
    Services.dirtyParentQueries(this._view);
  };
  ViewRef_.prototype.attachToAppRef = function (appRef) {
    if (this._viewContainerRef) {
      throw new Error("This view is already attached to a ViewContainer!");
    }
    this._appRef = appRef;
  };
  ViewRef_.prototype.attachToViewContainerRef = function (vcRef) {
    if (this._appRef) {
      throw new Error("This view is already attached directly to the ApplicationRef!");
    }
    this._viewContainerRef = vcRef;
  };
  return ViewRef_;
})();
function createTemplateData(view, def) {
  return new TemplateRef_(view, def);
}
var TemplateRef_ = (function (_super) {
  tslib_1.__extends(TemplateRef_, _super);
  function TemplateRef_(_parentView, _def) {
    var _this = _super.call(this) || this;
    _this._parentView = _parentView;
    _this._def = _def;
    return _this;
  }
  TemplateRef_.prototype.createEmbeddedView = function (context) {
    return new ViewRef_(Services.createEmbeddedView(this._parentView, this._def, this._def.element.template, context));
  };
  Object.defineProperty(TemplateRef_.prototype, "elementRef", {
    get: function () {
      return new ElementRef(asElementData(this._parentView, this._def.nodeIndex).renderElement);
    },
    enumerable: true,
    configurable: true
  });
  return TemplateRef_;
})(TemplateRef);
function createInjector$1(view, elDef) {
  return new Injector_(view, elDef);
}
var Injector_ = (function () {
  function Injector_(view, elDef) {
    this.view = view;
    this.elDef = elDef;
  }
  Injector_.prototype.get = function (token, notFoundValue) {
    if (notFoundValue === void 0) {
      notFoundValue = Injector.THROW_IF_NOT_FOUND;
    }
    var allowPrivateServices = this.elDef ? (this.elDef.flags & 33554432) !== 0 : false;
    return Services.resolveDep(this.view, this.elDef, allowPrivateServices, {
      flags: 0,
      token: token,
      tokenKey: tokenKey(token)
    }, notFoundValue);
  };
  return Injector_;
})();
function nodeValue(view, index) {
  var def = view.def.nodes[index];
  if (def.flags & 1) {
    var elData = asElementData(view, def.nodeIndex);
    return def.element.template ? elData.template : elData.renderElement;
  } else if (def.flags & 2) {
    return asTextData(view, def.nodeIndex).renderText;
  } else if (def.flags & (20224 | 16)) {
    return asProviderData(view, def.nodeIndex).instance;
  }
  throw new Error("Illegal state: read nodeValue for node index " + index);
}
exports.ɵnov = nodeValue;
function createRendererV1(view) {
  return new RendererAdapter(view.renderer);
}
var RendererAdapter = (function () {
  function RendererAdapter(delegate) {
    this.delegate = delegate;
  }
  RendererAdapter.prototype.selectRootElement = function (selectorOrNode) {
    return this.delegate.selectRootElement(selectorOrNode);
  };
  RendererAdapter.prototype.createElement = function (parent, namespaceAndName) {
    var _a = tslib_1.__read(splitNamespace(namespaceAndName), 2), ns = _a[0], name = _a[1];
    var el = this.delegate.createElement(name, ns);
    if (parent) {
      this.delegate.appendChild(parent, el);
    }
    return el;
  };
  RendererAdapter.prototype.createViewRoot = function (hostElement) {
    return hostElement;
  };
  RendererAdapter.prototype.createTemplateAnchor = function (parentElement) {
    var comment = this.delegate.createComment("");
    if (parentElement) {
      this.delegate.appendChild(parentElement, comment);
    }
    return comment;
  };
  RendererAdapter.prototype.createText = function (parentElement, value) {
    var node = this.delegate.createText(value);
    if (parentElement) {
      this.delegate.appendChild(parentElement, node);
    }
    return node;
  };
  RendererAdapter.prototype.projectNodes = function (parentElement, nodes) {
    for (var i = 0; i < nodes.length; i++) {
      this.delegate.appendChild(parentElement, nodes[i]);
    }
  };
  RendererAdapter.prototype.attachViewAfter = function (node, viewRootNodes) {
    var parentElement = this.delegate.parentNode(node);
    var nextSibling = this.delegate.nextSibling(node);
    for (var i = 0; i < viewRootNodes.length; i++) {
      this.delegate.insertBefore(parentElement, viewRootNodes[i], nextSibling);
    }
  };
  RendererAdapter.prototype.detachView = function (viewRootNodes) {
    for (var i = 0; i < viewRootNodes.length; i++) {
      var node = viewRootNodes[i];
      var parentElement = this.delegate.parentNode(node);
      this.delegate.removeChild(parentElement, node);
    }
  };
  RendererAdapter.prototype.destroyView = function (hostElement, viewAllNodes) {
    for (var i = 0; i < viewAllNodes.length; i++) {
      this.delegate.destroyNode(viewAllNodes[i]);
    }
  };
  RendererAdapter.prototype.listen = function (renderElement, name, callback) {
    return this.delegate.listen(renderElement, name, callback);
  };
  RendererAdapter.prototype.listenGlobal = function (target, name, callback) {
    return this.delegate.listen(target, name, callback);
  };
  RendererAdapter.prototype.setElementProperty = function (renderElement, propertyName, propertyValue) {
    this.delegate.setProperty(renderElement, propertyName, propertyValue);
  };
  RendererAdapter.prototype.setElementAttribute = function (renderElement, namespaceAndName, attributeValue) {
    var _a = tslib_1.__read(splitNamespace(namespaceAndName), 2), ns = _a[0], name = _a[1];
    if (attributeValue != null) {
      this.delegate.setAttribute(renderElement, name, attributeValue, ns);
    } else {
      this.delegate.removeAttribute(renderElement, name, ns);
    }
  };
  RendererAdapter.prototype.setBindingDebugInfo = function (renderElement, propertyName, propertyValue) {};
  RendererAdapter.prototype.setElementClass = function (renderElement, className, isAdd) {
    if (isAdd) {
      this.delegate.addClass(renderElement, className);
    } else {
      this.delegate.removeClass(renderElement, className);
    }
  };
  RendererAdapter.prototype.setElementStyle = function (renderElement, styleName, styleValue) {
    if (styleValue != null) {
      this.delegate.setStyle(renderElement, styleName, styleValue);
    } else {
      this.delegate.removeStyle(renderElement, styleName);
    }
  };
  RendererAdapter.prototype.invokeElementMethod = function (renderElement, methodName, args) {
    renderElement[methodName].apply(renderElement, args);
  };
  RendererAdapter.prototype.setText = function (renderNode, text) {
    this.delegate.setValue(renderNode, text);
  };
  RendererAdapter.prototype.animate = function () {
    throw new Error("Renderer.animate is no longer supported!");
  };
  return RendererAdapter;
})();
function createNgModuleRef(moduleType, parent, bootstrapComponents, def) {
  return new NgModuleRef_(moduleType, parent, bootstrapComponents, def);
}
var NgModuleRef_ = (function () {
  function NgModuleRef_(_moduleType, _parent, _bootstrapComponents, _def) {
    this._moduleType = _moduleType;
    this._parent = _parent;
    this._bootstrapComponents = _bootstrapComponents;
    this._def = _def;
    this._destroyListeners = [];
    this._destroyed = false;
    this.injector = this;
    initNgModule(this);
  }
  NgModuleRef_.prototype.get = function (token, notFoundValue, injectFlags) {
    if (notFoundValue === void 0) {
      notFoundValue = Injector.THROW_IF_NOT_FOUND;
    }
    if (injectFlags === void 0) {
      injectFlags = InjectFlags.Default;
    }
    var flags = 0;
    if (injectFlags & InjectFlags.SkipSelf) {
      flags |= 1;
    } else if (injectFlags & InjectFlags.Self) {
      flags |= 4;
    }
    return resolveNgModuleDep(this, {
      token: token,
      tokenKey: tokenKey(token),
      flags: flags
    }, notFoundValue);
  };
  Object.defineProperty(NgModuleRef_.prototype, "instance", {
    get: function () {
      return this.get(this._moduleType);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(NgModuleRef_.prototype, "componentFactoryResolver", {
    get: function () {
      return this.get(ComponentFactoryResolver);
    },
    enumerable: true,
    configurable: true
  });
  NgModuleRef_.prototype.destroy = function () {
    if (this._destroyed) {
      throw new Error("The ng module " + stringify(this.instance.constructor) + " has already been destroyed.");
    }
    this._destroyed = true;
    callNgModuleLifecycle(this, 131072);
    this._destroyListeners.forEach(function (listener) {
      return listener();
    });
  };
  NgModuleRef_.prototype.onDestroy = function (callback) {
    this._destroyListeners.push(callback);
  };
  return NgModuleRef_;
})();
var RendererV1TokenKey = tokenKey(Renderer);
var Renderer2TokenKey = tokenKey(Renderer2);
var ElementRefTokenKey = tokenKey(ElementRef);
var ViewContainerRefTokenKey = tokenKey(ViewContainerRef);
var TemplateRefTokenKey = tokenKey(TemplateRef);
var ChangeDetectorRefTokenKey = tokenKey(ChangeDetectorRef);
var InjectorRefTokenKey$1 = tokenKey(Injector);
var INJECTORRefTokenKey$1 = tokenKey(INJECTOR);
function directiveDef(checkIndex, flags, matchedQueries, childCount, ctor, deps, props, outputs) {
  var bindings = [];
  if (props) {
    for (var prop in props) {
      var _a = tslib_1.__read(props[prop], 2), bindingIndex = _a[0], nonMinifiedName = _a[1];
      bindings[bindingIndex] = {
        flags: 8,
        name: prop,
        nonMinifiedName: nonMinifiedName,
        ns: null,
        securityContext: null,
        suffix: null
      };
    }
  }
  var outputDefs = [];
  if (outputs) {
    for (var propName in outputs) {
      outputDefs.push({
        type: 1,
        propName: propName,
        target: null,
        eventName: outputs[propName]
      });
    }
  }
  flags |= 16384;
  return _def(checkIndex, flags, matchedQueries, childCount, ctor, ctor, deps, bindings, outputDefs);
}
exports.ɵdid = directiveDef;
function pipeDef(flags, ctor, deps) {
  flags |= 16;
  return _def(-1, flags, null, 0, ctor, ctor, deps);
}
exports.ɵpid = pipeDef;
function providerDef(flags, matchedQueries, token, value, deps) {
  return _def(-1, flags, matchedQueries, 0, token, value, deps);
}
exports.ɵprd = providerDef;
function _def(checkIndex, flags, matchedQueriesDsl, childCount, token, value, deps, bindings, outputs) {
  var _a = splitMatchedQueriesDsl(matchedQueriesDsl), matchedQueries = _a.matchedQueries, references = _a.references, matchedQueryIds = _a.matchedQueryIds;
  if (!outputs) {
    outputs = [];
  }
  if (!bindings) {
    bindings = [];
  }
  value = resolveForwardRef(value);
  var depDefs = splitDepsDsl(deps, stringify(token));
  return {
    nodeIndex: -1,
    parent: null,
    renderParent: null,
    bindingIndex: -1,
    outputIndex: -1,
    checkIndex: checkIndex,
    flags: flags,
    childFlags: 0,
    directChildFlags: 0,
    childMatchedQueries: 0,
    matchedQueries: matchedQueries,
    matchedQueryIds: matchedQueryIds,
    references: references,
    ngContentIndex: -1,
    childCount: childCount,
    bindings: bindings,
    bindingFlags: calcBindingFlags(bindings),
    outputs: outputs,
    element: null,
    provider: {
      token: token,
      value: value,
      deps: depDefs
    },
    text: null,
    query: null,
    ngContent: null
  };
}
exports.ɵangular_packages_core_core_y = _def;
function createProviderInstance(view, def) {
  return _createProviderInstance$1(view, def);
}
function createPipeInstance(view, def) {
  var compView = view;
  while (compView.parent && !isComponentView(compView)) {
    compView = compView.parent;
  }
  var allowPrivateServices = true;
  return createClass(compView.parent, viewParentEl(compView), allowPrivateServices, def.provider.value, def.provider.deps);
}
function createDirectiveInstance(view, def) {
  var allowPrivateServices = (def.flags & 32768) > 0;
  var instance = createClass(view, def.parent, allowPrivateServices, def.provider.value, def.provider.deps);
  if (def.outputs.length) {
    for (var i = 0; i < def.outputs.length; i++) {
      var output = def.outputs[i];
      var outputObservable = instance[output.propName];
      if (isObservable(outputObservable)) {
        var subscription = outputObservable.subscribe(eventHandlerClosure(view, def.parent.nodeIndex, output.eventName));
        view.disposables[def.outputIndex + i] = subscription.unsubscribe.bind(subscription);
      } else {
        throw new Error("@Output " + output.propName + " not initialized in '" + instance.constructor.name + "'.");
      }
    }
  }
  return instance;
}
function eventHandlerClosure(view, index, eventName) {
  return function (event) {
    return dispatchEvent(view, index, eventName, event);
  };
}
function checkAndUpdateDirectiveInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
  var providerData = asProviderData(view, def.nodeIndex);
  var directive = providerData.instance;
  var changed = false;
  var changes = undefined;
  var bindLen = def.bindings.length;
  if (bindLen > 0 && checkBinding(view, def, 0, v0)) {
    changed = true;
    changes = updateProp(view, providerData, def, 0, v0, changes);
  }
  if (bindLen > 1 && checkBinding(view, def, 1, v1)) {
    changed = true;
    changes = updateProp(view, providerData, def, 1, v1, changes);
  }
  if (bindLen > 2 && checkBinding(view, def, 2, v2)) {
    changed = true;
    changes = updateProp(view, providerData, def, 2, v2, changes);
  }
  if (bindLen > 3 && checkBinding(view, def, 3, v3)) {
    changed = true;
    changes = updateProp(view, providerData, def, 3, v3, changes);
  }
  if (bindLen > 4 && checkBinding(view, def, 4, v4)) {
    changed = true;
    changes = updateProp(view, providerData, def, 4, v4, changes);
  }
  if (bindLen > 5 && checkBinding(view, def, 5, v5)) {
    changed = true;
    changes = updateProp(view, providerData, def, 5, v5, changes);
  }
  if (bindLen > 6 && checkBinding(view, def, 6, v6)) {
    changed = true;
    changes = updateProp(view, providerData, def, 6, v6, changes);
  }
  if (bindLen > 7 && checkBinding(view, def, 7, v7)) {
    changed = true;
    changes = updateProp(view, providerData, def, 7, v7, changes);
  }
  if (bindLen > 8 && checkBinding(view, def, 8, v8)) {
    changed = true;
    changes = updateProp(view, providerData, def, 8, v8, changes);
  }
  if (bindLen > 9 && checkBinding(view, def, 9, v9)) {
    changed = true;
    changes = updateProp(view, providerData, def, 9, v9, changes);
  }
  if (changes) {
    directive.ngOnChanges(changes);
  }
  if (def.flags & 65536 && shouldCallLifecycleInitHook(view, 256, def.nodeIndex)) {
    directive.ngOnInit();
  }
  if (def.flags & 262144) {
    directive.ngDoCheck();
  }
  return changed;
}
function checkAndUpdateDirectiveDynamic(view, def, values) {
  var providerData = asProviderData(view, def.nodeIndex);
  var directive = providerData.instance;
  var changed = false;
  var changes = undefined;
  for (var i = 0; i < values.length; i++) {
    if (checkBinding(view, def, i, values[i])) {
      changed = true;
      changes = updateProp(view, providerData, def, i, values[i], changes);
    }
  }
  if (changes) {
    directive.ngOnChanges(changes);
  }
  if (def.flags & 65536 && shouldCallLifecycleInitHook(view, 256, def.nodeIndex)) {
    directive.ngOnInit();
  }
  if (def.flags & 262144) {
    directive.ngDoCheck();
  }
  return changed;
}
function _createProviderInstance$1(view, def) {
  var allowPrivateServices = (def.flags & 8192) > 0;
  var providerDef = def.provider;
  exports.ɵprd = providerDef;
  switch (def.flags & 201347067) {
    case 512:
      return createClass(view, def.parent, allowPrivateServices, providerDef.value, providerDef.deps);
    case 1024:
      return callFactory(view, def.parent, allowPrivateServices, providerDef.value, providerDef.deps);
    case 2048:
      return resolveDep(view, def.parent, allowPrivateServices, providerDef.deps[0]);
    case 256:
      return providerDef.value;
  }
}
function createClass(view, elDef, allowPrivateServices, ctor, deps) {
  var len = deps.length;
  switch (len) {
    case 0:
      return new ctor();
    case 1:
      return new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]));
    case 2:
      return new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]));
    case 3:
      return new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]), resolveDep(view, elDef, allowPrivateServices, deps[2]));
    default:
      var depValues = new Array(len);
      for (var i = 0; i < len; i++) {
        depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
      }
      return new (ctor.bind.apply(ctor, tslib_1.__spread([void 0], depValues)))();
  }
}
function callFactory(view, elDef, allowPrivateServices, factory, deps) {
  var len = deps.length;
  switch (len) {
    case 0:
      return factory();
    case 1:
      return factory(resolveDep(view, elDef, allowPrivateServices, deps[0]));
    case 2:
      return factory(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]));
    case 3:
      return factory(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]), resolveDep(view, elDef, allowPrivateServices, deps[2]));
    default:
      var depValues = Array(len);
      for (var i = 0; i < len; i++) {
        depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
      }
      return factory.apply(void 0, tslib_1.__spread(depValues));
  }
}
var NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = {};
exports.ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR;
function resolveDep(view, elDef, allowPrivateServices, depDef, notFoundValue) {
  if (notFoundValue === void 0) {
    notFoundValue = Injector.THROW_IF_NOT_FOUND;
  }
  if (depDef.flags & 8) {
    return depDef.token;
  }
  var startView = view;
  if (depDef.flags & 2) {
    notFoundValue = null;
  }
  var tokenKey = depDef.tokenKey;
  if (tokenKey === ChangeDetectorRefTokenKey) {
    allowPrivateServices = !!(elDef && elDef.element.componentView);
  }
  if (elDef && depDef.flags & 1) {
    allowPrivateServices = false;
    elDef = elDef.parent;
  }
  var searchView = view;
  while (searchView) {
    if (elDef) {
      switch (tokenKey) {
        case RendererV1TokenKey:
          {
            var compView = findCompView(searchView, elDef, allowPrivateServices);
            return createRendererV1(compView);
          }
        case Renderer2TokenKey:
          {
            var compView = findCompView(searchView, elDef, allowPrivateServices);
            return compView.renderer;
          }
        case ElementRefTokenKey:
          return new ElementRef(asElementData(searchView, elDef.nodeIndex).renderElement);
        case ViewContainerRefTokenKey:
          return asElementData(searchView, elDef.nodeIndex).viewContainer;
        case TemplateRefTokenKey:
          {
            if (elDef.element.template) {
              return asElementData(searchView, elDef.nodeIndex).template;
            }
            break;
          }
        case ChangeDetectorRefTokenKey:
          {
            var cdView = findCompView(searchView, elDef, allowPrivateServices);
            return createChangeDetectorRef(cdView);
          }
        case InjectorRefTokenKey$1:
        case INJECTORRefTokenKey$1:
          return createInjector$1(searchView, elDef);
        default:
          var providerDef_1 = (allowPrivateServices ? elDef.element.allProviders : elDef.element.publicProviders)[tokenKey];
          if (providerDef_1) {
            var providerData = asProviderData(searchView, providerDef_1.nodeIndex);
            if (!providerData) {
              providerData = {
                instance: _createProviderInstance$1(searchView, providerDef_1)
              };
              searchView.nodes[providerDef_1.nodeIndex] = providerData;
            }
            return providerData.instance;
          }
      }
    }
    allowPrivateServices = isComponentView(searchView);
    elDef = viewParentEl(searchView);
    searchView = searchView.parent;
    if (depDef.flags & 4) {
      searchView = null;
    }
  }
  var value = startView.root.injector.get(depDef.token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR);
  if (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR || notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) {
    return value;
  }
  return startView.root.ngModule.injector.get(depDef.token, notFoundValue);
}
function findCompView(view, elDef, allowPrivateServices) {
  var compView;
  if (allowPrivateServices) {
    compView = asElementData(view, elDef.nodeIndex).componentView;
  } else {
    compView = view;
    while (compView.parent && !isComponentView(compView)) {
      compView = compView.parent;
    }
  }
  return compView;
}
function updateProp(view, providerData, def, bindingIdx, value, changes) {
  if (def.flags & 32768) {
    var compView = asElementData(view, def.parent.nodeIndex).componentView;
    if (compView.def.flags & 2) {
      compView.state |= 8;
    }
  }
  var binding = def.bindings[bindingIdx];
  var propName = binding.name;
  providerData.instance[propName] = value;
  if (def.flags & 524288) {
    changes = changes || ({});
    var oldValue = WrappedValue.unwrap(view.oldValues[def.bindingIndex + bindingIdx]);
    var binding_1 = def.bindings[bindingIdx];
    changes[binding_1.nonMinifiedName] = new SimpleChange(oldValue, value, (view.state & 2) !== 0);
  }
  view.oldValues[def.bindingIndex + bindingIdx] = value;
  return changes;
}
function callLifecycleHooksChildrenFirst(view, lifecycles) {
  if (!(view.def.nodeFlags & lifecycles)) {
    return;
  }
  var nodes = view.def.nodes;
  var initIndex = 0;
  for (var i = 0; i < nodes.length; i++) {
    var nodeDef = nodes[i];
    var parent_1 = nodeDef.parent;
    if (!parent_1 && nodeDef.flags & lifecycles) {
      callProviderLifecycles(view, i, nodeDef.flags & lifecycles, initIndex++);
    }
    if ((nodeDef.childFlags & lifecycles) === 0) {
      i += nodeDef.childCount;
    }
    while (parent_1 && parent_1.flags & 1 && i === parent_1.nodeIndex + parent_1.childCount) {
      if (parent_1.directChildFlags & lifecycles) {
        initIndex = callElementProvidersLifecycles(view, parent_1, lifecycles, initIndex);
      }
      parent_1 = parent_1.parent;
    }
  }
}
function callElementProvidersLifecycles(view, elDef, lifecycles, initIndex) {
  for (var i = elDef.nodeIndex + 1; i <= elDef.nodeIndex + elDef.childCount; i++) {
    var nodeDef = view.def.nodes[i];
    if (nodeDef.flags & lifecycles) {
      callProviderLifecycles(view, i, nodeDef.flags & lifecycles, initIndex++);
    }
    i += nodeDef.childCount;
  }
  return initIndex;
}
function callProviderLifecycles(view, index, lifecycles, initIndex) {
  var providerData = asProviderData(view, index);
  if (!providerData) {
    return;
  }
  var provider = providerData.instance;
  if (!provider) {
    return;
  }
  Services.setCurrentNode(view, index);
  if (lifecycles & 1048576 && shouldCallLifecycleInitHook(view, 512, initIndex)) {
    provider.ngAfterContentInit();
  }
  if (lifecycles & 2097152) {
    provider.ngAfterContentChecked();
  }
  if (lifecycles & 4194304 && shouldCallLifecycleInitHook(view, 768, initIndex)) {
    provider.ngAfterViewInit();
  }
  if (lifecycles & 8388608) {
    provider.ngAfterViewChecked();
  }
  if (lifecycles & 131072) {
    provider.ngOnDestroy();
  }
}
var ComponentFactoryResolver$1 = (function (_super) {
  tslib_1.__extends(ComponentFactoryResolver, _super);
  function ComponentFactoryResolver(ngModule) {
    var _this = _super.call(this) || this;
    _this.ngModule = ngModule;
    return _this;
  }
  exports.ComponentFactoryResolver = ComponentFactoryResolver;
  ComponentFactoryResolver.prototype.resolveComponentFactory = function (component) {
    ngDevMode && assertComponentType(component);
    var componentDef = getComponentDef(component);
    return new ComponentFactory$1(componentDef, this.ngModule);
  };
  return ComponentFactoryResolver;
})(ComponentFactoryResolver);
function toRefArray(map) {
  var array = [];
  for (var nonMinified in map) {
    if (map.hasOwnProperty(nonMinified)) {
      var minified = map[nonMinified];
      array.push({
        propName: minified,
        templateName: nonMinified
      });
    }
  }
  return array;
}
var SCHEDULER = new InjectionToken("SCHEDULER_TOKEN", {
  providedIn: "root",
  factory: function () {
    return defaultScheduler;
  }
});
exports.ɵangular_packages_core_core_ba = SCHEDULER;
function createChainedInjector(rootViewInjector, moduleInjector) {
  return {
    get: function (token, notFoundValue, flags) {
      var value = rootViewInjector.get(token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR, flags);
      if (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR || notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) {
        return value;
      }
      return moduleInjector.get(token, notFoundValue, flags);
    }
  };
}
var ComponentFactory$1 = (function (_super) {
  tslib_1.__extends(ComponentFactory, _super);
  function ComponentFactory(componentDef, ngModule) {
    var _this = _super.call(this) || this;
    _this.componentDef = componentDef;
    _this.ngModule = ngModule;
    _this.componentType = componentDef.type;
    _this.selector = componentDef.selectors[0][0] || "div";
    _this.ngContentSelectors = componentDef.ngContentSelectors ? componentDef.ngContentSelectors : [];
    _this.isBoundToModule = !!ngModule;
    return _this;
  }
  exports.ɵComponentFactory = ComponentFactory;
  Object.defineProperty(ComponentFactory.prototype, "inputs", {
    get: function () {
      return toRefArray(this.componentDef.inputs);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ComponentFactory.prototype, "outputs", {
    get: function () {
      return toRefArray(this.componentDef.outputs);
    },
    enumerable: true,
    configurable: true
  });
  ComponentFactory.prototype.create = function (injector, projectableNodes, rootSelectorOrNode, ngModule) {
    ngModule = ngModule || this.ngModule;
    var rootViewInjector = ngModule ? createChainedInjector(injector, ngModule.injector) : injector;
    var rendererFactory = rootViewInjector.get(RendererFactory2, domRendererFactory3);
    var sanitizer = rootViewInjector.get(Sanitizer, null);
    namespaceHTMLInternal();
    var hostRNode = rootSelectorOrNode ? locateHostElement(rendererFactory, rootSelectorOrNode) : elementCreate(this.selector, rendererFactory.createRenderer(null, this.componentDef));
    var rootFlags = this.componentDef.onPush ? 64 | 512 : 16 | 512;
    var isIsolated = typeof rootSelectorOrNode === "string" && (/^#root-ng-internal-isolated-\d+/).test(rootSelectorOrNode);
    var rootContext = createRootContext();
    var renderer = rendererFactory.createRenderer(hostRNode, this.componentDef);
    if (rootSelectorOrNode && hostRNode) {
      ngDevMode && ngDevMode.rendererSetAttribute++;
      isProceduralRenderer(renderer) ? renderer.setAttribute(hostRNode, "ng-version", VERSION.full) : hostRNode.setAttribute("ng-version", VERSION.full);
    }
    var rootLView = createLView(null, createTView(-1, null, 1, 0, null, null, null, null), rootContext, rootFlags, null, null, rendererFactory, renderer, sanitizer, rootViewInjector);
    var oldLView = enterView(rootLView, null);
    var component;
    var tElementNode;
    var safeToRunHooks = false;
    try {
      var componentView = createRootComponentView(hostRNode, this.componentDef, rootLView, rendererFactory, renderer);
      tElementNode = getTNode(0, rootLView);
      if (projectableNodes) {
        tElementNode.projection = projectableNodes.map(function (nodesforSlot) {
          return Array.from(nodesforSlot);
        });
      }
      component = createRootComponent(componentView, this.componentDef, rootLView, rootContext, [LifecycleHooksFeature]);
      addToViewTree(rootLView, componentView);
      refreshDescendantViews(rootLView);
      safeToRunHooks = true;
    } finally {
      leaveView(oldLView, safeToRunHooks);
    }
    var componentRef = new ComponentRef$1(this.componentType, component, createElementRef(ElementRef, tElementNode, rootLView), rootLView, tElementNode);
    if (!rootSelectorOrNode || isIsolated) {
      componentRef.hostView._tViewNode.child = tElementNode;
    }
    return componentRef;
  };
  return ComponentFactory;
})(ComponentFactory);
exports.ɵRender3ComponentFactory = ComponentFactory$1;
var componentFactoryResolver = new ComponentFactoryResolver$1();
function injectComponentFactoryResolver() {
  return componentFactoryResolver;
}
var ComponentRef$1 = (function (_super) {
  tslib_1.__extends(ComponentRef, _super);
  function ComponentRef(componentType, instance, location, _rootLView, _tNode) {
    var _this = _super.call(this) || this;
    _this.location = location;
    _this._rootLView = _rootLView;
    _this._tNode = _tNode;
    _this.destroyCbs = [];
    _this.instance = instance;
    _this.hostView = _this.changeDetectorRef = new RootViewRef(_rootLView);
    _this.hostView._tViewNode = assignTViewNodeToLView(_rootLView[TVIEW], null, -1, _rootLView);
    _this.componentType = componentType;
    return _this;
  }
  exports.ComponentRef = ComponentRef;
  Object.defineProperty(ComponentRef.prototype, "injector", {
    get: function () {
      return new NodeInjector(this._tNode, this._rootLView);
    },
    enumerable: true,
    configurable: true
  });
  ComponentRef.prototype.destroy = function () {
    if (this.destroyCbs) {
      this.destroyCbs.forEach(function (fn) {
        return fn();
      });
      this.destroyCbs = null;
      !this.hostView.destroyed && this.hostView.destroy();
    }
  };
  ComponentRef.prototype.onDestroy = function (callback) {
    if (this.destroyCbs) {
      this.destroyCbs.push(callback);
    }
  };
  return ComponentRef;
})(ComponentRef);
exports.ɵRender3ComponentRef = ComponentRef$1;
if (typeof ngI18nClosureMode === "undefined") {
  (function () {
    _global["ngI18nClosureMode"] = typeof goog !== "undefined" && typeof goog.getMsg === "function";
  })();
}
var LOCALE_DATA = {};
exports.ɵLOCALE_DATA = LOCALE_DATA;
var LocaleDataIndex;
exports.ɵLocaleDataIndex = LocaleDataIndex;
(function (LocaleDataIndex) {
  LocaleDataIndex[LocaleDataIndex["LocaleId"] = 0] = "LocaleId";
  LocaleDataIndex[LocaleDataIndex["DayPeriodsFormat"] = 1] = "DayPeriodsFormat";
  LocaleDataIndex[LocaleDataIndex["DayPeriodsStandalone"] = 2] = "DayPeriodsStandalone";
  LocaleDataIndex[LocaleDataIndex["DaysFormat"] = 3] = "DaysFormat";
  LocaleDataIndex[LocaleDataIndex["DaysStandalone"] = 4] = "DaysStandalone";
  LocaleDataIndex[LocaleDataIndex["MonthsFormat"] = 5] = "MonthsFormat";
  LocaleDataIndex[LocaleDataIndex["MonthsStandalone"] = 6] = "MonthsStandalone";
  LocaleDataIndex[LocaleDataIndex["Eras"] = 7] = "Eras";
  LocaleDataIndex[LocaleDataIndex["FirstDayOfWeek"] = 8] = "FirstDayOfWeek";
  LocaleDataIndex[LocaleDataIndex["WeekendRange"] = 9] = "WeekendRange";
  LocaleDataIndex[LocaleDataIndex["DateFormat"] = 10] = "DateFormat";
  LocaleDataIndex[LocaleDataIndex["TimeFormat"] = 11] = "TimeFormat";
  LocaleDataIndex[LocaleDataIndex["DateTimeFormat"] = 12] = "DateTimeFormat";
  LocaleDataIndex[LocaleDataIndex["NumberSymbols"] = 13] = "NumberSymbols";
  LocaleDataIndex[LocaleDataIndex["NumberFormats"] = 14] = "NumberFormats";
  LocaleDataIndex[LocaleDataIndex["CurrencySymbol"] = 15] = "CurrencySymbol";
  LocaleDataIndex[LocaleDataIndex["CurrencyName"] = 16] = "CurrencyName";
  LocaleDataIndex[LocaleDataIndex["Currencies"] = 17] = "Currencies";
  LocaleDataIndex[LocaleDataIndex["PluralCase"] = 18] = "PluralCase";
  LocaleDataIndex[LocaleDataIndex["ExtraData"] = 19] = "ExtraData";
})(LocaleDataIndex || (LocaleDataIndex = {}));
var u = undefined;
function plural(n) {
  var i = Math.floor(Math.abs(n)), v = n.toString().replace(/^[^.]*\.?/, "").length;
  if (i === 1 && v === 0) return 1;
  return 5;
}
var localeEn = ["en", [["a", "p"], ["AM", "PM"], u], [["AM", "PM"], u, u], [["S", "M", "T", "W", "T", "F", "S"], ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]], u, [["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]], u, [["B", "A"], ["BC", "AD"], ["Before Christ", "Anno Domini"]], 0, [6, 0], ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"], ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"], ["{1}, {0}", u, "{1} 'at' {0}", u], [".", ",", ";", "%", "+", "-", "E", "×", "‰", "∞", "NaN", ":"], ["#,##0.###", "#,##0%", "¤#,##0.00", "#E0"], "$", "US Dollar", {}, plural];
function getLocalePluralCase(locale) {
  var data = findLocaleData(locale);
  return data[LocaleDataIndex.PluralCase];
}
exports.ɵgetLocalePluralCase = getLocalePluralCase;
function findLocaleData(locale) {
  var normalizedLocale = locale.toLowerCase().replace(/_/g, "-");
  var match = LOCALE_DATA[normalizedLocale];
  if (match) {
    return match;
  }
  var parentLocale = normalizedLocale.split("-")[0];
  match = LOCALE_DATA[parentLocale];
  if (match) {
    return match;
  }
  if (parentLocale === "en") {
    return localeEn;
  }
  throw new Error("Missing locale data for the locale \"" + locale + "\".");
}
exports.ɵfindLocaleData = findLocaleData;
function getPluralCase(value, locale) {
  var plural = getLocalePluralCase(locale)(value);
  switch (plural) {
    case 0:
      return "zero";
    case 1:
      return "one";
    case 2:
      return "two";
    case 3:
      return "few";
    case 4:
      return "many";
    default:
      return "other";
  }
}
var DEFAULT_LOCALE_ID = "en-US";
exports.ɵDEFAULT_LOCALE_ID = DEFAULT_LOCALE_ID;
var MARKER = "�";
var ICU_BLOCK_REGEXP = /^\s*(�\d+:?\d*�)\s*,\s*(select|plural)\s*,/;
var SUBTEMPLATE_REGEXP = /�\/?\*(\d+:\d+)�/gi;
var PH_REGEXP = /�(\/?[#*!]\d+):?\d*�/gi;
var BINDING_REGEXP = /�(\d+):?\d*�/gi;
var ICU_REGEXP = /({\s*�\d+:?\d*�\s*,\s*\S{6}\s*,[\s\S]*})/gi;
var ROOT_TEMPLATE_ID = 0;
var PP_MULTI_VALUE_PLACEHOLDERS_REGEXP = /\[(�.+?�?)\]/;
var PP_PLACEHOLDERS_REGEXP = /\[(�.+?�?)\]|(�\/?\*\d+:\d+�)/g;
var PP_ICU_VARS_REGEXP = /({\s*)(VAR_(PLURAL|SELECT)(_\d+)?)(\s*,)/g;
var PP_ICU_PLACEHOLDERS_REGEXP = /{([A-Z0-9_]+)}/g;
var PP_ICUS_REGEXP = /�I18N_EXP_(ICU(_\d+)?)�/g;
var PP_CLOSE_TEMPLATE_REGEXP = /\/\*/;
var PP_TEMPLATE_ID_REGEXP = /\d+\:(\d+)/;
function extractParts(pattern) {
  if (!pattern) {
    return [];
  }
  var prevPos = 0;
  var braceStack = [];
  var results = [];
  var braces = /[{}]/g;
  braces.lastIndex = 0;
  var match;
  while (match = braces.exec(pattern)) {
    var pos = match.index;
    if (match[0] == "}") {
      braceStack.pop();
      if (braceStack.length == 0) {
        var block = pattern.substring(prevPos, pos);
        if (ICU_BLOCK_REGEXP.test(block)) {
          results.push(parseICUBlock(block));
        } else {
          results.push(block);
        }
        prevPos = pos + 1;
      }
    } else {
      if (braceStack.length == 0) {
        var substring_1 = pattern.substring(prevPos, pos);
        results.push(substring_1);
        prevPos = pos + 1;
      }
      braceStack.push("{");
    }
  }
  var substring = pattern.substring(prevPos);
  results.push(substring);
  return results;
}
function parseICUBlock(pattern) {
  var cases = [];
  var values = [];
  var icuType = 1;
  var mainBinding = 0;
  pattern = pattern.replace(ICU_BLOCK_REGEXP, function (str, binding, type) {
    if (type === "select") {
      icuType = 0;
    } else {
      icuType = 1;
    }
    mainBinding = parseInt(binding.substr(1), 10);
    return "";
  });
  var parts = extractParts(pattern);
  for (var pos = 0; pos < parts.length; ) {
    var key = parts[pos++].trim();
    if (icuType === 1) {
      key = key.replace(/\s*(?:=)?(\w+)\s*/, "$1");
    }
    if (key.length) {
      cases.push(key);
    }
    var blocks = extractParts(parts[pos++]);
    if (cases.length > values.length) {
      values.push(blocks);
    }
  }
  assertGreaterThan(cases.indexOf("other"), -1, "Missing key \"other\" in ICU statement.");
  return {
    type: icuType,
    mainBinding: mainBinding,
    cases: cases,
    values: values
  };
}
function removeInnerTemplateTranslation(message) {
  var match;
  var res = "";
  var index = 0;
  var inTemplate = false;
  var tagMatched;
  while ((match = SUBTEMPLATE_REGEXP.exec(message)) !== null) {
    if (!inTemplate) {
      res += message.substring(index, match.index + match[0].length);
      tagMatched = match[1];
      inTemplate = true;
    } else {
      if (match[0] === MARKER + "/*" + tagMatched + MARKER) {
        index = match.index;
        inTemplate = false;
      }
    }
  }
  ngDevMode && assertEqual(inTemplate, false, "Tag mismatch: unable to find the end of the sub-template in the translation \"" + message + "\"");
  res += message.substr(index);
  return res;
}
function getTranslationForTemplate(message, subTemplateIndex) {
  if (typeof subTemplateIndex !== "number") {
    return removeInnerTemplateTranslation(message);
  } else {
    var start = message.indexOf(":" + subTemplateIndex + MARKER) + 2 + subTemplateIndex.toString().length;
    var end = message.search(new RegExp(MARKER + "\\/\\*\\d+:" + subTemplateIndex + MARKER));
    return removeInnerTemplateTranslation(message.substring(start, end));
  }
}
function generateBindingUpdateOpCodes(str, destinationNode, attrName, sanitizeFn) {
  if (sanitizeFn === void 0) {
    sanitizeFn = null;
  }
  var updateOpCodes = [null, null];
  var textParts = str.split(BINDING_REGEXP);
  var mask = 0;
  for (var j = 0; j < textParts.length; j++) {
    var textValue = textParts[j];
    if (j & 1) {
      var bindingIndex = parseInt(textValue, 10);
      updateOpCodes.push(-1 - bindingIndex);
      mask = mask | toMaskBit(bindingIndex);
    } else if (textValue !== "") {
      updateOpCodes.push(textValue);
    }
  }
  updateOpCodes.push(destinationNode << 2 | (attrName ? 1 : 0));
  if (attrName) {
    updateOpCodes.push(attrName, sanitizeFn);
  }
  updateOpCodes[0] = mask;
  updateOpCodes[1] = updateOpCodes.length - 2;
  return updateOpCodes;
}
function getBindingMask(icuExpression, mask) {
  if (mask === void 0) {
    mask = 0;
  }
  mask = mask | toMaskBit(icuExpression.mainBinding);
  var match;
  for (var i = 0; i < icuExpression.values.length; i++) {
    var valueArr = icuExpression.values[i];
    for (var j = 0; j < valueArr.length; j++) {
      var value = valueArr[j];
      if (typeof value === "string") {
        while (match = BINDING_REGEXP.exec(value)) {
          mask = mask | toMaskBit(parseInt(match[1], 10));
        }
      } else {
        mask = getBindingMask(value, mask);
      }
    }
  }
  return mask;
}
var i18nIndexStack = [];
var i18nIndexStackPointer = -1;
function toMaskBit(bindingIndex) {
  return 1 << Math.min(bindingIndex, 31);
}
var parentIndexStack = [];
function ɵɵi18nStart(index, message, subTemplateIndex) {
  var tView = getLView()[TVIEW];
  ngDevMode && assertDefined(tView, "tView should be defined");
  i18nIndexStack[++i18nIndexStackPointer] = index;
  setDelayProjection(true);
  if (tView.firstTemplatePass && tView.data[index + HEADER_OFFSET] === null) {
    i18nStartFirstPass(tView, index, message, subTemplateIndex);
  }
}
exports.ɵɵi18nStart = ɵɵi18nStart;
var i18nVarsCount;
function i18nStartFirstPass(tView, index, message, subTemplateIndex) {
  var viewData = getLView();
  var startIndex = tView.blueprint.length - HEADER_OFFSET;
  i18nVarsCount = 0;
  var previousOrParentTNode = getPreviousOrParentTNode();
  var parentTNode = getIsParent() ? getPreviousOrParentTNode() : previousOrParentTNode && previousOrParentTNode.parent;
  var parentIndex = parentTNode && parentTNode !== viewData[T_HOST] ? parentTNode.index - HEADER_OFFSET : index;
  var parentIndexPointer = 0;
  parentIndexStack[parentIndexPointer] = parentIndex;
  var createOpCodes = [];
  if (index > 0 && previousOrParentTNode !== parentTNode) {
    createOpCodes.push(previousOrParentTNode.index << 3 | 0);
  }
  var updateOpCodes = [];
  var icuExpressions = [];
  var templateTranslation = getTranslationForTemplate(message, subTemplateIndex);
  var msgParts = replaceNgsp(templateTranslation).split(PH_REGEXP);
  for (var i = 0; i < msgParts.length; i++) {
    var value = msgParts[i];
    if (i & 1) {
      if (value.charAt(0) === "/") {
        if (value.charAt(1) === "#") {
          var phIndex = parseInt(value.substr(2), 10);
          parentIndex = parentIndexStack[--parentIndexPointer];
          createOpCodes.push(phIndex << 3 | 5);
        }
      } else {
        var phIndex = parseInt(value.substr(1), 10);
        createOpCodes.push(phIndex << 3 | 0, parentIndex << 17 | 1);
        if (value.charAt(0) === "#") {
          parentIndexStack[++parentIndexPointer] = parentIndex = phIndex;
        }
      }
    } else {
      var parts = extractParts(value);
      for (var j = 0; j < parts.length; j++) {
        if (j & 1) {
          var icuNodeIndex = startIndex + i18nVarsCount++;
          createOpCodes.push(COMMENT_MARKER, ngDevMode ? "ICU " + icuNodeIndex : "", icuNodeIndex, parentIndex << 17 | 1);
          var icuExpression = parts[j];
          var mask = getBindingMask(icuExpression);
          icuStart(icuExpressions, icuExpression, icuNodeIndex, icuNodeIndex);
          var tIcuIndex = icuExpressions.length - 1;
          updateOpCodes.push(toMaskBit(icuExpression.mainBinding), 3, -1 - icuExpression.mainBinding, icuNodeIndex << 2 | 2, tIcuIndex, mask, 2, icuNodeIndex << 2 | 3, tIcuIndex);
        } else if (parts[j] !== "") {
          var text = parts[j];
          var hasBinding = text.match(BINDING_REGEXP);
          var textNodeIndex = startIndex + i18nVarsCount++;
          createOpCodes.push(hasBinding ? "" : text, textNodeIndex, parentIndex << 17 | 1);
          if (hasBinding) {
            addAllToArray(generateBindingUpdateOpCodes(text, textNodeIndex), updateOpCodes);
          }
        }
      }
    }
  }
  if (i18nVarsCount > 0) {
    allocExpando(viewData, i18nVarsCount);
  }
  ngDevMode && attachI18nOpCodesDebug(createOpCodes, updateOpCodes, icuExpressions.length ? icuExpressions : null, viewData);
  var tI18n = {
    vars: i18nVarsCount,
    create: createOpCodes,
    update: updateOpCodes,
    icus: icuExpressions.length ? icuExpressions : null
  };
  tView.data[index + HEADER_OFFSET] = tI18n;
}
function appendI18nNode(tNode, parentTNode, previousTNode, viewData) {
  ngDevMode && ngDevMode.rendererMoveNode++;
  var nextNode = tNode.next;
  if (!previousTNode) {
    previousTNode = parentTNode;
  }
  if (previousTNode === parentTNode && tNode !== parentTNode.child) {
    tNode.next = parentTNode.child;
    parentTNode.child = tNode;
  } else if (previousTNode !== parentTNode && tNode !== previousTNode.next) {
    tNode.next = previousTNode.next;
    previousTNode.next = tNode;
  } else {
    tNode.next = null;
  }
  if (parentTNode !== viewData[T_HOST]) {
    tNode.parent = parentTNode;
  }
  var cursor = tNode.next;
  while (cursor) {
    if (cursor.next === tNode) {
      cursor.next = nextNode;
    }
    cursor = cursor.next;
  }
  if (tNode.type === 1) {
    var tProjectionNode = tNode;
    appendProjectedNodes(viewData, tProjectionNode, tProjectionNode.projection, findComponentView(viewData));
    return tNode;
  }
  appendChild(getNativeByTNode(tNode, viewData), tNode, viewData);
  var slotValue = viewData[tNode.index];
  if (tNode.type !== 0 && isLContainer(slotValue)) {
    appendChild(slotValue[NATIVE], tNode, viewData);
  }
  return tNode;
}
function ɵɵi18nPostprocess(message, replacements) {
  if (replacements === void 0) {
    replacements = {};
  }
  var result = message;
  if (PP_MULTI_VALUE_PLACEHOLDERS_REGEXP.test(message)) {
    var matches_1 = {};
    var templateIdsStack_1 = [ROOT_TEMPLATE_ID];
    result = result.replace(PP_PLACEHOLDERS_REGEXP, function (m, phs, tmpl) {
      var content = phs || tmpl;
      var placeholders = matches_1[content] || [];
      if (!placeholders.length) {
        content.split("|").forEach(function (placeholder) {
          var match = placeholder.match(PP_TEMPLATE_ID_REGEXP);
          var templateId = match ? parseInt(match[1], 10) : ROOT_TEMPLATE_ID;
          var isCloseTemplateTag = PP_CLOSE_TEMPLATE_REGEXP.test(placeholder);
          placeholders.push([templateId, isCloseTemplateTag, placeholder]);
        });
        matches_1[content] = placeholders;
      }
      if (!placeholders.length) {
        throw new Error("i18n postprocess: unmatched placeholder - " + content);
      }
      var currentTemplateId = templateIdsStack_1[templateIdsStack_1.length - 1];
      var idx = 0;
      for (var i = 0; i < placeholders.length; i++) {
        if (placeholders[i][0] === currentTemplateId) {
          idx = i;
          break;
        }
      }
      var _a = tslib_1.__read(placeholders[idx], 3), templateId = _a[0], isCloseTemplateTag = _a[1], placeholder = _a[2];
      if (isCloseTemplateTag) {
        templateIdsStack_1.pop();
      } else if (currentTemplateId !== templateId) {
        templateIdsStack_1.push(templateId);
      }
      placeholders.splice(idx, 1);
      return placeholder;
    });
  }
  if (!Object.keys(replacements).length) {
    return result;
  }
  result = result.replace(PP_ICU_VARS_REGEXP, function (match, start, key, _type, _idx, end) {
    return replacements.hasOwnProperty(key) ? "" + start + replacements[key] + end : match;
  });
  result = result.replace(PP_ICU_PLACEHOLDERS_REGEXP, function (match, key) {
    return replacements.hasOwnProperty(key) ? replacements[key] : match;
  });
  result = result.replace(PP_ICUS_REGEXP, function (match, key) {
    if (replacements.hasOwnProperty(key)) {
      var list = replacements[key];
      if (!list.length) {
        throw new Error("i18n postprocess: unmatched ICU - " + match + " with key: " + key);
      }
      return list.shift();
    }
    return match;
  });
  return result;
}
exports.ɵɵi18nPostprocess = ɵɵi18nPostprocess;
function ɵɵi18nEnd() {
  var tView = getLView()[TVIEW];
  ngDevMode && assertDefined(tView, "tView should be defined");
  i18nEndFirstPass(tView);
  setDelayProjection(false);
}
exports.ɵɵi18nEnd = ɵɵi18nEnd;
function i18nEndFirstPass(tView) {
  var viewData = getLView();
  ngDevMode && assertEqual(viewData[BINDING_INDEX], viewData[TVIEW].bindingStartIndex, "i18nEnd should be called before any binding");
  var rootIndex = i18nIndexStack[i18nIndexStackPointer--];
  var tI18n = tView.data[rootIndex + HEADER_OFFSET];
  ngDevMode && assertDefined(tI18n, "You should call i18nStart before i18nEnd");
  var lastCreatedNode = getPreviousOrParentTNode();
  var visitedNodes = readCreateOpCodes(rootIndex, tI18n.create, tI18n.icus, viewData);
  for (var i = rootIndex + 1; i <= lastCreatedNode.index - HEADER_OFFSET; i++) {
    if (visitedNodes.indexOf(i) === -1) {
      removeNode(i, viewData);
    }
  }
}
function createDynamicNodeAtIndex(lView, index, type, native, name) {
  var previousOrParentTNode = getPreviousOrParentTNode();
  ngDevMode && assertDataInRange(lView, index + HEADER_OFFSET);
  lView[index + HEADER_OFFSET] = native;
  var tNode = getOrCreateTNode(lView[TVIEW], lView[T_HOST], index, type, name, null);
  if (previousOrParentTNode.next === tNode) {
    previousOrParentTNode.next = null;
  }
  return tNode;
}
function readCreateOpCodes(index, createOpCodes, icus, viewData) {
  var renderer = getLView()[RENDERER];
  var currentTNode = null;
  var previousTNode = null;
  var visitedNodes = [];
  for (var i = 0; i < createOpCodes.length; i++) {
    var opCode = createOpCodes[i];
    if (typeof opCode == "string") {
      var textRNode = createTextNode(opCode, renderer);
      var textNodeIndex = createOpCodes[++i];
      ngDevMode && ngDevMode.rendererCreateTextNode++;
      previousTNode = currentTNode;
      currentTNode = createDynamicNodeAtIndex(viewData, textNodeIndex, 3, textRNode, null);
      visitedNodes.push(textNodeIndex);
      setIsNotParent();
    } else if (typeof opCode == "number") {
      switch (opCode & 7) {
        case 1:
          var destinationNodeIndex = opCode >>> 17;
          var destinationTNode = void 0;
          if (destinationNodeIndex === index) {
            destinationTNode = viewData[T_HOST];
          } else {
            destinationTNode = getTNode(destinationNodeIndex, viewData);
          }
          ngDevMode && assertDefined(currentTNode, "You need to create or select a node before you can insert it into the DOM");
          previousTNode = appendI18nNode(currentTNode, destinationTNode, previousTNode, viewData);
          break;
        case 0:
          var nodeIndex = opCode >>> 3;
          visitedNodes.push(nodeIndex);
          previousTNode = currentTNode;
          currentTNode = getTNode(nodeIndex, viewData);
          if (currentTNode) {
            setPreviousOrParentTNode(currentTNode, currentTNode.type === 3);
          }
          break;
        case 5:
          var elementIndex = opCode >>> 3;
          previousTNode = currentTNode = getTNode(elementIndex, viewData);
          setPreviousOrParentTNode(currentTNode, false);
          break;
        case 4:
          var elementNodeIndex = opCode >>> 3;
          var attrName = createOpCodes[++i];
          var attrValue = createOpCodes[++i];
          elementAttributeInternal(elementNodeIndex, attrName, attrValue, viewData);
          break;
        default:
          throw new Error("Unable to determine the type of mutate operation for \"" + opCode + "\"");
      }
    } else {
      switch (opCode) {
        case COMMENT_MARKER:
          var commentValue = createOpCodes[++i];
          var commentNodeIndex = createOpCodes[++i];
          ngDevMode && assertEqual(typeof commentValue, "string", "Expected \"" + commentValue + "\" to be a comment node value");
          var commentRNode = renderer.createComment(commentValue);
          ngDevMode && ngDevMode.rendererCreateComment++;
          previousTNode = currentTNode;
          currentTNode = createDynamicNodeAtIndex(viewData, commentNodeIndex, 5, commentRNode, null);
          visitedNodes.push(commentNodeIndex);
          attachPatchData(commentRNode, viewData);
          currentTNode.activeCaseIndex = null;
          setIsNotParent();
          break;
        case ELEMENT_MARKER:
          var tagNameValue = createOpCodes[++i];
          var elementNodeIndex = createOpCodes[++i];
          ngDevMode && assertEqual(typeof tagNameValue, "string", "Expected \"" + tagNameValue + "\" to be an element node tag name");
          var elementRNode = renderer.createElement(tagNameValue);
          ngDevMode && ngDevMode.rendererCreateElement++;
          previousTNode = currentTNode;
          currentTNode = createDynamicNodeAtIndex(viewData, elementNodeIndex, 3, elementRNode, tagNameValue);
          visitedNodes.push(elementNodeIndex);
          break;
        default:
          throw new Error("Unable to determine the type of mutate operation for \"" + opCode + "\"");
      }
    }
  }
  setIsNotParent();
  return visitedNodes;
}
function readUpdateOpCodes(updateOpCodes, icus, bindingsStartIndex, changeMask, viewData, bypassCheckBit) {
  if (bypassCheckBit === void 0) {
    bypassCheckBit = false;
  }
  var caseCreated = false;
  for (var i = 0; i < updateOpCodes.length; i++) {
    var checkBit = updateOpCodes[i];
    var skipCodes = updateOpCodes[++i];
    if (bypassCheckBit || checkBit & changeMask) {
      var value = "";
      for (var j = i + 1; j <= i + skipCodes; j++) {
        var opCode = updateOpCodes[j];
        if (typeof opCode == "string") {
          value += opCode;
        } else if (typeof opCode == "number") {
          if (opCode < 0) {
            value += renderStringify(viewData[bindingsStartIndex - opCode]);
          } else {
            var nodeIndex = opCode >>> 2;
            var tIcuIndex = void 0;
            var tIcu = void 0;
            var icuTNode = void 0;
            switch (opCode & 3) {
              case 1:
                var propName = updateOpCodes[++j];
                var sanitizeFn = updateOpCodes[++j];
                elementPropertyInternal(nodeIndex, propName, value, sanitizeFn);
                break;
              case 0:
                textBindingInternal(viewData, nodeIndex, value);
                break;
              case 2:
                tIcuIndex = updateOpCodes[++j];
                tIcu = icus[tIcuIndex];
                icuTNode = getTNode(nodeIndex, viewData);
                if (icuTNode.activeCaseIndex !== null) {
                  var removeCodes = tIcu.remove[icuTNode.activeCaseIndex];
                  for (var k = 0; k < removeCodes.length; k++) {
                    var removeOpCode = removeCodes[k];
                    switch (removeOpCode & 7) {
                      case 3:
                        var nodeIndex_1 = removeOpCode >>> 3;
                        removeNode(nodeIndex_1, viewData);
                        break;
                      case 6:
                        var nestedIcuNodeIndex = removeCodes[k + 1] >>> 3;
                        var nestedIcuTNode = getTNode(nestedIcuNodeIndex, viewData);
                        var activeIndex = nestedIcuTNode.activeCaseIndex;
                        if (activeIndex !== null) {
                          var nestedIcuTIndex = removeOpCode >>> 3;
                          var nestedTIcu = icus[nestedIcuTIndex];
                          addAllToArray(nestedTIcu.remove[activeIndex], removeCodes);
                        }
                        break;
                    }
                  }
                }
                var caseIndex = getCaseIndex(tIcu, value);
                icuTNode.activeCaseIndex = caseIndex !== -1 ? caseIndex : null;
                readCreateOpCodes(-1, tIcu.create[caseIndex], icus, viewData);
                caseCreated = true;
                break;
              case 3:
                tIcuIndex = updateOpCodes[++j];
                tIcu = icus[tIcuIndex];
                icuTNode = getTNode(nodeIndex, viewData);
                readUpdateOpCodes(tIcu.update[icuTNode.activeCaseIndex], icus, bindingsStartIndex, changeMask, viewData, caseCreated);
                break;
            }
          }
        }
      }
    }
    i += skipCodes;
  }
}
function removeNode(index, viewData) {
  var removedPhTNode = getTNode(index, viewData);
  var removedPhRNode = getNativeByIndex(index, viewData);
  if (removedPhRNode) {
    nativeRemoveNode(viewData[RENDERER], removedPhRNode);
  }
  var slotValue = ɵɵload(index);
  if (isLContainer(slotValue)) {
    var lContainer = slotValue;
    if (removedPhTNode.type !== 0) {
      nativeRemoveNode(viewData[RENDERER], lContainer[NATIVE]);
    }
  }
  removedPhTNode.flags |= 32;
  ngDevMode && ngDevMode.rendererRemoveNode++;
}
function ɵɵi18n(index, message, subTemplateIndex) {
  ɵɵi18nStart(index, message, subTemplateIndex);
  ɵɵi18nEnd();
}
exports.ɵɵi18n = ɵɵi18n;
function ɵɵi18nAttributes(index, values) {
  var tView = getLView()[TVIEW];
  ngDevMode && assertDefined(tView, "tView should be defined");
  i18nAttributesFirstPass(tView, index, values);
}
exports.ɵɵi18nAttributes = ɵɵi18nAttributes;
function i18nAttributesFirstPass(tView, index, values) {
  var previousElement = getPreviousOrParentTNode();
  var previousElementIndex = previousElement.index - HEADER_OFFSET;
  var updateOpCodes = [];
  for (var i = 0; i < values.length; i += 2) {
    var attrName = values[i];
    var message = values[i + 1];
    var parts = message.split(ICU_REGEXP);
    for (var j = 0; j < parts.length; j++) {
      var value = parts[j];
      if (j & 1) {
        throw new Error("ICU expressions are not yet supported in attributes");
      } else if (value !== "") {
        var hasBinding = !!value.match(BINDING_REGEXP);
        if (hasBinding) {
          if (tView.firstTemplatePass && tView.data[index + HEADER_OFFSET] === null) {
            addAllToArray(generateBindingUpdateOpCodes(value, previousElementIndex, attrName), updateOpCodes);
          }
        } else {
          var lView = getLView();
          elementAttributeInternal(previousElementIndex, attrName, value, lView);
          var tNode = getTNode(previousElementIndex, lView);
          var dataValue = tNode.inputs && tNode.inputs[attrName];
          if (dataValue) {
            setInputsForProperty(lView, dataValue, value);
          }
        }
      }
    }
  }
  if (tView.firstTemplatePass && tView.data[index + HEADER_OFFSET] === null) {
    tView.data[index + HEADER_OFFSET] = updateOpCodes;
  }
}
var changeMask = 0;
var shiftsCounter = 0;
function ɵɵi18nExp(value) {
  var lView = getLView();
  var expression = bind(lView, value);
  if (expression !== NO_CHANGE) {
    changeMask = changeMask | 1 << shiftsCounter;
  }
  shiftsCounter++;
  return ɵɵi18nExp;
}
exports.ɵɵi18nExp = ɵɵi18nExp;
function ɵɵi18nApply(index) {
  if (shiftsCounter) {
    var lView = getLView();
    var tView = lView[TVIEW];
    ngDevMode && assertDefined(tView, "tView should be defined");
    var tI18n = tView.data[index + HEADER_OFFSET];
    var updateOpCodes = void 0;
    var icus = null;
    if (Array.isArray(tI18n)) {
      updateOpCodes = tI18n;
    } else {
      updateOpCodes = tI18n.update;
      icus = tI18n.icus;
    }
    var bindingsStartIndex = lView[BINDING_INDEX] - shiftsCounter - 1;
    readUpdateOpCodes(updateOpCodes, icus, bindingsStartIndex, changeMask, lView);
    changeMask = 0;
    shiftsCounter = 0;
  }
}
exports.ɵɵi18nApply = ɵɵi18nApply;
function getCaseIndex(icuExpression, bindingValue) {
  var index = icuExpression.cases.indexOf(bindingValue);
  if (index === -1) {
    switch (icuExpression.type) {
      case 1:
        {
          var resolvedCase = getPluralCase(bindingValue, getLocaleId());
          index = icuExpression.cases.indexOf(resolvedCase);
          if (index === -1 && resolvedCase !== "other") {
            index = icuExpression.cases.indexOf("other");
          }
          break;
        }
      case 0:
        {
          index = icuExpression.cases.indexOf("other");
          break;
        }
    }
  }
  return index;
}
function icuStart(tIcus, icuExpression, startIndex, expandoStartIndex) {
  var createCodes = [];
  var removeCodes = [];
  var updateCodes = [];
  var vars = [];
  var childIcus = [];
  for (var i = 0; i < icuExpression.values.length; i++) {
    var valueArr = icuExpression.values[i];
    var nestedIcus = [];
    for (var j = 0; j < valueArr.length; j++) {
      var value = valueArr[j];
      if (typeof value !== "string") {
        var icuIndex = nestedIcus.push(value) - 1;
        valueArr[j] = "<!--�" + icuIndex + "�-->";
      }
    }
    var icuCase = parseIcuCase(valueArr.join(""), startIndex, nestedIcus, tIcus, expandoStartIndex);
    createCodes.push(icuCase.create);
    removeCodes.push(icuCase.remove);
    updateCodes.push(icuCase.update);
    vars.push(icuCase.vars);
    childIcus.push(icuCase.childIcus);
  }
  var tIcu = {
    type: icuExpression.type,
    vars: vars,
    childIcus: childIcus,
    cases: icuExpression.cases,
    create: createCodes,
    remove: removeCodes,
    update: updateCodes
  };
  tIcus.push(tIcu);
  i18nVarsCount += Math.max.apply(Math, tslib_1.__spread(vars));
}
function parseIcuCase(unsafeHtml, parentIndex, nestedIcus, tIcus, expandoStartIndex) {
  var inertBodyHelper = new InertBodyHelper(document);
  var inertBodyElement = inertBodyHelper.getInertBodyElement(unsafeHtml);
  if (!inertBodyElement) {
    throw new Error("Unable to generate inert body element");
  }
  var wrapper = getTemplateContent(inertBodyElement) || inertBodyElement;
  var opCodes = {
    vars: 0,
    childIcus: [],
    create: [],
    remove: [],
    update: []
  };
  parseNodes(wrapper.firstChild, opCodes, parentIndex, nestedIcus, tIcus, expandoStartIndex);
  return opCodes;
}
var NESTED_ICU = /�(\d+)�/;
function parseNodes(currentNode, icuCase, parentIndex, nestedIcus, tIcus, expandoStartIndex) {
  if (currentNode) {
    var nestedIcusToCreate = [];
    while (currentNode) {
      var nextNode = currentNode.nextSibling;
      var newIndex = expandoStartIndex + ++icuCase.vars;
      switch (currentNode.nodeType) {
        case Node.ELEMENT_NODE:
          var element = currentNode;
          var tagName = element.tagName.toLowerCase();
          if (!VALID_ELEMENTS.hasOwnProperty(tagName)) {
            icuCase.vars--;
          } else {
            icuCase.create.push(ELEMENT_MARKER, tagName, newIndex, parentIndex << 17 | 1);
            var elAttrs = element.attributes;
            for (var i = 0; i < elAttrs.length; i++) {
              var attr = elAttrs.item(i);
              var lowerAttrName = attr.name.toLowerCase();
              var hasBinding_1 = !!attr.value.match(BINDING_REGEXP);
              if (hasBinding_1) {
                if (VALID_ATTRS.hasOwnProperty(lowerAttrName)) {
                  if (URI_ATTRS[lowerAttrName]) {
                    addAllToArray(generateBindingUpdateOpCodes(attr.value, newIndex, attr.name, _sanitizeUrl), icuCase.update);
                  } else if (SRCSET_ATTRS[lowerAttrName]) {
                    addAllToArray(generateBindingUpdateOpCodes(attr.value, newIndex, attr.name, sanitizeSrcset), icuCase.update);
                  } else {
                    addAllToArray(generateBindingUpdateOpCodes(attr.value, newIndex, attr.name), icuCase.update);
                  }
                } else {
                  ngDevMode && console.warn("WARNING: ignoring unsafe attribute value " + lowerAttrName + " on element " + tagName + " (see http://g.co/ng/security#xss)");
                }
              } else {
                icuCase.create.push(newIndex << 3 | 4, attr.name, attr.value);
              }
            }
            parseNodes(currentNode.firstChild, icuCase, newIndex, nestedIcus, tIcus, expandoStartIndex);
            icuCase.remove.push(newIndex << 3 | 3);
          }
          break;
        case Node.TEXT_NODE:
          var value = currentNode.textContent || "";
          var hasBinding = value.match(BINDING_REGEXP);
          icuCase.create.push(hasBinding ? "" : value, newIndex, parentIndex << 17 | 1);
          icuCase.remove.push(newIndex << 3 | 3);
          if (hasBinding) {
            addAllToArray(generateBindingUpdateOpCodes(value, newIndex), icuCase.update);
          }
          break;
        case Node.COMMENT_NODE:
          var match = NESTED_ICU.exec(currentNode.textContent || "");
          if (match) {
            var nestedIcuIndex = parseInt(match[1], 10);
            var newLocal = ngDevMode ? "nested ICU " + nestedIcuIndex : "";
            icuCase.create.push(COMMENT_MARKER, newLocal, newIndex, parentIndex << 17 | 1);
            var nestedIcu = nestedIcus[nestedIcuIndex];
            nestedIcusToCreate.push([nestedIcu, newIndex]);
          } else {
            icuCase.vars--;
          }
          break;
        default:
          icuCase.vars--;
      }
      currentNode = nextNode;
    }
    for (var i = 0; i < nestedIcusToCreate.length; i++) {
      var nestedIcu = nestedIcusToCreate[i][0];
      var nestedIcuNodeIndex = nestedIcusToCreate[i][1];
      icuStart(tIcus, nestedIcu, nestedIcuNodeIndex, expandoStartIndex + icuCase.vars);
      var nestTIcuIndex = tIcus.length - 1;
      icuCase.vars += Math.max.apply(Math, tslib_1.__spread(tIcus[nestTIcuIndex].vars));
      icuCase.childIcus.push(nestTIcuIndex);
      var mask = getBindingMask(nestedIcu);
      icuCase.update.push(toMaskBit(nestedIcu.mainBinding), 3, -1 - nestedIcu.mainBinding, nestedIcuNodeIndex << 2 | 2, nestTIcuIndex, mask, 2, nestedIcuNodeIndex << 2 | 3, nestTIcuIndex);
      icuCase.remove.push(nestTIcuIndex << 3 | 6, nestedIcuNodeIndex << 3 | 3);
    }
  }
}
var NGSP_UNICODE_REGEXP = /\uE500/g;
function replaceNgsp(value) {
  return value.replace(NGSP_UNICODE_REGEXP, " ");
}
var TRANSLATIONS = {};
function i18nConfigureLocalize(options) {
  if (options === void 0) {
    options = {
      translations: {}
    };
  }
  TRANSLATIONS = options.translations;
}
exports.ɵi18nConfigureLocalize = i18nConfigureLocalize;
var LOCALIZE_PH_REGEXP = /\{\$(.*?)\}/g;
function ɵɵi18nLocalize(input, placeholders) {
  if (typeof TRANSLATIONS[input] !== "undefined") {
    input = TRANSLATIONS[input];
  }
  if (placeholders !== undefined && Object.keys(placeholders).length) {
    return input.replace(LOCALIZE_PH_REGEXP, function (_, key) {
      return placeholders[key] || "";
    });
  }
  return input;
}
exports.ɵɵi18nLocalize = ɵɵi18nLocalize;
var LOCALE_ID = DEFAULT_LOCALE_ID;
function setLocaleId(localeId) {
  assertDefined(localeId, "Expected localeId to be defined");
  if (typeof localeId === "string") {
    LOCALE_ID = localeId.toLowerCase().replace(/_/g, "-");
  }
}
exports.ɵsetLocaleId = setLocaleId;
function getLocaleId() {
  return LOCALE_ID;
}
var modules = new Map();
function registerModuleFactory(id, factory) {
  var existing = modules.get(id);
  assertSameOrNotExisting(id, existing && existing.moduleType, factory.moduleType);
  modules.set(id, factory);
}
exports.ɵregisterModuleFactory = registerModuleFactory;
function assertSameOrNotExisting(id, type, incoming) {
  if (type && type !== incoming) {
    throw new Error("Duplicate module registered for " + id + " - " + stringify(type) + " vs " + stringify(type.name));
  }
}
function registerNgModuleType(ngModuleType) {
  if (ngModuleType.ngModuleDef.id !== null) {
    var id = ngModuleType.ngModuleDef.id;
    var existing = modules.get(id);
    assertSameOrNotExisting(id, existing, ngModuleType);
    modules.set(id, ngModuleType);
  }
  var imports = ngModuleType.ngModuleDef.imports;
  if (imports instanceof Function) {
    imports = imports();
  }
  if (imports) {
    imports.forEach(function (i) {
      return registerNgModuleType(i);
    });
  }
}
exports.ɵregisterNgModuleType = registerNgModuleType;
function clearModulesForTest() {
  modules.clear();
}
function getRegisteredNgModuleType(id) {
  return modules.get(id);
}
var COMPONENT_FACTORY_RESOLVER = {
  provide: ComponentFactoryResolver,
  useClass: ComponentFactoryResolver$1,
  deps: [NgModuleRef]
};
var NgModuleRef$1 = (function (_super) {
  tslib_1.__extends(NgModuleRef$1, _super);
  function NgModuleRef$1(ngModuleType, _parent) {
    var _this = _super.call(this) || this;
    _this._parent = _parent;
    _this._bootstrapComponents = [];
    _this.injector = _this;
    _this.destroyCbs = [];
    var ngModuleDef = getNgModuleDef(ngModuleType);
    ngDevMode && assertDefined(ngModuleDef, "NgModule '" + stringify(ngModuleType) + "' is not a subtype of 'NgModuleType'.");
    var ngLocaleIdDef = getNgLocaleIdDef(ngModuleType);
    if (ngLocaleIdDef) {
      setLocaleId(ngLocaleIdDef);
    }
    _this._bootstrapComponents = maybeUnwrapFn(ngModuleDef.bootstrap);
    var additionalProviders = [{
      provide: NgModuleRef,
      useValue: _this
    }, COMPONENT_FACTORY_RESOLVER];
    _this._r3Injector = createInjector(ngModuleType, _parent, additionalProviders, stringify(ngModuleType));
    _this.instance = _this.get(ngModuleType);
    return _this;
  }
  exports.ɵRender3NgModuleRef = NgModuleRef$1;
  NgModuleRef$1.prototype.get = function (token, notFoundValue, injectFlags) {
    if (notFoundValue === void 0) {
      notFoundValue = Injector.THROW_IF_NOT_FOUND;
    }
    if (injectFlags === void 0) {
      injectFlags = InjectFlags.Default;
    }
    if (token === Injector || token === NgModuleRef || token === INJECTOR) {
      return this;
    }
    return this._r3Injector.get(token, notFoundValue, injectFlags);
  };
  Object.defineProperty(NgModuleRef$1.prototype, "componentFactoryResolver", {
    get: function () {
      return this.get(ComponentFactoryResolver);
    },
    enumerable: true,
    configurable: true
  });
  NgModuleRef$1.prototype.destroy = function () {
    ngDevMode && assertDefined(this.destroyCbs, "NgModule already destroyed");
    var injector = this._r3Injector;
    !injector.destroyed && injector.destroy();
    this.destroyCbs.forEach(function (fn) {
      return fn();
    });
    this.destroyCbs = null;
  };
  NgModuleRef$1.prototype.onDestroy = function (callback) {
    ngDevMode && assertDefined(this.destroyCbs, "NgModule already destroyed");
    this.destroyCbs.push(callback);
  };
  return NgModuleRef$1;
})(NgModuleRef);
exports.ɵRender3NgModuleRef = NgModuleRef$1;
var NgModuleFactory$1 = (function (_super) {
  tslib_1.__extends(NgModuleFactory, _super);
  function NgModuleFactory(moduleType) {
    var _this = _super.call(this) || this;
    _this.moduleType = moduleType;
    var ngModuleDef = getNgModuleDef(moduleType);
    if (ngModuleDef !== null) {
      registerNgModuleType(moduleType);
    }
    return _this;
  }
  exports.NgModuleFactory = NgModuleFactory;
  NgModuleFactory.prototype.create = function (parentInjector) {
    return new NgModuleRef$1(this.moduleType, parentInjector);
  };
  return NgModuleFactory;
})(NgModuleFactory);
exports.ɵNgModuleFactory = NgModuleFactory$1;
function setClassMetadata(type, decorators, ctorParameters, propDecorators) {
  return noSideEffects(function () {
    var _a;
    var clazz = type;
    var parentPrototype = clazz.prototype ? Object.getPrototypeOf(clazz.prototype) : null;
    var parentConstructor = parentPrototype && parentPrototype.constructor;
    if (decorators !== null) {
      if (clazz.decorators !== undefined && (!parentConstructor || parentConstructor.decorators !== clazz.decorators)) {
        (_a = clazz.decorators).push.apply(_a, tslib_1.__spread(decorators));
      } else {
        clazz.decorators = decorators;
      }
    }
    if (ctorParameters !== null) {
      clazz.ctorParameters = ctorParameters;
    }
    if (propDecorators !== null) {
      if (clazz.propDecorators !== undefined && (!parentConstructor || parentConstructor.propDecorators !== clazz.propDecorators)) {
        clazz.propDecorators = tslib_1.__assign({}, clazz.propDecorators, propDecorators);
      } else {
        clazz.propDecorators = propDecorators;
      }
    }
  });
}
exports.ɵsetClassMetadata = setClassMetadata;
function ɵɵpureFunction0(slotOffset, pureFn, thisArg) {
  var bindingIndex = getBindingRoot() + slotOffset;
  var lView = getLView();
  return isCreationMode() ? updateBinding(lView, bindingIndex, thisArg ? pureFn.call(thisArg) : pureFn()) : getBinding(lView, bindingIndex);
}
exports.ɵɵpureFunction0 = ɵɵpureFunction0;
function ɵɵpureFunction1(slotOffset, pureFn, exp, thisArg) {
  var lView = getLView();
  var bindingIndex = getBindingRoot() + slotOffset;
  return bindingUpdated(lView, bindingIndex, exp) ? updateBinding(lView, bindingIndex + 1, thisArg ? pureFn.call(thisArg, exp) : pureFn(exp)) : getBinding(lView, bindingIndex + 1);
}
exports.ɵɵpureFunction1 = ɵɵpureFunction1;
function ɵɵpureFunction2(slotOffset, pureFn, exp1, exp2, thisArg) {
  var bindingIndex = getBindingRoot() + slotOffset;
  var lView = getLView();
  return bindingUpdated2(lView, bindingIndex, exp1, exp2) ? updateBinding(lView, bindingIndex + 2, thisArg ? pureFn.call(thisArg, exp1, exp2) : pureFn(exp1, exp2)) : getBinding(lView, bindingIndex + 2);
}
exports.ɵɵpureFunction2 = ɵɵpureFunction2;
function ɵɵpureFunction3(slotOffset, pureFn, exp1, exp2, exp3, thisArg) {
  var bindingIndex = getBindingRoot() + slotOffset;
  var lView = getLView();
  return bindingUpdated3(lView, bindingIndex, exp1, exp2, exp3) ? updateBinding(lView, bindingIndex + 3, thisArg ? pureFn.call(thisArg, exp1, exp2, exp3) : pureFn(exp1, exp2, exp3)) : getBinding(lView, bindingIndex + 3);
}
exports.ɵɵpureFunction3 = ɵɵpureFunction3;
function ɵɵpureFunction4(slotOffset, pureFn, exp1, exp2, exp3, exp4, thisArg) {
  var bindingIndex = getBindingRoot() + slotOffset;
  var lView = getLView();
  return bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4) ? updateBinding(lView, bindingIndex + 4, thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4) : pureFn(exp1, exp2, exp3, exp4)) : getBinding(lView, bindingIndex + 4);
}
exports.ɵɵpureFunction4 = ɵɵpureFunction4;
function ɵɵpureFunction5(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, thisArg) {
  var bindingIndex = getBindingRoot() + slotOffset;
  var lView = getLView();
  var different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  return bindingUpdated(lView, bindingIndex + 4, exp5) || different ? updateBinding(lView, bindingIndex + 5, thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5) : pureFn(exp1, exp2, exp3, exp4, exp5)) : getBinding(lView, bindingIndex + 5);
}
exports.ɵɵpureFunction5 = ɵɵpureFunction5;
function ɵɵpureFunction6(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, exp6, thisArg) {
  var bindingIndex = getBindingRoot() + slotOffset;
  var lView = getLView();
  var different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  return bindingUpdated2(lView, bindingIndex + 4, exp5, exp6) || different ? updateBinding(lView, bindingIndex + 6, thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6) : pureFn(exp1, exp2, exp3, exp4, exp5, exp6)) : getBinding(lView, bindingIndex + 6);
}
exports.ɵɵpureFunction6 = ɵɵpureFunction6;
function ɵɵpureFunction7(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, exp6, exp7, thisArg) {
  var bindingIndex = getBindingRoot() + slotOffset;
  var lView = getLView();
  var different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  return bindingUpdated3(lView, bindingIndex + 4, exp5, exp6, exp7) || different ? updateBinding(lView, bindingIndex + 7, thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6, exp7) : pureFn(exp1, exp2, exp3, exp4, exp5, exp6, exp7)) : getBinding(lView, bindingIndex + 7);
}
exports.ɵɵpureFunction7 = ɵɵpureFunction7;
function ɵɵpureFunction8(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8, thisArg) {
  var bindingIndex = getBindingRoot() + slotOffset;
  var lView = getLView();
  var different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  return bindingUpdated4(lView, bindingIndex + 4, exp5, exp6, exp7, exp8) || different ? updateBinding(lView, bindingIndex + 8, thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8) : pureFn(exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8)) : getBinding(lView, bindingIndex + 8);
}
exports.ɵɵpureFunction8 = ɵɵpureFunction8;
function ɵɵpureFunctionV(slotOffset, pureFn, exps, thisArg) {
  var bindingIndex = getBindingRoot() + slotOffset;
  var different = false;
  var lView = getLView();
  for (var i = 0; i < exps.length; i++) {
    bindingUpdated(lView, bindingIndex++, exps[i]) && (different = true);
  }
  return different ? updateBinding(lView, bindingIndex, pureFn.apply(thisArg, exps)) : getBinding(lView, bindingIndex);
}
exports.ɵɵpureFunctionV = ɵɵpureFunctionV;
function ɵɵpipe(index, pipeName) {
  var tView = getLView()[TVIEW];
  var pipeDef;
  exports.ɵpid = pipeDef;
  var adjustedIndex = index + HEADER_OFFSET;
  if (tView.firstTemplatePass) {
    pipeDef = getPipeDef$1(pipeName, tView.pipeRegistry);
    tView.data[adjustedIndex] = pipeDef;
    if (pipeDef.onDestroy) {
      (tView.destroyHooks || (tView.destroyHooks = [])).push(adjustedIndex, pipeDef.onDestroy);
    }
  } else {
    pipeDef = tView.data[adjustedIndex];
  }
  var pipeInstance = pipeDef.factory();
  store(index, pipeInstance);
  return pipeInstance;
}
exports.ɵɵpipe = ɵɵpipe;
function getPipeDef$1(name, registry) {
  if (registry) {
    for (var i = registry.length - 1; i >= 0; i--) {
      var pipeDef = registry[i];
      exports.ɵpid = pipeDef;
      if (name === pipeDef.name) {
        return pipeDef;
      }
    }
  }
  throw new Error("The pipe '" + name + "' could not be found!");
}
function ɵɵpipeBind1(index, slotOffset, v1) {
  var pipeInstance = ɵɵload(index);
  return unwrapValue$1(isPure(index) ? ɵɵpureFunction1(slotOffset, pipeInstance.transform, v1, pipeInstance) : pipeInstance.transform(v1));
}
exports.ɵɵpipeBind1 = ɵɵpipeBind1;
function ɵɵpipeBind2(index, slotOffset, v1, v2) {
  var pipeInstance = ɵɵload(index);
  return unwrapValue$1(isPure(index) ? ɵɵpureFunction2(slotOffset, pipeInstance.transform, v1, v2, pipeInstance) : pipeInstance.transform(v1, v2));
}
exports.ɵɵpipeBind2 = ɵɵpipeBind2;
function ɵɵpipeBind3(index, slotOffset, v1, v2, v3) {
  var pipeInstance = ɵɵload(index);
  return unwrapValue$1(isPure(index) ? ɵɵpureFunction3(slotOffset, pipeInstance.transform, v1, v2, v3, pipeInstance) : pipeInstance.transform(v1, v2, v3));
}
exports.ɵɵpipeBind3 = ɵɵpipeBind3;
function ɵɵpipeBind4(index, slotOffset, v1, v2, v3, v4) {
  var pipeInstance = ɵɵload(index);
  return unwrapValue$1(isPure(index) ? ɵɵpureFunction4(slotOffset, pipeInstance.transform, v1, v2, v3, v4, pipeInstance) : pipeInstance.transform(v1, v2, v3, v4));
}
exports.ɵɵpipeBind4 = ɵɵpipeBind4;
function ɵɵpipeBindV(index, slotOffset, values) {
  var pipeInstance = ɵɵload(index);
  return unwrapValue$1(isPure(index) ? ɵɵpureFunctionV(slotOffset, pipeInstance.transform, values, pipeInstance) : pipeInstance.transform.apply(pipeInstance, values));
}
exports.ɵɵpipeBindV = ɵɵpipeBindV;
function isPure(index) {
  return getLView()[TVIEW].data[index + HEADER_OFFSET].pure;
}
function unwrapValue$1(newValue) {
  if (WrappedValue.isWrapped(newValue)) {
    newValue = WrappedValue.unwrap(newValue);
    var lView = getLView();
    var bindingToInvalidateIdx = lView[BINDING_INDEX];
    lView[bindingToInvalidateIdx] = NO_CHANGE;
  }
  return newValue;
}
var EventEmitter = (function (_super) {
  tslib_1.__extends(EventEmitter, _super);
  function EventEmitter(isAsync) {
    if (isAsync === void 0) {
      isAsync = false;
    }
    var _this = _super.call(this) || this;
    _this.__isAsync = isAsync;
    return _this;
  }
  exports.EventEmitter = EventEmitter;
  EventEmitter.prototype.emit = function (value) {
    _super.prototype.next.call(this, value);
  };
  EventEmitter.prototype.subscribe = function (generatorOrNext, error, complete) {
    var schedulerFn;
    var errorFn = function (err) {
      return null;
    };
    var completeFn = function () {
      return null;
    };
    if (generatorOrNext && typeof generatorOrNext === "object") {
      schedulerFn = this.__isAsync ? function (value) {
        setTimeout(function () {
          return generatorOrNext.next(value);
        });
      } : function (value) {
        generatorOrNext.next(value);
      };
      if (generatorOrNext.error) {
        errorFn = this.__isAsync ? function (err) {
          setTimeout(function () {
            return generatorOrNext.error(err);
          });
        } : function (err) {
          generatorOrNext.error(err);
        };
      }
      if (generatorOrNext.complete) {
        completeFn = this.__isAsync ? function () {
          setTimeout(function () {
            return generatorOrNext.complete();
          });
        } : function () {
          generatorOrNext.complete();
        };
      }
    } else {
      schedulerFn = this.__isAsync ? function (value) {
        setTimeout(function () {
          return generatorOrNext(value);
        });
      } : function (value) {
        generatorOrNext(value);
      };
      if (error) {
        errorFn = this.__isAsync ? function (err) {
          setTimeout(function () {
            return error(err);
          });
        } : function (err) {
          error(err);
        };
      }
      if (complete) {
        completeFn = this.__isAsync ? function () {
          setTimeout(function () {
            return complete();
          });
        } : function () {
          complete();
        };
      }
    }
    var sink = _super.prototype.subscribe.call(this, schedulerFn, errorFn, completeFn);
    if (generatorOrNext instanceof rxjs_2.Subscription) {
      generatorOrNext.add(sink);
    }
    return sink;
  };
  return EventEmitter;
})(rxjs_2.Subject);
exports.EventEmitter = EventEmitter;
function symbolIterator() {
  return this._results[getSymbolIterator()]();
}
var QueryList = (function () {
  function QueryList() {
    this.dirty = true;
    this._results = [];
    this.changes = new EventEmitter();
    this.length = 0;
    var symbol = getSymbolIterator();
    var proto = QueryList.prototype;
    if (!proto[symbol]) proto[symbol] = symbolIterator;
  }
  exports.QueryList = QueryList;
  QueryList.prototype.map = function (fn) {
    return this._results.map(fn);
  };
  QueryList.prototype.filter = function (fn) {
    return this._results.filter(fn);
  };
  QueryList.prototype.find = function (fn) {
    return this._results.find(fn);
  };
  QueryList.prototype.reduce = function (fn, init) {
    return this._results.reduce(fn, init);
  };
  QueryList.prototype.forEach = function (fn) {
    this._results.forEach(fn);
  };
  QueryList.prototype.some = function (fn) {
    return this._results.some(fn);
  };
  QueryList.prototype.toArray = function () {
    return this._results.slice();
  };
  QueryList.prototype.toString = function () {
    return this._results.toString();
  };
  QueryList.prototype.reset = function (resultsTree) {
    this._results = flatten(resultsTree);
    this.dirty = false;
    this.length = this._results.length;
    this.last = this._results[this.length - 1];
    this.first = this._results[0];
  };
  QueryList.prototype.notifyOnChanges = function () {
    this.changes.emit(this);
  };
  QueryList.prototype.setDirty = function () {
    this.dirty = true;
  };
  QueryList.prototype.destroy = function () {
    this.changes.complete();
    this.changes.unsubscribe();
  };
  return QueryList;
})();
exports.QueryList = QueryList;
var unusedValueExportToPlacateAjd$7 = 1;
var unusedValueExportToPlacateAjd$8 = 1;
var unusedValueToPlacateAjd$2 = unusedValueExportToPlacateAjd$7 + unusedValueExportToPlacateAjd$2 + unusedValueExportToPlacateAjd$4 + unusedValueExportToPlacateAjd$8;
var LQuery_ = (function () {
  function LQuery_(queryList) {
    this.queryList = queryList;
    this.matches = null;
  }
  LQuery_.prototype.clone = function () {
    return new LQuery_(this.queryList);
  };
  LQuery_.prototype.setDirty = function () {
    this.queryList.setDirty();
  };
  return LQuery_;
})();
var LQueries_ = (function () {
  function LQueries_(queries) {
    if (queries === void 0) {
      queries = [];
    }
    this.queries = queries;
  }
  LQueries_.prototype.createEmbeddedView = function (tView) {
    var tQueries = tView.queries;
    if (tQueries !== null) {
      var noOfInheritedQueries = tView.contentQueries !== null ? tView.contentQueries[0] : tQueries.length;
      var viewLQueries = new Array(noOfInheritedQueries);
      for (var i = 0; i < noOfInheritedQueries; i++) {
        var tQuery = tQueries.getByIndex(i);
        var parentLQuery = this.queries[tQuery.indexInDeclarationView];
        viewLQueries[i] = parentLQuery.clone();
      }
      return new LQueries_(viewLQueries);
    }
    return null;
  };
  LQueries_.prototype.insertView = function (tView) {
    this.dirtyQueriesWithMatches(tView);
  };
  LQueries_.prototype.detachView = function (tView) {
    this.dirtyQueriesWithMatches(tView);
  };
  LQueries_.prototype.dirtyQueriesWithMatches = function (tView) {
    for (var i = 0; i < this.queries.length; i++) {
      if (getTQuery(tView, i).matches !== null) {
        this.queries[i].setDirty();
      }
    }
  };
  return LQueries_;
})();
var TQueryMetadata_ = (function () {
  function TQueryMetadata_(predicate, descendants, isStatic, read) {
    if (read === void 0) {
      read = null;
    }
    this.predicate = predicate;
    this.descendants = descendants;
    this.isStatic = isStatic;
    this.read = read;
  }
  return TQueryMetadata_;
})();
var TQueries_ = (function () {
  function TQueries_(queries) {
    if (queries === void 0) {
      queries = [];
    }
    this.queries = queries;
  }
  TQueries_.prototype.elementStart = function (tView, tNode) {
    var e_1, _a;
    ngDevMode && assertFirstTemplatePass(tView, "Queries should collect results on the first template pass only");
    try {
      for (var _b = tslib_1.__values(this.queries), _c = _b.next(); !_c.done; _c = _b.next()) {
        var query = _c.value;
        query.elementStart(tView, tNode);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };
  TQueries_.prototype.elementEnd = function (tNode) {
    var e_2, _a;
    try {
      for (var _b = tslib_1.__values(this.queries), _c = _b.next(); !_c.done; _c = _b.next()) {
        var query = _c.value;
        query.elementEnd(tNode);
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  };
  TQueries_.prototype.embeddedTView = function (tNode) {
    var queriesForTemplateRef = null;
    for (var i = 0; i < this.length; i++) {
      var childQueryIndex = queriesForTemplateRef !== null ? queriesForTemplateRef.length : 0;
      var tqueryClone = this.getByIndex(i).embeddedTView(tNode, childQueryIndex);
      if (tqueryClone) {
        tqueryClone.indexInDeclarationView = i;
        if (queriesForTemplateRef !== null) {
          queriesForTemplateRef.push(tqueryClone);
        } else {
          queriesForTemplateRef = [tqueryClone];
        }
      }
    }
    return queriesForTemplateRef !== null ? new TQueries_(queriesForTemplateRef) : null;
  };
  TQueries_.prototype.template = function (tView, tNode) {
    var e_3, _a;
    ngDevMode && assertFirstTemplatePass(tView, "Queries should collect results on the first template pass only");
    try {
      for (var _b = tslib_1.__values(this.queries), _c = _b.next(); !_c.done; _c = _b.next()) {
        var query = _c.value;
        query.template(tView, tNode);
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
  };
  TQueries_.prototype.getByIndex = function (index) {
    ngDevMode && assertDataInRange(this.queries, index);
    return this.queries[index];
  };
  Object.defineProperty(TQueries_.prototype, "length", {
    get: function () {
      return this.queries.length;
    },
    enumerable: true,
    configurable: true
  });
  TQueries_.prototype.track = function (tquery) {
    this.queries.push(tquery);
  };
  return TQueries_;
})();
var TQuery_ = (function () {
  function TQuery_(metadata, nodeIndex) {
    if (nodeIndex === void 0) {
      nodeIndex = -1;
    }
    this.metadata = metadata;
    this.matches = null;
    this.indexInDeclarationView = -1;
    this.crossesNgTemplate = false;
    this._appliesToNextNode = true;
    this._declarationNodeIndex = nodeIndex;
  }
  TQuery_.prototype.elementStart = function (tView, tNode) {
    if (this.isApplyingToNode(tNode)) {
      this.matchTNode(tView, tNode);
    }
  };
  TQuery_.prototype.elementEnd = function (tNode) {
    if (this._declarationNodeIndex === tNode.index) {
      this._appliesToNextNode = false;
    }
  };
  TQuery_.prototype.template = function (tView, tNode) {
    this.elementStart(tView, tNode);
  };
  TQuery_.prototype.embeddedTView = function (tNode, childQueryIndex) {
    if (this.isApplyingToNode(tNode)) {
      this.crossesNgTemplate = true;
      this.addMatch(-tNode.index, childQueryIndex);
      return new TQuery_(this.metadata);
    }
    return null;
  };
  TQuery_.prototype.isApplyingToNode = function (tNode) {
    if (this._appliesToNextNode && this.metadata.descendants === false) {
      return this._declarationNodeIndex === (tNode.parent ? tNode.parent.index : -1);
    }
    return this._appliesToNextNode;
  };
  TQuery_.prototype.matchTNode = function (tView, tNode) {
    if (Array.isArray(this.metadata.predicate)) {
      var localNames = this.metadata.predicate;
      for (var i = 0; i < localNames.length; i++) {
        this.matchTNodeWithReadOption(tView, tNode, getIdxOfMatchingSelector(tNode, localNames[i]));
      }
    } else {
      var typePredicate = this.metadata.predicate;
      if (typePredicate === TemplateRef) {
        if (tNode.type === 0) {
          this.matchTNodeWithReadOption(tView, tNode, -1);
        }
      } else {
        this.matchTNodeWithReadOption(tView, tNode, locateDirectiveOrProvider(tNode, tView, typePredicate, false, false));
      }
    }
  };
  TQuery_.prototype.matchTNodeWithReadOption = function (tView, tNode, nodeMatchIdx) {
    if (nodeMatchIdx !== null) {
      var read = this.metadata.read;
      if (read !== null) {
        if (read === ElementRef || read === ViewContainerRef || read === TemplateRef && tNode.type === 0) {
          this.addMatch(tNode.index, -2);
        } else {
          var directiveOrProviderIdx = locateDirectiveOrProvider(tNode, tView, read, false, false);
          if (directiveOrProviderIdx !== null) {
            this.addMatch(tNode.index, directiveOrProviderIdx);
          }
        }
      } else {
        this.addMatch(tNode.index, nodeMatchIdx);
      }
    }
  };
  TQuery_.prototype.addMatch = function (tNodeIdx, matchIdx) {
    if (this.matches === null) {
      this.matches = [tNodeIdx, matchIdx];
    } else {
      this.matches.push(tNodeIdx, matchIdx);
    }
  };
  return TQuery_;
})();
function getIdxOfMatchingSelector(tNode, selector) {
  var localNames = tNode.localNames;
  if (localNames !== null) {
    for (var i = 0; i < localNames.length; i += 2) {
      if (localNames[i] === selector) {
        return localNames[i + 1];
      }
    }
  }
  return null;
}
function createResultByTNodeType(tNode, currentView) {
  if (tNode.type === 3 || tNode.type === 4) {
    return createElementRef(ElementRef, tNode, currentView);
  } else if (tNode.type === 0) {
    return createTemplateRef(TemplateRef, ElementRef, tNode, currentView);
  }
  return null;
}
function createResultForNode(lView, tNode, matchingIdx, read) {
  if (matchingIdx === -1) {
    return createResultByTNodeType(tNode, lView);
  } else if (matchingIdx === -2) {
    return createSpecialToken(lView, tNode, read);
  } else {
    return getNodeInjectable(lView[TVIEW].data, lView, matchingIdx, tNode);
  }
}
function createSpecialToken(lView, tNode, read) {
  if (read === ElementRef) {
    return createElementRef(ElementRef, tNode, lView);
  } else if (read === TemplateRef) {
    return createTemplateRef(TemplateRef, ElementRef, tNode, lView);
  } else if (read === ViewContainerRef) {
    ngDevMode && assertNodeOfPossibleTypes(tNode, 3, 0, 4);
    return createContainerRef(ViewContainerRef, ElementRef, tNode, lView);
  } else {
    ngDevMode && throwError("Special token to read should be one of ElementRef, TemplateRef or ViewContainerRef but got " + stringify(read) + ".");
  }
}
function materializeViewResults(lView, tQuery, queryIndex) {
  var lQuery = lView[QUERIES].queries[queryIndex];
  if (lQuery.matches === null) {
    var tViewData = lView[TVIEW].data;
    var tQueryMatches = tQuery.matches;
    var result = new Array(tQueryMatches.length / 2);
    for (var i = 0; i < tQueryMatches.length; i += 2) {
      var matchedNodeIdx = tQueryMatches[i];
      if (matchedNodeIdx < 0) {
        result[i / 2] = null;
      } else {
        ngDevMode && assertDataInRange(tViewData, matchedNodeIdx);
        var tNode = tViewData[matchedNodeIdx];
        result[i / 2] = createResultForNode(lView, tNode, tQueryMatches[i + 1], tQuery.metadata.read);
      }
    }
    lQuery.matches = result;
  }
  return lQuery.matches;
}
function collectQueryResults(lView, queryIndex, result) {
  var e_4, _a;
  var tQuery = lView[TVIEW].queries.getByIndex(queryIndex);
  var tQueryMatches = tQuery.matches;
  if (tQueryMatches !== null) {
    var lViewResults = materializeViewResults(lView, tQuery, queryIndex);
    for (var i = 0; i < tQueryMatches.length; i += 2) {
      var tNodeIdx = tQueryMatches[i];
      if (tNodeIdx > 0) {
        var viewResult = lViewResults[i / 2];
        ngDevMode && assertDefined(viewResult, "materialized query result should be defined");
        result.push(viewResult);
      } else {
        var childQueryIndex = tQueryMatches[i + 1];
        var declarationLContainer = lView[-tNodeIdx];
        ngDevMode && assertLContainer(declarationLContainer);
        for (var i_1 = CONTAINER_HEADER_OFFSET; i_1 < declarationLContainer.length; i_1++) {
          var embeddedLView = declarationLContainer[i_1];
          if (embeddedLView[DECLARATION_LCONTAINER] === embeddedLView[PARENT]) {
            collectQueryResults(embeddedLView, childQueryIndex, result);
          }
        }
        if (declarationLContainer[MOVED_VIEWS] !== null) {
          try {
            for (var _b = (e_4 = void 0, tslib_1.__values(declarationLContainer[MOVED_VIEWS])), _c = _b.next(); !_c.done; _c = _b.next()) {
              var embeddedLView = _c.value;
              collectQueryResults(embeddedLView, childQueryIndex, result);
            }
          } catch (e_4_1) {
            e_4 = {
              error: e_4_1
            };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
              if (e_4) throw e_4.error;
            }
          }
        }
      }
    }
  }
  return result;
}
function ɵɵqueryRefresh(queryList) {
  var lView = getLView();
  var queryIndex = getCurrentQueryIndex();
  setCurrentQueryIndex(queryIndex + 1);
  var tQuery = getTQuery(lView[TVIEW], queryIndex);
  if (queryList.dirty && isCreationMode() === tQuery.metadata.isStatic) {
    if (tQuery.matches === null) {
      queryList.reset([]);
    } else {
      var result = tQuery.crossesNgTemplate ? collectQueryResults(lView, queryIndex, []) : materializeViewResults(lView, tQuery, queryIndex);
      queryList.reset(result);
      queryList.notifyOnChanges();
    }
    return true;
  }
  return false;
}
exports.ɵɵqueryRefresh = ɵɵqueryRefresh;
function ɵɵstaticViewQuery(predicate, descend, read) {
  viewQueryInternal(getLView(), predicate, descend, read, true);
}
exports.ɵɵstaticViewQuery = ɵɵstaticViewQuery;
function ɵɵviewQuery(predicate, descend, read) {
  viewQueryInternal(getLView(), predicate, descend, read, false);
}
exports.ɵɵviewQuery = ɵɵviewQuery;
function viewQueryInternal(lView, predicate, descend, read, isStatic) {
  var tView = lView[TVIEW];
  if (tView.firstTemplatePass) {
    createTQuery(tView, new TQueryMetadata_(predicate, descend, isStatic, read), -1);
    if (isStatic) {
      tView.staticViewQueries = true;
    }
  }
  createLQuery(lView);
}
function ɵɵloadViewQuery() {
  return loadQueryInternal(getLView(), getCurrentQueryIndex());
}
exports.ɵɵloadViewQuery = ɵɵloadViewQuery;
function ɵɵcontentQuery(directiveIndex, predicate, descend, read) {
  contentQueryInternal(getLView(), predicate, descend, read, false, getPreviousOrParentTNode(), directiveIndex);
}
exports.ɵɵcontentQuery = ɵɵcontentQuery;
function ɵɵstaticContentQuery(directiveIndex, predicate, descend, read) {
  contentQueryInternal(getLView(), predicate, descend, read, true, getPreviousOrParentTNode(), directiveIndex);
}
exports.ɵɵstaticContentQuery = ɵɵstaticContentQuery;
function contentQueryInternal(lView, predicate, descend, read, isStatic, tNode, directiveIndex) {
  var tView = lView[TVIEW];
  if (tView.firstTemplatePass) {
    createTQuery(tView, new TQueryMetadata_(predicate, descend, isStatic, read), tNode.index);
    saveContentQueryAndDirectiveIndex(tView, directiveIndex);
    if (isStatic) {
      tView.staticContentQueries = true;
    }
  }
  createLQuery(lView);
}
function ɵɵloadContentQuery() {
  return loadQueryInternal(getLView(), getCurrentQueryIndex());
}
exports.ɵɵloadContentQuery = ɵɵloadContentQuery;
function loadQueryInternal(lView, queryIndex) {
  ngDevMode && assertDefined(lView[QUERIES], "LQueries should be defined when trying to load a query");
  ngDevMode && assertDataInRange(lView[QUERIES].queries, queryIndex);
  return lView[QUERIES].queries[queryIndex].queryList;
}
function createLQuery(lView) {
  var queryList = new QueryList();
  storeCleanupWithContext(lView, queryList, queryList.destroy);
  if (lView[QUERIES] === null) lView[QUERIES] = new LQueries_();
  lView[QUERIES].queries.push(new LQuery_(queryList));
}
function createTQuery(tView, metadata, nodeIndex) {
  if (tView.queries === null) tView.queries = new TQueries_();
  tView.queries.track(new TQuery_(metadata, nodeIndex));
}
function saveContentQueryAndDirectiveIndex(tView, directiveIndex) {
  var tViewContentQueries = tView.contentQueries || (tView.contentQueries = []);
  var lastSavedDirectiveIndex = tView.contentQueries.length ? tViewContentQueries[tViewContentQueries.length - 1] : -1;
  if (directiveIndex !== lastSavedDirectiveIndex) {
    tViewContentQueries.push(tView.queries.length - 1, directiveIndex);
  }
}
function getTQuery(tView, index) {
  ngDevMode && assertDefined(tView.queries, "TQueries must be defined to retrieve a TQuery");
  return tView.queries.getByIndex(index);
}
function ɵɵtemplateRefExtractor(tNode, currentView) {
  return createTemplateRef(TemplateRef, ElementRef, tNode, currentView);
}
exports.ɵɵtemplateRefExtractor = ɵɵtemplateRefExtractor;
function ɵɵinjectPipeChangeDetectorRef(flags) {
  if (flags === void 0) {
    flags = InjectFlags.Default;
  }
  var value = injectChangeDetectorRef(true);
  if (value == null && !(flags & InjectFlags.Optional)) {
    throw new Error("No provider for ChangeDetectorRef!");
  } else {
    return value;
  }
}
exports.ɵɵinjectPipeChangeDetectorRef = ɵɵinjectPipeChangeDetectorRef;
var ɵ0$e = function () {
  return {
    "ɵɵattribute": ɵɵattribute,
    "ɵɵattributeInterpolate1": ɵɵattributeInterpolate1,
    "ɵɵattributeInterpolate2": ɵɵattributeInterpolate2,
    "ɵɵattributeInterpolate3": ɵɵattributeInterpolate3,
    "ɵɵattributeInterpolate4": ɵɵattributeInterpolate4,
    "ɵɵattributeInterpolate5": ɵɵattributeInterpolate5,
    "ɵɵattributeInterpolate6": ɵɵattributeInterpolate6,
    "ɵɵattributeInterpolate7": ɵɵattributeInterpolate7,
    "ɵɵattributeInterpolate8": ɵɵattributeInterpolate8,
    "ɵɵattributeInterpolateV": ɵɵattributeInterpolateV,
    "ɵɵdefineBase": ɵɵdefineBase,
    "ɵɵdefineComponent": ɵɵdefineComponent,
    "ɵɵdefineDirective": ɵɵdefineDirective,
    "ɵɵdefineInjectable": ɵɵdefineInjectable,
    "ɵɵdefineInjector": ɵɵdefineInjector,
    "ɵɵdefineNgModule": ɵɵdefineNgModule,
    "ɵɵdefinePipe": ɵɵdefinePipe,
    "ɵɵdirectiveInject": ɵɵdirectiveInject,
    "ɵɵgetFactoryOf": ɵɵgetFactoryOf,
    "ɵɵgetInheritedFactory": ɵɵgetInheritedFactory,
    "ɵɵinject": ɵɵinject,
    "ɵɵinjectAttribute": ɵɵinjectAttribute,
    "ɵɵinjectPipeChangeDetectorRef": ɵɵinjectPipeChangeDetectorRef,
    "ɵɵtemplateRefExtractor": ɵɵtemplateRefExtractor,
    "ɵɵNgOnChangesFeature": ɵɵNgOnChangesFeature,
    "ɵɵProvidersFeature": ɵɵProvidersFeature,
    "ɵɵInheritDefinitionFeature": ɵɵInheritDefinitionFeature,
    "ɵɵcontainer": ɵɵcontainer,
    "ɵɵnextContext": ɵɵnextContext,
    "ɵɵcontainerRefreshStart": ɵɵcontainerRefreshStart,
    "ɵɵcontainerRefreshEnd": ɵɵcontainerRefreshEnd,
    "ɵɵnamespaceHTML": ɵɵnamespaceHTML,
    "ɵɵnamespaceMathML": ɵɵnamespaceMathML,
    "ɵɵnamespaceSVG": ɵɵnamespaceSVG,
    "ɵɵenableBindings": ɵɵenableBindings,
    "ɵɵdisableBindings": ɵɵdisableBindings,
    "ɵɵallocHostVars": ɵɵallocHostVars,
    "ɵɵelementStart": ɵɵelementStart,
    "ɵɵelementEnd": ɵɵelementEnd,
    "ɵɵelement": ɵɵelement,
    "ɵɵelementContainerStart": ɵɵelementContainerStart,
    "ɵɵelementContainerEnd": ɵɵelementContainerEnd,
    "ɵɵelementContainer": ɵɵelementContainer,
    "ɵɵpureFunction0": ɵɵpureFunction0,
    "ɵɵpureFunction1": ɵɵpureFunction1,
    "ɵɵpureFunction2": ɵɵpureFunction2,
    "ɵɵpureFunction3": ɵɵpureFunction3,
    "ɵɵpureFunction4": ɵɵpureFunction4,
    "ɵɵpureFunction5": ɵɵpureFunction5,
    "ɵɵpureFunction6": ɵɵpureFunction6,
    "ɵɵpureFunction7": ɵɵpureFunction7,
    "ɵɵpureFunction8": ɵɵpureFunction8,
    "ɵɵpureFunctionV": ɵɵpureFunctionV,
    "ɵɵgetCurrentView": ɵɵgetCurrentView,
    "ɵɵrestoreView": ɵɵrestoreView,
    "ɵɵlistener": ɵɵlistener,
    "ɵɵload": ɵɵload,
    "ɵɵprojection": ɵɵprojection,
    "ɵɵupdateSyntheticHostBinding": ɵɵupdateSyntheticHostBinding,
    "ɵɵcomponentHostSyntheticListener": ɵɵcomponentHostSyntheticListener,
    "ɵɵpipeBind1": ɵɵpipeBind1,
    "ɵɵpipeBind2": ɵɵpipeBind2,
    "ɵɵpipeBind3": ɵɵpipeBind3,
    "ɵɵpipeBind4": ɵɵpipeBind4,
    "ɵɵpipeBindV": ɵɵpipeBindV,
    "ɵɵprojectionDef": ɵɵprojectionDef,
    "ɵɵhostProperty": ɵɵhostProperty,
    "ɵɵproperty": ɵɵproperty,
    "ɵɵpropertyInterpolate": ɵɵpropertyInterpolate,
    "ɵɵpropertyInterpolate1": ɵɵpropertyInterpolate1,
    "ɵɵpropertyInterpolate2": ɵɵpropertyInterpolate2,
    "ɵɵpropertyInterpolate3": ɵɵpropertyInterpolate3,
    "ɵɵpropertyInterpolate4": ɵɵpropertyInterpolate4,
    "ɵɵpropertyInterpolate5": ɵɵpropertyInterpolate5,
    "ɵɵpropertyInterpolate6": ɵɵpropertyInterpolate6,
    "ɵɵpropertyInterpolate7": ɵɵpropertyInterpolate7,
    "ɵɵpropertyInterpolate8": ɵɵpropertyInterpolate8,
    "ɵɵpropertyInterpolateV": ɵɵpropertyInterpolateV,
    "ɵɵpipe": ɵɵpipe,
    "ɵɵqueryRefresh": ɵɵqueryRefresh,
    "ɵɵviewQuery": ɵɵviewQuery,
    "ɵɵstaticViewQuery": ɵɵstaticViewQuery,
    "ɵɵstaticContentQuery": ɵɵstaticContentQuery,
    "ɵɵloadViewQuery": ɵɵloadViewQuery,
    "ɵɵcontentQuery": ɵɵcontentQuery,
    "ɵɵloadContentQuery": ɵɵloadContentQuery,
    "ɵɵreference": ɵɵreference,
    "ɵɵelementHostAttrs": ɵɵelementHostAttrs,
    "ɵɵclassMap": ɵɵclassMap,
    "ɵɵclassMapInterpolate1": ɵɵclassMapInterpolate1,
    "ɵɵclassMapInterpolate2": ɵɵclassMapInterpolate2,
    "ɵɵclassMapInterpolate3": ɵɵclassMapInterpolate3,
    "ɵɵclassMapInterpolate4": ɵɵclassMapInterpolate4,
    "ɵɵclassMapInterpolate5": ɵɵclassMapInterpolate5,
    "ɵɵclassMapInterpolate6": ɵɵclassMapInterpolate6,
    "ɵɵclassMapInterpolate7": ɵɵclassMapInterpolate7,
    "ɵɵclassMapInterpolate8": ɵɵclassMapInterpolate8,
    "ɵɵclassMapInterpolateV": ɵɵclassMapInterpolateV,
    "ɵɵstyling": ɵɵstyling,
    "ɵɵstyleMap": ɵɵstyleMap,
    "ɵɵstyleProp": ɵɵstyleProp,
    "ɵɵstylePropInterpolate1": ɵɵstylePropInterpolate1,
    "ɵɵstylePropInterpolate2": ɵɵstylePropInterpolate2,
    "ɵɵstylePropInterpolate3": ɵɵstylePropInterpolate3,
    "ɵɵstylePropInterpolate4": ɵɵstylePropInterpolate4,
    "ɵɵstylePropInterpolate5": ɵɵstylePropInterpolate5,
    "ɵɵstylePropInterpolate6": ɵɵstylePropInterpolate6,
    "ɵɵstylePropInterpolate7": ɵɵstylePropInterpolate7,
    "ɵɵstylePropInterpolate8": ɵɵstylePropInterpolate8,
    "ɵɵstylePropInterpolateV": ɵɵstylePropInterpolateV,
    "ɵɵstyleSanitizer": ɵɵstyleSanitizer,
    "ɵɵstylingApply": ɵɵstylingApply,
    "ɵɵclassProp": ɵɵclassProp,
    "ɵɵselect": ɵɵselect,
    "ɵɵtemplate": ɵɵtemplate,
    "ɵɵtext": ɵɵtext,
    "ɵɵtextBinding": ɵɵtextBinding,
    "ɵɵtextInterpolate": ɵɵtextInterpolate,
    "ɵɵtextInterpolate1": ɵɵtextInterpolate1,
    "ɵɵtextInterpolate2": ɵɵtextInterpolate2,
    "ɵɵtextInterpolate3": ɵɵtextInterpolate3,
    "ɵɵtextInterpolate4": ɵɵtextInterpolate4,
    "ɵɵtextInterpolate5": ɵɵtextInterpolate5,
    "ɵɵtextInterpolate6": ɵɵtextInterpolate6,
    "ɵɵtextInterpolate7": ɵɵtextInterpolate7,
    "ɵɵtextInterpolate8": ɵɵtextInterpolate8,
    "ɵɵtextInterpolateV": ɵɵtextInterpolateV,
    "ɵɵembeddedViewStart": ɵɵembeddedViewStart,
    "ɵɵembeddedViewEnd": ɵɵembeddedViewEnd,
    "ɵɵi18n": ɵɵi18n,
    "ɵɵi18nAttributes": ɵɵi18nAttributes,
    "ɵɵi18nExp": ɵɵi18nExp,
    "ɵɵi18nStart": ɵɵi18nStart,
    "ɵɵi18nEnd": ɵɵi18nEnd,
    "ɵɵi18nApply": ɵɵi18nApply,
    "ɵɵi18nPostprocess": ɵɵi18nPostprocess,
    "ɵɵi18nLocalize": ɵɵi18nLocalize,
    "ɵɵresolveWindow": ɵɵresolveWindow,
    "ɵɵresolveDocument": ɵɵresolveDocument,
    "ɵɵresolveBody": ɵɵresolveBody,
    "ɵɵsetComponentScope": ɵɵsetComponentScope,
    "ɵɵsetNgModuleScope": ɵɵsetNgModuleScope,
    "ɵɵsanitizeHtml": ɵɵsanitizeHtml,
    "ɵɵsanitizeStyle": ɵɵsanitizeStyle,
    "ɵɵdefaultStyleSanitizer": ɵɵdefaultStyleSanitizer,
    "ɵɵsanitizeResourceUrl": ɵɵsanitizeResourceUrl,
    "ɵɵsanitizeScript": ɵɵsanitizeScript,
    "ɵɵsanitizeUrl": ɵɵsanitizeUrl,
    "ɵɵsanitizeUrlOrResourceUrl": ɵɵsanitizeUrlOrResourceUrl
  };
};
var angularCoreEnv = ɵ0$e();
var EMPTY_ARRAY$4 = [];
var moduleQueue = [];
function enqueueModuleForDelayedScoping(moduleType, ngModule) {
  moduleQueue.push({
    moduleType: moduleType,
    ngModule: ngModule
  });
}
var flushingModuleQueue = false;
function flushModuleScopingQueueAsMuchAsPossible() {
  if (!flushingModuleQueue) {
    flushingModuleQueue = true;
    try {
      for (var i = moduleQueue.length - 1; i >= 0; i--) {
        var _a = moduleQueue[i], moduleType = _a.moduleType, ngModule = _a.ngModule;
        if (ngModule.declarations && ngModule.declarations.every(isResolvedDeclaration)) {
          moduleQueue.splice(i, 1);
          setScopeOnDeclaredComponents(moduleType, ngModule);
        }
      }
    } finally {
      flushingModuleQueue = false;
    }
  }
}
exports.ɵflushModuleScopingQueueAsMuchAsPossible = flushModuleScopingQueueAsMuchAsPossible;
function isResolvedDeclaration(declaration) {
  if (Array.isArray(declaration)) {
    return declaration.every(isResolvedDeclaration);
  }
  return !!resolveForwardRef(declaration);
}
function compileNgModule(moduleType, ngModule) {
  if (ngModule === void 0) {
    ngModule = {};
  }
  compileNgModuleDefs(moduleType, ngModule);
  enqueueModuleForDelayedScoping(moduleType, ngModule);
}
exports.ɵcompileNgModule = compileNgModule;
function compileNgModuleDefs(moduleType, ngModule, allowDuplicateDeclarationsInRoot) {
  if (allowDuplicateDeclarationsInRoot === void 0) {
    allowDuplicateDeclarationsInRoot = false;
  }
  ngDevMode && assertDefined(moduleType, "Required value moduleType");
  ngDevMode && assertDefined(ngModule, "Required value ngModule");
  var declarations = flatten(ngModule.declarations || EMPTY_ARRAY$4);
  var ngModuleDef = null;
  Object.defineProperty(moduleType, NG_MODULE_DEF, {
    configurable: true,
    get: function () {
      if (ngModuleDef === null) {
        if (ngDevMode && ngModule.imports && ngModule.imports.indexOf(moduleType) > -1) {
          throw new Error("'" + stringifyForError(moduleType) + "' module can't import itself");
        }
        ngModuleDef = getCompilerFacade().compileNgModule(angularCoreEnv, "ng:///" + moduleType.name + "/ngModuleDef.js", {
          type: moduleType,
          bootstrap: flatten(ngModule.bootstrap || EMPTY_ARRAY$4).map(resolveForwardRef),
          declarations: declarations.map(resolveForwardRef),
          imports: flatten(ngModule.imports || EMPTY_ARRAY$4).map(resolveForwardRef).map(expandModuleWithProviders),
          exports: flatten(ngModule.exports || EMPTY_ARRAY$4).map(resolveForwardRef).map(expandModuleWithProviders),
          emitInline: true,
          schemas: ngModule.schemas ? flatten(ngModule.schemas) : null,
          id: ngModule.id || null
        });
      }
      return ngModuleDef;
    }
  });
  var ngInjectorDef = null;
  Object.defineProperty(moduleType, NG_INJECTOR_DEF, {
    get: function () {
      if (ngInjectorDef === null) {
        ngDevMode && verifySemanticsOfNgModuleDef(moduleType, allowDuplicateDeclarationsInRoot);
        var meta = {
          name: moduleType.name,
          type: moduleType,
          deps: reflectDependencies(moduleType),
          providers: ngModule.providers || EMPTY_ARRAY$4,
          imports: [(ngModule.imports || EMPTY_ARRAY$4).map(resolveForwardRef), (ngModule.exports || EMPTY_ARRAY$4).map(resolveForwardRef)]
        };
        ngInjectorDef = getCompilerFacade().compileInjector(angularCoreEnv, "ng:///" + moduleType.name + "/ngInjectorDef.js", meta);
      }
      return ngInjectorDef;
    },
    configurable: !!ngDevMode
  });
}
exports.ɵcompileNgModuleDefs = compileNgModuleDefs;
function verifySemanticsOfNgModuleDef(moduleType, allowDuplicateDeclarationsInRoot, importingModule) {
  if (verifiedNgModule.get(moduleType)) return;
  verifiedNgModule.set(moduleType, true);
  moduleType = resolveForwardRef(moduleType);
  var ngModuleDef;
  if (importingModule) {
    ngModuleDef = getNgModuleDef(moduleType);
    if (!ngModuleDef) {
      throw new Error("Unexpected value '" + moduleType.name + "' imported by the module '" + importingModule.name + "'. Please add an @NgModule annotation.");
    }
  } else {
    ngModuleDef = getNgModuleDef(moduleType, true);
  }
  var errors = [];
  var declarations = maybeUnwrapFn(ngModuleDef.declarations);
  var imports = maybeUnwrapFn(ngModuleDef.imports);
  flatten(imports).map(unwrapModuleWithProvidersImports).forEach(function (mod) {
    verifySemanticsOfNgModuleImport(mod, moduleType);
    verifySemanticsOfNgModuleDef(mod, false, moduleType);
  });
  var exports = maybeUnwrapFn(ngModuleDef.exports);
  declarations.forEach(verifyDeclarationsHaveDefinitions);
  var combinedDeclarations = tslib_1.__spread(declarations.map(resolveForwardRef), flatten(imports.map(computeCombinedExports)).map(resolveForwardRef));
  exports.forEach(verifyExportsAreDeclaredOrReExported);
  declarations.forEach(function (decl) {
    return verifyDeclarationIsUnique(decl, allowDuplicateDeclarationsInRoot);
  });
  declarations.forEach(verifyComponentEntryComponentsIsPartOfNgModule);
  var ngModule = getAnnotation(moduleType, "NgModule");
  if (ngModule) {
    ngModule.imports && flatten(ngModule.imports).map(unwrapModuleWithProvidersImports).forEach(function (mod) {
      verifySemanticsOfNgModuleImport(mod, moduleType);
      verifySemanticsOfNgModuleDef(mod, false, moduleType);
    });
    ngModule.bootstrap && deepForEach(ngModule.bootstrap, verifyCorrectBootstrapType);
    ngModule.bootstrap && deepForEach(ngModule.bootstrap, verifyComponentIsPartOfNgModule);
    ngModule.entryComponents && deepForEach(ngModule.entryComponents, verifyComponentIsPartOfNgModule);
  }
  if (errors.length) {
    throw new Error(errors.join("\n"));
  }
  function verifyDeclarationsHaveDefinitions(type) {
    type = resolveForwardRef(type);
    var def = getComponentDef(type) || getDirectiveDef(type) || getPipeDef(type);
    if (!def) {
      errors.push("Unexpected value '" + stringifyForError(type) + "' declared by the module '" + stringifyForError(moduleType) + "'. Please add a @Pipe/@Directive/@Component annotation.");
    }
  }
  function verifyExportsAreDeclaredOrReExported(type) {
    type = resolveForwardRef(type);
    var kind = getComponentDef(type) && "component" || getDirectiveDef(type) && "directive" || getPipeDef(type) && "pipe";
    if (kind) {
      if (combinedDeclarations.lastIndexOf(type) === -1) {
        errors.push("Can't export " + kind + " " + stringifyForError(type) + " from " + stringifyForError(moduleType) + " as it was neither declared nor imported!");
      }
    }
  }
  function verifyDeclarationIsUnique(type, suppressErrors) {
    type = resolveForwardRef(type);
    var existingModule = ownerNgModule.get(type);
    if (existingModule && existingModule !== moduleType) {
      if (!suppressErrors) {
        var modules = [existingModule, moduleType].map(stringifyForError).sort();
        errors.push("Type " + stringifyForError(type) + " is part of the declarations of 2 modules: " + modules[0] + " and " + modules[1] + "! " + ("Please consider moving " + stringifyForError(type) + " to a higher module that imports " + modules[0] + " and " + modules[1] + ". ") + ("You can also create a new NgModule that exports and includes " + stringifyForError(type) + " then import that NgModule in " + modules[0] + " and " + modules[1] + "."));
      }
    } else {
      ownerNgModule.set(type, moduleType);
    }
  }
  function verifyComponentIsPartOfNgModule(type) {
    type = resolveForwardRef(type);
    var existingModule = ownerNgModule.get(type);
    if (!existingModule) {
      errors.push("Component " + stringifyForError(type) + " is not part of any NgModule or the module has not been imported into your module.");
    }
  }
  function verifyCorrectBootstrapType(type) {
    type = resolveForwardRef(type);
    if (!getComponentDef(type)) {
      errors.push(stringifyForError(type) + " cannot be used as an entry component.");
    }
  }
  function verifyComponentEntryComponentsIsPartOfNgModule(type) {
    type = resolveForwardRef(type);
    if (getComponentDef(type)) {
      var component = getAnnotation(type, "Component");
      if (component && component.entryComponents) {
        deepForEach(component.entryComponents, verifyComponentIsPartOfNgModule);
      }
    }
  }
  function verifySemanticsOfNgModuleImport(type, importingModule) {
    type = resolveForwardRef(type);
    if (getComponentDef(type) || getDirectiveDef(type)) {
      throw new Error("Unexpected directive '" + type.name + "' imported by the module '" + importingModule.name + "'. Please add an @NgModule annotation.");
    }
    if (getPipeDef(type)) {
      throw new Error("Unexpected pipe '" + type.name + "' imported by the module '" + importingModule.name + "'. Please add an @NgModule annotation.");
    }
  }
}
function unwrapModuleWithProvidersImports(typeOrWithProviders) {
  typeOrWithProviders = resolveForwardRef(typeOrWithProviders);
  return typeOrWithProviders.ngModule || typeOrWithProviders;
}
function getAnnotation(type, name) {
  var annotation = null;
  collect(type.__annotations__);
  collect(type.decorators);
  return annotation;
  function collect(annotations) {
    if (annotations) {
      annotations.forEach(readAnnotation);
    }
  }
  function readAnnotation(decorator) {
    if (!annotation) {
      var proto = Object.getPrototypeOf(decorator);
      if (proto.ngMetadataName == name) {
        annotation = decorator;
      } else if (decorator.type) {
        var proto_1 = Object.getPrototypeOf(decorator.type);
        if (proto_1.ngMetadataName == name) {
          annotation = decorator.args[0];
        }
      }
    }
  }
}
var ownerNgModule = new Map();
var verifiedNgModule = new Map();
function resetCompiledComponents() {
  ownerNgModule = new Map();
  verifiedNgModule = new Map();
  moduleQueue.length = 0;
}
exports.ɵresetCompiledComponents = resetCompiledComponents;
function computeCombinedExports(type) {
  type = resolveForwardRef(type);
  var ngModuleDef = getNgModuleDef(type, true);
  return tslib_1.__spread(flatten(maybeUnwrapFn(ngModuleDef.exports).map(function (type) {
    var ngModuleDef = getNgModuleDef(type);
    if (ngModuleDef) {
      verifySemanticsOfNgModuleDef(type, false);
      return computeCombinedExports(type);
    } else {
      return type;
    }
  })));
}
function setScopeOnDeclaredComponents(moduleType, ngModule) {
  var declarations = flatten(ngModule.declarations || EMPTY_ARRAY$4);
  var transitiveScopes = transitiveScopesFor(moduleType);
  declarations.forEach(function (declaration) {
    if (declaration.hasOwnProperty(NG_COMPONENT_DEF)) {
      var component = declaration;
      var componentDef = getComponentDef(component);
      patchComponentDefWithScope(componentDef, transitiveScopes);
    } else if (!declaration.hasOwnProperty(NG_DIRECTIVE_DEF) && !declaration.hasOwnProperty(NG_PIPE_DEF)) {
      declaration.ngSelectorScope = moduleType;
    }
  });
}
function patchComponentDefWithScope(componentDef, transitiveScopes) {
  componentDef.directiveDefs = function () {
    return Array.from(transitiveScopes.compilation.directives).map(function (dir) {
      return dir.hasOwnProperty(NG_COMPONENT_DEF) ? getComponentDef(dir) : getDirectiveDef(dir);
    }).filter(function (def) {
      return !!def;
    });
  };
  componentDef.pipeDefs = function () {
    return Array.from(transitiveScopes.compilation.pipes).map(function (pipe) {
      return getPipeDef(pipe);
    });
  };
  componentDef.schemas = transitiveScopes.schemas;
  componentDef.tView = null;
}
exports.ɵpatchComponentDefWithScope = patchComponentDefWithScope;
function transitiveScopesFor(moduleType, processNgModuleFn) {
  if (!isNgModule(moduleType)) {
    throw new Error(moduleType.name + " does not have an ngModuleDef");
  }
  var def = getNgModuleDef(moduleType);
  if (def.transitiveCompileScopes !== null) {
    return def.transitiveCompileScopes;
  }
  var scopes = {
    schemas: def.schemas || null,
    compilation: {
      directives: new Set(),
      pipes: new Set()
    },
    exported: {
      directives: new Set(),
      pipes: new Set()
    }
  };
  maybeUnwrapFn(def.declarations).forEach(function (declared) {
    var declaredWithDefs = declared;
    if (getPipeDef(declaredWithDefs)) {
      scopes.compilation.pipes.add(declared);
    } else {
      scopes.compilation.directives.add(declared);
    }
  });
  maybeUnwrapFn(def.imports).forEach(function (imported) {
    var importedType = imported;
    if (!isNgModule(importedType)) {
      throw new Error("Importing " + importedType.name + " which does not have an ngModuleDef");
    }
    if (processNgModuleFn) {
      processNgModuleFn(importedType);
    }
    var importedScope = transitiveScopesFor(importedType, processNgModuleFn);
    importedScope.exported.directives.forEach(function (entry) {
      return scopes.compilation.directives.add(entry);
    });
    importedScope.exported.pipes.forEach(function (entry) {
      return scopes.compilation.pipes.add(entry);
    });
  });
  maybeUnwrapFn(def.exports).forEach(function (exported) {
    var exportedType = exported;
    if (isNgModule(exportedType)) {
      var exportedScope = transitiveScopesFor(exportedType, processNgModuleFn);
      exportedScope.exported.directives.forEach(function (entry) {
        scopes.compilation.directives.add(entry);
        scopes.exported.directives.add(entry);
      });
      exportedScope.exported.pipes.forEach(function (entry) {
        scopes.compilation.pipes.add(entry);
        scopes.exported.pipes.add(entry);
      });
    } else if (getPipeDef(exportedType)) {
      scopes.exported.pipes.add(exportedType);
    } else {
      scopes.exported.directives.add(exportedType);
    }
  });
  def.transitiveCompileScopes = scopes;
  return scopes;
}
exports.ɵtransitiveScopesFor = transitiveScopesFor;
function expandModuleWithProviders(value) {
  if (isModuleWithProviders(value)) {
    return value.ngModule;
  }
  return value;
}
function isModuleWithProviders(value) {
  return value.ngModule !== undefined;
}
function isNgModule(value) {
  return !!getNgModuleDef(value);
}
function compileComponent(type, metadata) {
  var ngComponentDef = null;
  maybeQueueResolutionOfComponentResources(type, metadata);
  Object.defineProperty(type, NG_COMPONENT_DEF, {
    get: function () {
      var compiler = getCompilerFacade();
      if (ngComponentDef === null) {
        if (componentNeedsResolution(metadata)) {
          var error = ["Component '" + type.name + "' is not resolved:"];
          if (metadata.templateUrl) {
            error.push(" - templateUrl: " + metadata.templateUrl);
          }
          if (metadata.styleUrls && metadata.styleUrls.length) {
            error.push(" - styleUrls: " + JSON.stringify(metadata.styleUrls));
          }
          error.push("Did you run and wait for 'resolveComponentResources()'?");
          throw new Error(error.join("\n"));
        }
        var templateUrl = metadata.templateUrl || "ng:///" + type.name + "/template.html";
        var meta = tslib_1.__assign({}, directiveMetadata(type, metadata), {
          typeSourceSpan: compiler.createParseSourceSpan("Component", type.name, templateUrl),
          template: metadata.template || "",
          preserveWhitespaces: metadata.preserveWhitespaces || false,
          styles: metadata.styles || EMPTY_ARRAY,
          animations: metadata.animations,
          directives: [],
          changeDetection: metadata.changeDetection,
          pipes: new Map(),
          encapsulation: metadata.encapsulation || ViewEncapsulation.Emulated,
          interpolation: metadata.interpolation,
          viewProviders: metadata.viewProviders || null
        });
        if (meta.usesInheritance) {
          addBaseDefToUndecoratedParents(type);
        }
        ngComponentDef = compiler.compileComponent(angularCoreEnv, templateUrl, meta);
        flushModuleScopingQueueAsMuchAsPossible();
        if (hasSelectorScope(type)) {
          var scopes = transitiveScopesFor(type.ngSelectorScope);
          patchComponentDefWithScope(ngComponentDef, scopes);
        }
      }
      return ngComponentDef;
    },
    configurable: !!ngDevMode
  });
  compileInjectable(type);
}
exports.ɵcompileComponent = compileComponent;
function hasSelectorScope(component) {
  return component.ngSelectorScope !== undefined;
}
function compileDirective(type, directive) {
  var ngDirectiveDef = null;
  Object.defineProperty(type, NG_DIRECTIVE_DEF, {
    get: function () {
      if (ngDirectiveDef === null) {
        var name_1 = type && type.name;
        var sourceMapUrl = "ng:///" + name_1 + "/ngDirectiveDef.js";
        var compiler = getCompilerFacade();
        var facade = directiveMetadata(type, directive);
        facade.typeSourceSpan = compiler.createParseSourceSpan("Directive", name_1, sourceMapUrl);
        if (facade.usesInheritance) {
          addBaseDefToUndecoratedParents(type);
        }
        ngDirectiveDef = compiler.compileDirective(angularCoreEnv, sourceMapUrl, facade);
      }
      return ngDirectiveDef;
    },
    configurable: !!ngDevMode
  });
  compileInjectable(type);
}
exports.ɵcompileDirective = compileDirective;
function extendsDirectlyFromObject(type) {
  return Object.getPrototypeOf(type.prototype) === Object.prototype;
}
function directiveMetadata(type, metadata) {
  var propMetadata = getReflect().ownPropMetadata(type);
  return {
    name: type.name,
    type: type,
    typeArgumentCount: 0,
    selector: metadata.selector,
    deps: reflectDependencies(type),
    host: metadata.host || EMPTY_OBJ,
    propMetadata: propMetadata,
    inputs: metadata.inputs || EMPTY_ARRAY,
    outputs: metadata.outputs || EMPTY_ARRAY,
    queries: extractQueriesMetadata(type, propMetadata, isContentQuery),
    lifecycle: {
      usesOnChanges: type.prototype.hasOwnProperty("ngOnChanges")
    },
    typeSourceSpan: null,
    usesInheritance: !extendsDirectlyFromObject(type),
    exportAs: extractExportAs(metadata.exportAs),
    providers: metadata.providers || null,
    viewQueries: extractQueriesMetadata(type, propMetadata, isViewQuery)
  };
}
function addBaseDefToUndecoratedParents(type) {
  var objPrototype = Object.prototype;
  var parent = Object.getPrototypeOf(type);
  while (parent && parent !== objPrototype) {
    if (!getDirectiveDef(parent) && !getComponentDef(parent) && !getBaseDef(parent)) {
      var facade = extractBaseDefMetadata(parent);
      facade && compileBase(parent, facade);
    }
    parent = Object.getPrototypeOf(parent);
  }
}
function compileBase(type, facade) {
  var ngBaseDef = null;
  Object.defineProperty(type, NG_BASE_DEF, {
    get: function () {
      if (ngBaseDef === null) {
        var name_2 = type && type.name;
        var sourceMapUrl = "ng://" + name_2 + "/ngBaseDef.js";
        var compiler = getCompilerFacade();
        ngBaseDef = compiler.compileBase(angularCoreEnv, sourceMapUrl, facade);
      }
      return ngBaseDef;
    },
    configurable: !!ngDevMode
  });
}
function extractBaseDefMetadata(type) {
  var propMetadata = getReflect().ownPropMetadata(type);
  var viewQueries = extractQueriesMetadata(type, propMetadata, isViewQuery);
  var queries = extractQueriesMetadata(type, propMetadata, isContentQuery);
  var inputs;
  var outputs;
  var hasHostDecorators = false;
  var _loop_1 = function (field) {
    propMetadata[field].forEach(function (ann) {
      var metadataName = ann.ngMetadataName;
      if (metadataName === "Input") {
        inputs = inputs || ({});
        inputs[field] = ann.bindingPropertyName ? [ann.bindingPropertyName, field] : field;
      } else if (metadataName === "Output") {
        outputs = outputs || ({});
        outputs[field] = ann.bindingPropertyName || field;
      } else if (metadataName === "HostBinding" || metadataName === "HostListener") {
        hasHostDecorators = true;
      }
    });
  };
  for (var field in propMetadata) {
    _loop_1(field);
  }
  if (inputs || outputs || viewQueries.length || queries.length || hasHostDecorators) {
    return {
      name: type.name,
      type: type,
      inputs: inputs,
      outputs: outputs,
      viewQueries: viewQueries,
      queries: queries,
      propMetadata: propMetadata
    };
  }
  return null;
}
function convertToR3QueryPredicate(selector) {
  return typeof selector === "string" ? splitByComma(selector) : resolveForwardRef(selector);
}
function convertToR3QueryMetadata(propertyName, ann) {
  return {
    propertyName: propertyName,
    predicate: convertToR3QueryPredicate(ann.selector),
    descendants: ann.descendants,
    first: ann.first,
    read: ann.read ? ann.read : null,
    static: !!ann.static
  };
}
function extractQueriesMetadata(type, propMetadata, isQueryAnn) {
  var queriesMeta = [];
  var _loop_2 = function (field) {
    if (propMetadata.hasOwnProperty(field)) {
      var annotations_1 = propMetadata[field];
      annotations_1.forEach(function (ann) {
        if (isQueryAnn(ann)) {
          if (!ann.selector) {
            throw new Error("Can't construct a query for the property \"" + field + "\" of " + ("\"" + stringifyForError(type) + "\" since the query selector wasn't defined."));
          }
          if (annotations_1.some(isInputAnn)) {
            throw new Error("Cannot combine @Input decorators with query decorators");
          }
          queriesMeta.push(convertToR3QueryMetadata(field, ann));
        }
      });
    }
  };
  for (var field in propMetadata) {
    _loop_2(field);
  }
  return queriesMeta;
}
function extractExportAs(exportAs) {
  if (exportAs === undefined) {
    return null;
  }
  return exportAs.split(",").map(function (part) {
    return part.trim();
  });
}
function isContentQuery(value) {
  var name = value.ngMetadataName;
  return name === "ContentChild" || name === "ContentChildren";
}
function isViewQuery(value) {
  var name = value.ngMetadataName;
  return name === "ViewChild" || name === "ViewChildren";
}
function isInputAnn(value) {
  return value.ngMetadataName === "Input";
}
function splitByComma(value) {
  return value.split(",").map(function (piece) {
    return piece.trim();
  });
}
function compilePipe(type, meta) {
  var ngPipeDef = null;
  Object.defineProperty(type, NG_PIPE_DEF, {
    get: function () {
      if (ngPipeDef === null) {
        var typeName = type.name;
        ngPipeDef = getCompilerFacade().compilePipe(angularCoreEnv, "ng:///" + typeName + "/ngPipeDef.js", {
          type: type,
          typeArgumentCount: 0,
          name: typeName,
          deps: reflectDependencies(type),
          pipeName: meta.name,
          pure: meta.pure !== undefined ? meta.pure : true
        });
      }
      return ngPipeDef;
    },
    configurable: !!ngDevMode
  });
}
exports.ɵcompilePipe = compilePipe;
var ɵ0$f = function (dir) {
  if (dir === void 0) {
    dir = {};
  }
  return dir;
}, ɵ1$4 = function (type, meta) {
  return SWITCH_COMPILE_DIRECTIVE(type, meta);
};
var Directive = makeDecorator("Directive", ɵ0$f, undefined, undefined, ɵ1$4);
exports.Directive = Directive;
var ɵ2$1 = function (c) {
  if (c === void 0) {
    c = {};
  }
  return tslib_1.__assign({
    changeDetection: ChangeDetectionStrategy.Default
  }, c);
}, ɵ3$1 = function (type, meta) {
  return SWITCH_COMPILE_COMPONENT(type, meta);
};
var Component = makeDecorator("Component", ɵ2$1, Directive, undefined, ɵ3$1);
exports.Component = Component;
var ɵ4 = function (p) {
  return tslib_1.__assign({
    pure: true
  }, p);
}, ɵ5 = function (type, meta) {
  return SWITCH_COMPILE_PIPE(type, meta);
};
var Pipe = makeDecorator("Pipe", ɵ4, undefined, undefined, ɵ5);
exports.Pipe = Pipe;
var ɵ6 = function (bindingPropertyName) {
  return {
    bindingPropertyName: bindingPropertyName
  };
};
var Input = makePropDecorator("Input", ɵ6);
exports.Input = Input;
var ɵ7 = function (bindingPropertyName) {
  return {
    bindingPropertyName: bindingPropertyName
  };
};
var Output = makePropDecorator("Output", ɵ7);
exports.Output = Output;
var ɵ8 = function (hostPropertyName) {
  return {
    hostPropertyName: hostPropertyName
  };
};
var HostBinding = makePropDecorator("HostBinding", ɵ8);
exports.HostBinding = HostBinding;
var ɵ9 = function (eventName, args) {
  return {
    eventName: eventName,
    args: args
  };
};
var HostListener = makePropDecorator("HostListener", ɵ9);
exports.HostListener = HostListener;
var SWITCH_COMPILE_COMPONENT__POST_R3__ = compileComponent;
exports.ɵSWITCH_COMPILE_COMPONENT__POST_R3__ = SWITCH_COMPILE_COMPONENT__POST_R3__;
var SWITCH_COMPILE_DIRECTIVE__POST_R3__ = compileDirective;
exports.ɵSWITCH_COMPILE_DIRECTIVE__POST_R3__ = SWITCH_COMPILE_DIRECTIVE__POST_R3__;
var SWITCH_COMPILE_PIPE__POST_R3__ = compilePipe;
exports.ɵSWITCH_COMPILE_PIPE__POST_R3__ = SWITCH_COMPILE_PIPE__POST_R3__;
var SWITCH_COMPILE_COMPONENT__PRE_R3__ = noop;
var SWITCH_COMPILE_DIRECTIVE__PRE_R3__ = noop;
var SWITCH_COMPILE_PIPE__PRE_R3__ = noop;
var SWITCH_COMPILE_COMPONENT = SWITCH_COMPILE_COMPONENT__PRE_R3__;
var SWITCH_COMPILE_DIRECTIVE = SWITCH_COMPILE_DIRECTIVE__PRE_R3__;
var SWITCH_COMPILE_PIPE = SWITCH_COMPILE_PIPE__PRE_R3__;
var ɵ0$g = function (ngModule) {
  return ngModule;
}, ɵ1$5 = function (type, meta) {
  return SWITCH_COMPILE_NGMODULE(type, meta);
};
var NgModule = makeDecorator("NgModule", ɵ0$g, undefined, undefined, ɵ1$5);
exports.NgModule = NgModule;
function preR3NgModuleCompile(moduleType, metadata) {
  var imports = metadata && metadata.imports || [];
  if (metadata && metadata.exports) {
    imports = tslib_1.__spread(imports, [metadata.exports]);
  }
  moduleType.ngInjectorDef = ɵɵdefineInjector({
    factory: convertInjectableProviderToFactory(moduleType, {
      useClass: moduleType
    }),
    providers: metadata && metadata.providers,
    imports: imports
  });
}
var SWITCH_COMPILE_NGMODULE__POST_R3__ = compileNgModule;
exports.ɵSWITCH_COMPILE_NGMODULE__POST_R3__ = SWITCH_COMPILE_NGMODULE__POST_R3__;
var SWITCH_COMPILE_NGMODULE__PRE_R3__ = preR3NgModuleCompile;
var SWITCH_COMPILE_NGMODULE = SWITCH_COMPILE_NGMODULE__PRE_R3__;
var APP_INITIALIZER = new InjectionToken("Application Initializer");
exports.APP_INITIALIZER = APP_INITIALIZER;
var ApplicationInitStatus = (function () {
  function ApplicationInitStatus(appInits) {
    var _this = this;
    this.appInits = appInits;
    this.initialized = false;
    this.done = false;
    this.donePromise = new Promise(function (res, rej) {
      _this.resolve = res;
      _this.reject = rej;
    });
  }
  exports.ApplicationInitStatus = ApplicationInitStatus;
  ApplicationInitStatus.prototype.runInitializers = function () {
    var _this = this;
    if (this.initialized) {
      return;
    }
    var asyncInitPromises = [];
    var complete = function () {
      _this.done = true;
      _this.resolve();
    };
    if (this.appInits) {
      for (var i = 0; i < this.appInits.length; i++) {
        var initResult = this.appInits[i]();
        if (isPromise(initResult)) {
          asyncInitPromises.push(initResult);
        }
      }
    }
    Promise.all(asyncInitPromises).then(function () {
      complete();
    }).catch(function (e) {
      _this.reject(e);
    });
    if (asyncInitPromises.length === 0) {
      complete();
    }
    this.initialized = true;
  };
  ApplicationInitStatus = tslib_1.__decorate([Injectable(), tslib_1.__param(0, Inject(APP_INITIALIZER)), tslib_1.__param(0, Optional()), tslib_1.__metadata("design:paramtypes", [Array])], ApplicationInitStatus);
  return ApplicationInitStatus;
})();
exports.ApplicationInitStatus = ApplicationInitStatus;
var APP_ID = new InjectionToken("AppId");
exports.APP_ID = APP_ID;
function _appIdRandomProviderFactory() {
  return "" + _randomChar() + _randomChar() + _randomChar();
}
exports.ɵangular_packages_core_core_f = _appIdRandomProviderFactory;
var APP_ID_RANDOM_PROVIDER = {
  provide: APP_ID,
  useFactory: _appIdRandomProviderFactory,
  deps: []
};
exports.ɵAPP_ID_RANDOM_PROVIDER = APP_ID_RANDOM_PROVIDER;
function _randomChar() {
  return String.fromCharCode(97 + Math.floor(Math.random() * 25));
}
var PLATFORM_INITIALIZER = new InjectionToken("Platform Initializer");
exports.PLATFORM_INITIALIZER = PLATFORM_INITIALIZER;
var PLATFORM_ID = new InjectionToken("Platform ID");
exports.PLATFORM_ID = PLATFORM_ID;
var APP_BOOTSTRAP_LISTENER = new InjectionToken("appBootstrapListener");
exports.APP_BOOTSTRAP_LISTENER = APP_BOOTSTRAP_LISTENER;
var PACKAGE_ROOT_URL = new InjectionToken("Application Packages Root URL");
exports.PACKAGE_ROOT_URL = PACKAGE_ROOT_URL;
var Console = (function () {
  function Console() {}
  exports.ɵConsole = Console;
  Console.prototype.log = function (message) {
    console.log(message);
  };
  Console.prototype.warn = function (message) {
    console.warn(message);
  };
  Console = tslib_1.__decorate([Injectable()], Console);
  return Console;
})();
exports.ɵConsole = Console;
var LOCALE_ID$1 = new InjectionToken("LocaleId");
exports.LOCALE_ID = LOCALE_ID$1;
var TRANSLATIONS$1 = new InjectionToken("Translations");
exports.TRANSLATIONS = TRANSLATIONS$1;
var TRANSLATIONS_FORMAT = new InjectionToken("TranslationsFormat");
exports.TRANSLATIONS_FORMAT = TRANSLATIONS_FORMAT;
var MissingTranslationStrategy;
exports.MissingTranslationStrategy = MissingTranslationStrategy;
(function (MissingTranslationStrategy) {
  MissingTranslationStrategy[MissingTranslationStrategy["Error"] = 0] = "Error";
  MissingTranslationStrategy[MissingTranslationStrategy["Warning"] = 1] = "Warning";
  MissingTranslationStrategy[MissingTranslationStrategy["Ignore"] = 2] = "Ignore";
})(MissingTranslationStrategy || (MissingTranslationStrategy = {}));
var SWITCH_IVY_ENABLED__POST_R3__ = true;
exports.ɵSWITCH_IVY_ENABLED__POST_R3__ = SWITCH_IVY_ENABLED__POST_R3__;
var SWITCH_IVY_ENABLED__PRE_R3__ = false;
var ivyEnabled = SWITCH_IVY_ENABLED__PRE_R3__;
exports.ɵivyEnabled = ivyEnabled;
var ModuleWithComponentFactories = (function () {
  function ModuleWithComponentFactories(ngModuleFactory, componentFactories) {
    this.ngModuleFactory = ngModuleFactory;
    this.componentFactories = componentFactories;
  }
  exports.ModuleWithComponentFactories = ModuleWithComponentFactories;
  return ModuleWithComponentFactories;
})();
exports.ModuleWithComponentFactories = ModuleWithComponentFactories;
function _throwError() {
  throw new Error("Runtime compiler is not loaded");
}
var Compiler_compileModuleSync__PRE_R3__ = _throwError;
var Compiler_compileModuleSync__POST_R3__ = function (moduleType) {
  return new NgModuleFactory$1(moduleType);
};
exports.ɵCompiler_compileModuleSync__POST_R3__ = Compiler_compileModuleSync__POST_R3__;
var Compiler_compileModuleSync = Compiler_compileModuleSync__PRE_R3__;
var Compiler_compileModuleAsync__PRE_R3__ = _throwError;
var Compiler_compileModuleAsync__POST_R3__ = function (moduleType) {
  return Promise.resolve(Compiler_compileModuleSync__POST_R3__(moduleType));
};
exports.ɵCompiler_compileModuleAsync__POST_R3__ = Compiler_compileModuleAsync__POST_R3__;
var Compiler_compileModuleAsync = Compiler_compileModuleAsync__PRE_R3__;
var Compiler_compileModuleAndAllComponentsSync__PRE_R3__ = _throwError;
var Compiler_compileModuleAndAllComponentsSync__POST_R3__ = function (moduleType) {
  var ngModuleFactory = Compiler_compileModuleSync__POST_R3__(moduleType);
  var moduleDef = getNgModuleDef(moduleType);
  exports.ɵmod = moduleDef;
  var componentFactories = maybeUnwrapFn(moduleDef.declarations).reduce(function (factories, declaration) {
    var componentDef = getComponentDef(declaration);
    componentDef && factories.push(new ComponentFactory$1(componentDef));
    return factories;
  }, []);
  return new ModuleWithComponentFactories(ngModuleFactory, componentFactories);
};
exports.ɵCompiler_compileModuleAndAllComponentsSync__POST_R3__ = Compiler_compileModuleAndAllComponentsSync__POST_R3__;
var Compiler_compileModuleAndAllComponentsSync = Compiler_compileModuleAndAllComponentsSync__PRE_R3__;
var Compiler_compileModuleAndAllComponentsAsync__PRE_R3__ = _throwError;
var Compiler_compileModuleAndAllComponentsAsync__POST_R3__ = function (moduleType) {
  return Promise.resolve(Compiler_compileModuleAndAllComponentsSync__POST_R3__(moduleType));
};
exports.ɵCompiler_compileModuleAndAllComponentsAsync__POST_R3__ = Compiler_compileModuleAndAllComponentsAsync__POST_R3__;
var Compiler_compileModuleAndAllComponentsAsync = Compiler_compileModuleAndAllComponentsAsync__PRE_R3__;
var Compiler = (function () {
  function Compiler() {
    this.compileModuleSync = Compiler_compileModuleSync;
    this.compileModuleAsync = Compiler_compileModuleAsync;
    this.compileModuleAndAllComponentsSync = Compiler_compileModuleAndAllComponentsSync;
    this.compileModuleAndAllComponentsAsync = Compiler_compileModuleAndAllComponentsAsync;
  }
  exports.Compiler = Compiler;
  Compiler.prototype.clearCache = function () {};
  Compiler.prototype.clearCacheFor = function (type) {};
  Compiler.prototype.getModuleId = function (moduleType) {
    return undefined;
  };
  Compiler = tslib_1.__decorate([Injectable()], Compiler);
  return Compiler;
})();
exports.Compiler = Compiler;
var COMPILER_OPTIONS = new InjectionToken("compilerOptions");
exports.COMPILER_OPTIONS = COMPILER_OPTIONS;
var CompilerFactory = (function () {
  function CompilerFactory() {}
  exports.CompilerFactory = CompilerFactory;
  return CompilerFactory;
})();
exports.CompilerFactory = CompilerFactory;
var trace;
var events;
function detectWTF() {
  var wtf = _global["wtf"];
  if (wtf) {
    trace = wtf["trace"];
    if (trace) {
      events = trace["events"];
      return true;
    }
  }
  return false;
}
exports.ɵangular_packages_core_core_t = detectWTF;
function createScope(signature, flags) {
  if (flags === void 0) {
    flags = null;
  }
  return events.createScope(signature, flags);
}
exports.ɵangular_packages_core_core_u = createScope;
function leave(scope, returnValue) {
  trace.leaveScope(scope, returnValue);
  return returnValue;
}
exports.ɵangular_packages_core_core_v = leave;
function startTimeRange(rangeType, action) {
  return trace.beginTimeRange(rangeType, action);
}
exports.ɵangular_packages_core_core_w = startTimeRange;
function endTimeRange(range) {
  trace.endTimeRange(range);
}
exports.ɵangular_packages_core_core_x = endTimeRange;
var wtfEnabled = detectWTF();
exports.ɵangular_packages_core_core_s = wtfEnabled;
function noopScope(arg0, arg1) {
  return null;
}
var wtfCreateScope = wtfEnabled ? createScope : function (signature, flags) {
  return noopScope;
};
exports.wtfCreateScope = wtfCreateScope;
var wtfLeave = wtfEnabled ? leave : function (s, r) {
  return r;
};
exports.wtfLeave = wtfLeave;
var wtfStartTimeRange = wtfEnabled ? startTimeRange : function (rangeType, action) {
  return null;
};
exports.wtfStartTimeRange = wtfStartTimeRange;
var wtfEndTimeRange = wtfEnabled ? endTimeRange : function (r) {
  return null;
};
exports.wtfEndTimeRange = wtfEndTimeRange;
var promise = (function () {
  return Promise.resolve(0);
})();
function scheduleMicroTask(fn) {
  if (typeof Zone === "undefined") {
    promise.then(function () {
      fn && fn.apply(null, null);
    });
  } else {
    Zone.current.scheduleMicroTask("scheduleMicrotask", fn);
  }
}
var NgZone = (function () {
  function NgZone(_a) {
    var _b = _a.enableLongStackTrace, enableLongStackTrace = _b === void 0 ? false : _b;
    this.hasPendingMicrotasks = false;
    this.hasPendingMacrotasks = false;
    this.isStable = true;
    this.onUnstable = new EventEmitter(false);
    this.onMicrotaskEmpty = new EventEmitter(false);
    this.onStable = new EventEmitter(false);
    this.onError = new EventEmitter(false);
    if (typeof Zone == "undefined") {
      throw new Error("In this configuration Angular requires Zone.js");
    }
    Zone.assertZonePatched();
    var self = this;
    self._nesting = 0;
    self._outer = self._inner = Zone.current;
    if (Zone["wtfZoneSpec"]) {
      self._inner = self._inner.fork(Zone["wtfZoneSpec"]);
    }
    if (Zone["TaskTrackingZoneSpec"]) {
      self._inner = self._inner.fork(new Zone["TaskTrackingZoneSpec"]());
    }
    if (enableLongStackTrace && Zone["longStackTraceZoneSpec"]) {
      self._inner = self._inner.fork(Zone["longStackTraceZoneSpec"]);
    }
    forkInnerZoneWithAngularBehavior(self);
  }
  exports.NgZone = NgZone;
  NgZone.isInAngularZone = function () {
    return Zone.current.get("isAngularZone") === true;
  };
  NgZone.assertInAngularZone = function () {
    if (!NgZone.isInAngularZone()) {
      throw new Error("Expected to be in Angular Zone, but it is not!");
    }
  };
  NgZone.assertNotInAngularZone = function () {
    if (NgZone.isInAngularZone()) {
      throw new Error("Expected to not be in Angular Zone, but it is!");
    }
  };
  NgZone.prototype.run = function (fn, applyThis, applyArgs) {
    return this._inner.run(fn, applyThis, applyArgs);
  };
  NgZone.prototype.runTask = function (fn, applyThis, applyArgs, name) {
    var zone = this._inner;
    var task = zone.scheduleEventTask("NgZoneEvent: " + name, fn, EMPTY_PAYLOAD, noop$1, noop$1);
    try {
      return zone.runTask(task, applyThis, applyArgs);
    } finally {
      zone.cancelTask(task);
    }
  };
  NgZone.prototype.runGuarded = function (fn, applyThis, applyArgs) {
    return this._inner.runGuarded(fn, applyThis, applyArgs);
  };
  NgZone.prototype.runOutsideAngular = function (fn) {
    return this._outer.run(fn);
  };
  return NgZone;
})();
exports.NgZone = NgZone;
function noop$1() {}
var EMPTY_PAYLOAD = {};
function checkStable(zone) {
  if (zone._nesting == 0 && !zone.hasPendingMicrotasks && !zone.isStable) {
    try {
      zone._nesting++;
      zone.onMicrotaskEmpty.emit(null);
    } finally {
      zone._nesting--;
      if (!zone.hasPendingMicrotasks) {
        try {
          zone.runOutsideAngular(function () {
            return zone.onStable.emit(null);
          });
        } finally {
          zone.isStable = true;
        }
      }
    }
  }
}
function forkInnerZoneWithAngularBehavior(zone) {
  zone._inner = zone._inner.fork({
    name: "angular",
    properties: {
      "isAngularZone": true
    },
    onInvokeTask: function (delegate, current, target, task, applyThis, applyArgs) {
      try {
        onEnter(zone);
        return delegate.invokeTask(target, task, applyThis, applyArgs);
      } finally {
        onLeave(zone);
      }
    },
    onInvoke: function (delegate, current, target, callback, applyThis, applyArgs, source) {
      try {
        onEnter(zone);
        return delegate.invoke(target, callback, applyThis, applyArgs, source);
      } finally {
        onLeave(zone);
      }
    },
    onHasTask: function (delegate, current, target, hasTaskState) {
      delegate.hasTask(target, hasTaskState);
      if (current === target) {
        if (hasTaskState.change == "microTask") {
          zone.hasPendingMicrotasks = hasTaskState.microTask;
          checkStable(zone);
        } else if (hasTaskState.change == "macroTask") {
          zone.hasPendingMacrotasks = hasTaskState.macroTask;
        }
      }
    },
    onHandleError: function (delegate, current, target, error) {
      delegate.handleError(target, error);
      zone.runOutsideAngular(function () {
        return zone.onError.emit(error);
      });
      return false;
    }
  });
}
function onEnter(zone) {
  zone._nesting++;
  if (zone.isStable) {
    zone.isStable = false;
    zone.onUnstable.emit(null);
  }
}
function onLeave(zone) {
  zone._nesting--;
  checkStable(zone);
}
var NoopNgZone = (function () {
  function NoopNgZone() {
    this.hasPendingMicrotasks = false;
    this.hasPendingMacrotasks = false;
    this.isStable = true;
    this.onUnstable = new EventEmitter();
    this.onMicrotaskEmpty = new EventEmitter();
    this.onStable = new EventEmitter();
    this.onError = new EventEmitter();
  }
  exports.ɵNoopNgZone = NoopNgZone;
  NoopNgZone.prototype.run = function (fn) {
    return fn();
  };
  NoopNgZone.prototype.runGuarded = function (fn) {
    return fn();
  };
  NoopNgZone.prototype.runOutsideAngular = function (fn) {
    return fn();
  };
  NoopNgZone.prototype.runTask = function (fn) {
    return fn();
  };
  return NoopNgZone;
})();
exports.ɵNoopNgZone = NoopNgZone;
var Testability = (function () {
  function Testability(_ngZone) {
    var _this = this;
    this._ngZone = _ngZone;
    this._pendingCount = 0;
    this._isZoneStable = true;
    this._didWork = false;
    this._callbacks = [];
    this.taskTrackingZone = null;
    this._watchAngularEvents();
    _ngZone.run(function () {
      _this.taskTrackingZone = typeof Zone == "undefined" ? null : Zone.current.get("TaskTrackingZone");
    });
  }
  exports.Testability = Testability;
  Testability.prototype._watchAngularEvents = function () {
    var _this = this;
    this._ngZone.onUnstable.subscribe({
      next: function () {
        _this._didWork = true;
        _this._isZoneStable = false;
      }
    });
    this._ngZone.runOutsideAngular(function () {
      _this._ngZone.onStable.subscribe({
        next: function () {
          NgZone.assertNotInAngularZone();
          scheduleMicroTask(function () {
            _this._isZoneStable = true;
            _this._runCallbacksIfReady();
          });
        }
      });
    });
  };
  Testability.prototype.increasePendingRequestCount = function () {
    this._pendingCount += 1;
    this._didWork = true;
    return this._pendingCount;
  };
  Testability.prototype.decreasePendingRequestCount = function () {
    this._pendingCount -= 1;
    if (this._pendingCount < 0) {
      throw new Error("pending async requests below zero");
    }
    this._runCallbacksIfReady();
    return this._pendingCount;
  };
  Testability.prototype.isStable = function () {
    return this._isZoneStable && this._pendingCount === 0 && !this._ngZone.hasPendingMacrotasks;
  };
  Testability.prototype._runCallbacksIfReady = function () {
    var _this = this;
    if (this.isStable()) {
      scheduleMicroTask(function () {
        while (_this._callbacks.length !== 0) {
          var cb = _this._callbacks.pop();
          clearTimeout(cb.timeoutId);
          cb.doneCb(_this._didWork);
        }
        _this._didWork = false;
      });
    } else {
      var pending_1 = this.getPendingTasks();
      this._callbacks = this._callbacks.filter(function (cb) {
        if (cb.updateCb && cb.updateCb(pending_1)) {
          clearTimeout(cb.timeoutId);
          return false;
        }
        return true;
      });
      this._didWork = true;
    }
  };
  Testability.prototype.getPendingTasks = function () {
    if (!this.taskTrackingZone) {
      return [];
    }
    return this.taskTrackingZone.macroTasks.map(function (t) {
      return {
        source: t.source,
        creationLocation: t.creationLocation,
        data: t.data
      };
    });
  };
  Testability.prototype.addCallback = function (cb, timeout, updateCb) {
    var _this = this;
    var timeoutId = -1;
    if (timeout && timeout > 0) {
      timeoutId = setTimeout(function () {
        _this._callbacks = _this._callbacks.filter(function (cb) {
          return cb.timeoutId !== timeoutId;
        });
        cb(_this._didWork, _this.getPendingTasks());
      }, timeout);
    }
    this._callbacks.push({
      doneCb: cb,
      timeoutId: timeoutId,
      updateCb: updateCb
    });
  };
  Testability.prototype.whenStable = function (doneCb, timeout, updateCb) {
    if (updateCb && !this.taskTrackingZone) {
      throw new Error("Task tracking zone is required when passing an update callback to " + "whenStable(). Is \"zone.js/dist/task-tracking.js\" loaded?");
    }
    this.addCallback(doneCb, timeout, updateCb);
    this._runCallbacksIfReady();
  };
  Testability.prototype.getPendingRequestCount = function () {
    return this._pendingCount;
  };
  Testability.prototype.findProviders = function (using, provider, exactMatch) {
    return [];
  };
  Testability = tslib_1.__decorate([Injectable(), tslib_1.__metadata("design:paramtypes", [NgZone])], Testability);
  return Testability;
})();
exports.Testability = Testability;
var TestabilityRegistry = (function () {
  function TestabilityRegistry() {
    this._applications = new Map();
    _testabilityGetter.addToWindow(this);
  }
  exports.TestabilityRegistry = TestabilityRegistry;
  TestabilityRegistry.prototype.registerApplication = function (token, testability) {
    this._applications.set(token, testability);
  };
  TestabilityRegistry.prototype.unregisterApplication = function (token) {
    this._applications.delete(token);
  };
  TestabilityRegistry.prototype.unregisterAllApplications = function () {
    this._applications.clear();
  };
  TestabilityRegistry.prototype.getTestability = function (elem) {
    return this._applications.get(elem) || null;
  };
  TestabilityRegistry.prototype.getAllTestabilities = function () {
    return Array.from(this._applications.values());
  };
  TestabilityRegistry.prototype.getAllRootElements = function () {
    return Array.from(this._applications.keys());
  };
  TestabilityRegistry.prototype.findTestabilityInTree = function (elem, findInAncestors) {
    if (findInAncestors === void 0) {
      findInAncestors = true;
    }
    return _testabilityGetter.findTestabilityInTree(this, elem, findInAncestors);
  };
  TestabilityRegistry = tslib_1.__decorate([Injectable(), tslib_1.__metadata("design:paramtypes", [])], TestabilityRegistry);
  return TestabilityRegistry;
})();
exports.TestabilityRegistry = TestabilityRegistry;
var _NoopGetTestability = (function () {
  function _NoopGetTestability() {}
  _NoopGetTestability.prototype.addToWindow = function (registry) {};
  _NoopGetTestability.prototype.findTestabilityInTree = function (registry, elem, findInAncestors) {
    return null;
  };
  return _NoopGetTestability;
})();
function setTestabilityGetter(getter) {
  _testabilityGetter = getter;
}
exports.setTestabilityGetter = setTestabilityGetter;
var _testabilityGetter = new _NoopGetTestability();
var _platform;
var compileNgModuleFactory = compileNgModuleFactory__PRE_R3__;
function compileNgModuleFactory__PRE_R3__(injector, options, moduleType) {
  var compilerFactory = injector.get(CompilerFactory);
  var compiler = compilerFactory.createCompiler([options]);
  return compiler.compileModuleAsync(moduleType);
}
function compileNgModuleFactory__POST_R3__(injector, options, moduleType) {
  ngDevMode && assertNgModuleType(moduleType);
  var moduleFactory = new NgModuleFactory$1(moduleType);
  if (isComponentResourceResolutionQueueEmpty()) {
    return Promise.resolve(moduleFactory);
  }
  var compilerOptions = injector.get(COMPILER_OPTIONS, []).concat(options);
  var compilerProviders = _mergeArrays(compilerOptions.map(function (o) {
    return o.providers;
  }));
  if (compilerProviders.length === 0) {
    return Promise.resolve(moduleFactory);
  }
  var compiler = getCompilerFacade();
  var compilerInjector = Injector.create({
    providers: compilerProviders
  });
  var resourceLoader = compilerInjector.get(compiler.ResourceLoader);
  return resolveComponentResources(function (url) {
    return Promise.resolve(resourceLoader.get(url));
  }).then(function () {
    return moduleFactory;
  });
}
exports.ɵcompileNgModuleFactory__POST_R3__ = compileNgModuleFactory__POST_R3__;
var isBoundToModule = isBoundToModule__PRE_R3__;
function isBoundToModule__PRE_R3__(cf) {
  return cf instanceof ComponentFactoryBoundToModule;
}
function isBoundToModule__POST_R3__(cf) {
  return cf.isBoundToModule;
}
exports.ɵisBoundToModule__POST_R3__ = isBoundToModule__POST_R3__;
var ALLOW_MULTIPLE_PLATFORMS = new InjectionToken("AllowMultipleToken");
exports.ɵALLOW_MULTIPLE_PLATFORMS = ALLOW_MULTIPLE_PLATFORMS;
var NgProbeToken = (function () {
  function NgProbeToken(name, token) {
    this.name = name;
    this.token = token;
  }
  exports.NgProbeToken = NgProbeToken;
  return NgProbeToken;
})();
exports.NgProbeToken = NgProbeToken;
function createPlatform(injector) {
  if (_platform && !_platform.destroyed && !_platform.injector.get(ALLOW_MULTIPLE_PLATFORMS, false)) {
    throw new Error("There can be only one platform. Destroy the previous one to create a new one.");
  }
  _platform = injector.get(PlatformRef);
  var inits = injector.get(PLATFORM_INITIALIZER, null);
  if (inits) inits.forEach(function (init) {
    return init();
  });
  return _platform;
}
exports.createPlatform = createPlatform;
function createPlatformFactory(parentPlatformFactory, name, providers) {
  if (providers === void 0) {
    providers = [];
  }
  var desc = "Platform: " + name;
  var marker = new InjectionToken(desc);
  return function (extraProviders) {
    if (extraProviders === void 0) {
      extraProviders = [];
    }
    var platform = getPlatform();
    if (!platform || platform.injector.get(ALLOW_MULTIPLE_PLATFORMS, false)) {
      if (parentPlatformFactory) {
        parentPlatformFactory(providers.concat(extraProviders).concat({
          provide: marker,
          useValue: true
        }));
      } else {
        var injectedProviders = providers.concat(extraProviders).concat({
          provide: marker,
          useValue: true
        });
        createPlatform(Injector.create({
          providers: injectedProviders,
          name: desc
        }));
      }
    }
    return assertPlatform(marker);
  };
}
exports.createPlatformFactory = createPlatformFactory;
function assertPlatform(requiredToken) {
  var platform = getPlatform();
  if (!platform) {
    throw new Error("No platform exists!");
  }
  if (!platform.injector.get(requiredToken, null)) {
    throw new Error("A platform with a different configuration has been created. Please destroy it first.");
  }
  return platform;
}
exports.assertPlatform = assertPlatform;
function destroyPlatform() {
  if (_platform && !_platform.destroyed) {
    _platform.destroy();
  }
}
exports.destroyPlatform = destroyPlatform;
function getPlatform() {
  return _platform && !_platform.destroyed ? _platform : null;
}
exports.getPlatform = getPlatform;
var PlatformRef = (function () {
  function PlatformRef(_injector) {
    this._injector = _injector;
    this._modules = [];
    this._destroyListeners = [];
    this._destroyed = false;
  }
  exports.PlatformRef = PlatformRef;
  PlatformRef.prototype.bootstrapModuleFactory = function (moduleFactory, options) {
    var _this = this;
    var ngZoneOption = options ? options.ngZone : undefined;
    var ngZone = getNgZone(ngZoneOption);
    var providers = [{
      provide: NgZone,
      useValue: ngZone
    }];
    return ngZone.run(function () {
      var ngZoneInjector = Injector.create({
        providers: providers,
        parent: _this.injector,
        name: moduleFactory.moduleType.name
      });
      var moduleRef = moduleFactory.create(ngZoneInjector);
      var exceptionHandler = moduleRef.injector.get(ErrorHandler, null);
      if (!exceptionHandler) {
        throw new Error("No ErrorHandler. Is platform module (BrowserModule) included?");
      }
      if (ivyEnabled) {
        var localeId = moduleRef.injector.get(LOCALE_ID$1, DEFAULT_LOCALE_ID);
        setLocaleId(localeId || DEFAULT_LOCALE_ID);
      }
      moduleRef.onDestroy(function () {
        return remove(_this._modules, moduleRef);
      });
      ngZone.runOutsideAngular(function () {
        return ngZone.onError.subscribe({
          next: function (error) {
            exceptionHandler.handleError(error);
          }
        });
      });
      return _callAndReportToErrorHandler(exceptionHandler, ngZone, function () {
        var initStatus = moduleRef.injector.get(ApplicationInitStatus);
        initStatus.runInitializers();
        return initStatus.donePromise.then(function () {
          _this._moduleDoBootstrap(moduleRef);
          return moduleRef;
        });
      });
    });
  };
  PlatformRef.prototype.bootstrapModule = function (moduleType, compilerOptions) {
    var _this = this;
    if (compilerOptions === void 0) {
      compilerOptions = [];
    }
    var options = optionsReducer({}, compilerOptions);
    return compileNgModuleFactory(this.injector, options, moduleType).then(function (moduleFactory) {
      return _this.bootstrapModuleFactory(moduleFactory, options);
    });
  };
  PlatformRef.prototype._moduleDoBootstrap = function (moduleRef) {
    var appRef = moduleRef.injector.get(ApplicationRef);
    if (moduleRef._bootstrapComponents.length > 0) {
      moduleRef._bootstrapComponents.forEach(function (f) {
        return appRef.bootstrap(f);
      });
    } else if (moduleRef.instance.ngDoBootstrap) {
      moduleRef.instance.ngDoBootstrap(appRef);
    } else {
      throw new Error("The module " + stringify(moduleRef.instance.constructor) + " was bootstrapped, but it does not declare \"@NgModule.bootstrap\" components nor a \"ngDoBootstrap\" method. " + "Please define one of these.");
    }
    this._modules.push(moduleRef);
  };
  PlatformRef.prototype.onDestroy = function (callback) {
    this._destroyListeners.push(callback);
  };
  Object.defineProperty(PlatformRef.prototype, "injector", {
    get: function () {
      return this._injector;
    },
    enumerable: true,
    configurable: true
  });
  PlatformRef.prototype.destroy = function () {
    if (this._destroyed) {
      throw new Error("The platform has already been destroyed!");
    }
    this._modules.slice().forEach(function (module) {
      return module.destroy();
    });
    this._destroyListeners.forEach(function (listener) {
      return listener();
    });
    this._destroyed = true;
  };
  Object.defineProperty(PlatformRef.prototype, "destroyed", {
    get: function () {
      return this._destroyed;
    },
    enumerable: true,
    configurable: true
  });
  PlatformRef = tslib_1.__decorate([Injectable(), tslib_1.__metadata("design:paramtypes", [Injector])], PlatformRef);
  return PlatformRef;
})();
exports.PlatformRef = PlatformRef;
function getNgZone(ngZoneOption) {
  var ngZone;
  if (ngZoneOption === "noop") {
    ngZone = new NoopNgZone();
  } else {
    ngZone = (ngZoneOption === "zone.js" ? undefined : ngZoneOption) || new NgZone({
      enableLongStackTrace: isDevMode()
    });
  }
  return ngZone;
}
function _callAndReportToErrorHandler(errorHandler, ngZone, callback) {
  try {
    var result = callback();
    if (isPromise(result)) {
      return result.catch(function (e) {
        ngZone.runOutsideAngular(function () {
          return errorHandler.handleError(e);
        });
        throw e;
      });
    }
    return result;
  } catch (e) {
    ngZone.runOutsideAngular(function () {
      return errorHandler.handleError(e);
    });
    throw e;
  }
}
function optionsReducer(dst, objs) {
  if (Array.isArray(objs)) {
    dst = objs.reduce(optionsReducer, dst);
  } else {
    dst = tslib_1.__assign({}, dst, objs);
  }
  return dst;
}
var ApplicationRef = (function () {
  function ApplicationRef(_zone, _console, _injector, _exceptionHandler, _componentFactoryResolver, _initStatus) {
    var _this = this;
    this._zone = _zone;
    this._console = _console;
    this._injector = _injector;
    this._exceptionHandler = _exceptionHandler;
    this._componentFactoryResolver = _componentFactoryResolver;
    this._initStatus = _initStatus;
    this._bootstrapListeners = [];
    this._views = [];
    this._runningTick = false;
    this._enforceNoNewChanges = false;
    this._stable = true;
    this.componentTypes = [];
    this.components = [];
    this._enforceNoNewChanges = isDevMode();
    this._zone.onMicrotaskEmpty.subscribe({
      next: function () {
        _this._zone.run(function () {
          _this.tick();
        });
      }
    });
    var isCurrentlyStable = new rxjs_2.Observable(function (observer) {
      _this._stable = _this._zone.isStable && !_this._zone.hasPendingMacrotasks && !_this._zone.hasPendingMicrotasks;
      _this._zone.runOutsideAngular(function () {
        observer.next(_this._stable);
        observer.complete();
      });
    });
    var isStable = new rxjs_2.Observable(function (observer) {
      var stableSub;
      _this._zone.runOutsideAngular(function () {
        stableSub = _this._zone.onStable.subscribe(function () {
          NgZone.assertNotInAngularZone();
          scheduleMicroTask(function () {
            if (!_this._stable && !_this._zone.hasPendingMacrotasks && !_this._zone.hasPendingMicrotasks) {
              _this._stable = true;
              observer.next(true);
            }
          });
        });
      });
      var unstableSub = _this._zone.onUnstable.subscribe(function () {
        NgZone.assertInAngularZone();
        if (_this._stable) {
          _this._stable = false;
          _this._zone.runOutsideAngular(function () {
            observer.next(false);
          });
        }
      });
      return function () {
        stableSub.unsubscribe();
        unstableSub.unsubscribe();
      };
    });
    this.isStable = rxjs_2.merge(isCurrentlyStable, isStable.pipe(operators_3.share()));
  }
  exports.ApplicationRef = ApplicationRef;
  ApplicationRef_1 = ApplicationRef;
  ApplicationRef.prototype.bootstrap = function (componentOrFactory, rootSelectorOrNode) {
    var _this = this;
    if (!this._initStatus.done) {
      throw new Error("Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.");
    }
    var componentFactory;
    if (componentOrFactory instanceof ComponentFactory) {
      componentFactory = componentOrFactory;
    } else {
      componentFactory = this._componentFactoryResolver.resolveComponentFactory(componentOrFactory);
    }
    this.componentTypes.push(componentFactory.componentType);
    var ngModule = isBoundToModule(componentFactory) ? null : this._injector.get(NgModuleRef);
    var selectorOrNode = rootSelectorOrNode || componentFactory.selector;
    var compRef = componentFactory.create(Injector.NULL, [], selectorOrNode, ngModule);
    compRef.onDestroy(function () {
      _this._unloadComponent(compRef);
    });
    var testability = compRef.injector.get(Testability, null);
    if (testability) {
      compRef.injector.get(TestabilityRegistry).registerApplication(compRef.location.nativeElement, testability);
    }
    this._loadComponent(compRef);
    if (isDevMode()) {
      this._console.log("Angular is running in the development mode. Call enableProdMode() to enable the production mode.");
    }
    return compRef;
  };
  ApplicationRef.prototype.tick = function () {
    var e_1, _a, e_2, _b;
    var _this = this;
    if (this._runningTick) {
      throw new Error("ApplicationRef.tick is called recursively");
    }
    var scope = ApplicationRef_1._tickScope();
    try {
      this._runningTick = true;
      try {
        for (var _c = tslib_1.__values(this._views), _d = _c.next(); !_d.done; _d = _c.next()) {
          var view = _d.value;
          view.detectChanges();
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      if (this._enforceNoNewChanges) {
        try {
          for (var _e = tslib_1.__values(this._views), _f = _e.next(); !_f.done; _f = _e.next()) {
            var view = _f.value;
            view.checkNoChanges();
          }
        } catch (e_2_1) {
          e_2 = {
            error: e_2_1
          };
        } finally {
          try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
    } catch (e) {
      this._zone.runOutsideAngular(function () {
        return _this._exceptionHandler.handleError(e);
      });
    } finally {
      this._runningTick = false;
      wtfLeave(scope);
    }
  };
  ApplicationRef.prototype.attachView = function (viewRef) {
    var view = viewRef;
    this._views.push(view);
    view.attachToAppRef(this);
  };
  ApplicationRef.prototype.detachView = function (viewRef) {
    var view = viewRef;
    remove(this._views, view);
    view.detachFromAppRef();
  };
  ApplicationRef.prototype._loadComponent = function (componentRef) {
    this.attachView(componentRef.hostView);
    this.tick();
    this.components.push(componentRef);
    var listeners = this._injector.get(APP_BOOTSTRAP_LISTENER, []).concat(this._bootstrapListeners);
    listeners.forEach(function (listener) {
      return listener(componentRef);
    });
  };
  ApplicationRef.prototype._unloadComponent = function (componentRef) {
    this.detachView(componentRef.hostView);
    remove(this.components, componentRef);
  };
  ApplicationRef.prototype.ngOnDestroy = function () {
    this._views.slice().forEach(function (view) {
      return view.destroy();
    });
  };
  Object.defineProperty(ApplicationRef.prototype, "viewCount", {
    get: function () {
      return this._views.length;
    },
    enumerable: true,
    configurable: true
  });
  var ApplicationRef_1;
  ApplicationRef._tickScope = wtfCreateScope("ApplicationRef#tick()");
  ApplicationRef = ApplicationRef_1 = tslib_1.__decorate([Injectable(), tslib_1.__metadata("design:paramtypes", [NgZone, Console, Injector, ErrorHandler, ComponentFactoryResolver, ApplicationInitStatus])], ApplicationRef);
  return ApplicationRef;
})();
exports.ApplicationRef = ApplicationRef;
function remove(list, el) {
  var index = list.indexOf(el);
  if (index > -1) {
    list.splice(index, 1);
  }
}
function _mergeArrays(parts) {
  var result = [];
  parts.forEach(function (part) {
    return part && result.push.apply(result, tslib_1.__spread(part));
  });
  return result;
}
var NgModuleFactoryLoader = (function () {
  function NgModuleFactoryLoader() {}
  exports.NgModuleFactoryLoader = NgModuleFactoryLoader;
  return NgModuleFactoryLoader;
})();
exports.NgModuleFactoryLoader = NgModuleFactoryLoader;
function getModuleFactory__PRE_R3__(id) {
  var factory = getRegisteredNgModuleType(id);
  if (!factory) throw noModuleError(id);
  return factory;
}
exports.ɵangular_packages_core_core_i = getModuleFactory__PRE_R3__;
function getModuleFactory__POST_R3__(id) {
  var type = getRegisteredNgModuleType(id);
  if (!type) throw noModuleError(id);
  return new NgModuleFactory$1(type);
}
exports.ɵgetModuleFactory__POST_R3__ = getModuleFactory__POST_R3__;
var getModuleFactory = getModuleFactory__PRE_R3__;
exports.getModuleFactory = getModuleFactory;
function noModuleError(id) {
  return new Error("No module with ID " + id + " loaded");
}
var _SEPARATOR = "#";
var FACTORY_CLASS_SUFFIX = "NgFactory";
var SystemJsNgModuleLoaderConfig = (function () {
  function SystemJsNgModuleLoaderConfig() {}
  exports.SystemJsNgModuleLoaderConfig = SystemJsNgModuleLoaderConfig;
  return SystemJsNgModuleLoaderConfig;
})();
exports.SystemJsNgModuleLoaderConfig = SystemJsNgModuleLoaderConfig;
var DEFAULT_CONFIG = {
  factoryPathPrefix: "",
  factoryPathSuffix: ".ngfactory"
};
var SystemJsNgModuleLoader = (function () {
  function SystemJsNgModuleLoader(_compiler, config) {
    this._compiler = _compiler;
    this._config = config || DEFAULT_CONFIG;
  }
  exports.SystemJsNgModuleLoader = SystemJsNgModuleLoader;
  SystemJsNgModuleLoader.prototype.load = function (path) {
    var legacyOfflineMode = !ivyEnabled && this._compiler instanceof Compiler;
    return legacyOfflineMode ? this.loadFactory(path) : this.loadAndCompile(path);
  };
  SystemJsNgModuleLoader.prototype.loadAndCompile = function (path) {
    var _this = this;
    var _a = tslib_1.__read(path.split(_SEPARATOR), 2), module = _a[0], exportName = _a[1];
    if (exportName === undefined) {
      exportName = "default";
    }
    return System.import(module).then(function (module) {
      return module[exportName];
    }).then(function (type) {
      return checkNotEmpty(type, module, exportName);
    }).then(function (type) {
      return _this._compiler.compileModuleAsync(type);
    });
  };
  SystemJsNgModuleLoader.prototype.loadFactory = function (path) {
    var _a = tslib_1.__read(path.split(_SEPARATOR), 2), module = _a[0], exportName = _a[1];
    var factoryClassSuffix = FACTORY_CLASS_SUFFIX;
    if (exportName === undefined) {
      exportName = "default";
      factoryClassSuffix = "";
    }
    return System.import(this._config.factoryPathPrefix + module + this._config.factoryPathSuffix).then(function (module) {
      return module[exportName + factoryClassSuffix];
    }).then(function (factory) {
      return checkNotEmpty(factory, module, exportName);
    });
  };
  SystemJsNgModuleLoader = tslib_1.__decorate([Injectable(), tslib_1.__param(1, Optional()), tslib_1.__metadata("design:paramtypes", [Compiler, SystemJsNgModuleLoaderConfig])], SystemJsNgModuleLoader);
  return SystemJsNgModuleLoader;
})();
exports.SystemJsNgModuleLoader = SystemJsNgModuleLoader;
function checkNotEmpty(value, modulePath, exportName) {
  if (!value) {
    throw new Error("Cannot find '" + exportName + "' in '" + modulePath + "'");
  }
  return value;
}
var ViewRef$1 = (function (_super) {
  tslib_1.__extends(ViewRef, _super);
  function ViewRef() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return ViewRef;
})(ChangeDetectorRef);
exports.ViewRef = ViewRef$1;
var EmbeddedViewRef = (function (_super) {
  tslib_1.__extends(EmbeddedViewRef, _super);
  function EmbeddedViewRef() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  exports.EmbeddedViewRef = EmbeddedViewRef;
  return EmbeddedViewRef;
})(ViewRef$1);
exports.EmbeddedViewRef = EmbeddedViewRef;
var DebugEventListener = (function () {
  function DebugEventListener(name, callback) {
    this.name = name;
    this.callback = callback;
  }
  exports.DebugEventListener = DebugEventListener;
  return DebugEventListener;
})();
exports.DebugEventListener = DebugEventListener;
var DebugNode__PRE_R3__ = (function () {
  function DebugNode__PRE_R3__(nativeNode, parent, _debugContext) {
    this.listeners = [];
    this.parent = null;
    this._debugContext = _debugContext;
    this.nativeNode = nativeNode;
    if (parent && parent instanceof DebugElement__PRE_R3__) {
      parent.addChild(this);
    }
  }
  exports.ɵangular_packages_core_core_j = DebugNode__PRE_R3__;
  Object.defineProperty(DebugNode__PRE_R3__.prototype, "injector", {
    get: function () {
      return this._debugContext.injector;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugNode__PRE_R3__.prototype, "componentInstance", {
    get: function () {
      return this._debugContext.component;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugNode__PRE_R3__.prototype, "context", {
    get: function () {
      return this._debugContext.context;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugNode__PRE_R3__.prototype, "references", {
    get: function () {
      return this._debugContext.references;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugNode__PRE_R3__.prototype, "providerTokens", {
    get: function () {
      return this._debugContext.providerTokens;
    },
    enumerable: true,
    configurable: true
  });
  return DebugNode__PRE_R3__;
})();
exports.ɵangular_packages_core_core_j = DebugNode__PRE_R3__;
var DebugElement__PRE_R3__ = (function (_super) {
  tslib_1.__extends(DebugElement__PRE_R3__, _super);
  function DebugElement__PRE_R3__(nativeNode, parent, _debugContext) {
    var _this = _super.call(this, nativeNode, parent, _debugContext) || this;
    _this.properties = {};
    _this.attributes = {};
    _this.classes = {};
    _this.styles = {};
    _this.childNodes = [];
    _this.nativeElement = nativeNode;
    return _this;
  }
  exports.ɵangular_packages_core_core_k = DebugElement__PRE_R3__;
  DebugElement__PRE_R3__.prototype.addChild = function (child) {
    if (child) {
      this.childNodes.push(child);
      child.parent = this;
    }
  };
  DebugElement__PRE_R3__.prototype.removeChild = function (child) {
    var childIndex = this.childNodes.indexOf(child);
    if (childIndex !== -1) {
      child.parent = null;
      this.childNodes.splice(childIndex, 1);
    }
  };
  DebugElement__PRE_R3__.prototype.insertChildrenAfter = function (child, newChildren) {
    var _a;
    var _this = this;
    var siblingIndex = this.childNodes.indexOf(child);
    if (siblingIndex !== -1) {
      (_a = this.childNodes).splice.apply(_a, tslib_1.__spread([siblingIndex + 1, 0], newChildren));
      newChildren.forEach(function (c) {
        if (c.parent) {
          c.parent.removeChild(c);
        }
        child.parent = _this;
      });
    }
  };
  DebugElement__PRE_R3__.prototype.insertBefore = function (refChild, newChild) {
    var refIndex = this.childNodes.indexOf(refChild);
    if (refIndex === -1) {
      this.addChild(newChild);
    } else {
      if (newChild.parent) {
        newChild.parent.removeChild(newChild);
      }
      newChild.parent = this;
      this.childNodes.splice(refIndex, 0, newChild);
    }
  };
  DebugElement__PRE_R3__.prototype.query = function (predicate) {
    var results = this.queryAll(predicate);
    return results[0] || null;
  };
  DebugElement__PRE_R3__.prototype.queryAll = function (predicate) {
    var matches = [];
    _queryElementChildren(this, predicate, matches);
    return matches;
  };
  DebugElement__PRE_R3__.prototype.queryAllNodes = function (predicate) {
    var matches = [];
    _queryNodeChildren(this, predicate, matches);
    return matches;
  };
  Object.defineProperty(DebugElement__PRE_R3__.prototype, "children", {
    get: function () {
      return this.childNodes.filter(function (node) {
        return node instanceof DebugElement__PRE_R3__;
      });
    },
    enumerable: true,
    configurable: true
  });
  DebugElement__PRE_R3__.prototype.triggerEventHandler = function (eventName, eventObj) {
    this.listeners.forEach(function (listener) {
      if (listener.name == eventName) {
        listener.callback(eventObj);
      }
    });
  };
  return DebugElement__PRE_R3__;
})(DebugNode__PRE_R3__);
exports.ɵangular_packages_core_core_k = DebugElement__PRE_R3__;
function asNativeElements(debugEls) {
  return debugEls.map(function (el) {
    return el.nativeElement;
  });
}
exports.asNativeElements = asNativeElements;
function _queryElementChildren(element, predicate, matches) {
  element.childNodes.forEach(function (node) {
    if (node instanceof DebugElement__PRE_R3__) {
      if (predicate(node)) {
        matches.push(node);
      }
      _queryElementChildren(node, predicate, matches);
    }
  });
}
function _queryNodeChildren(parentNode, predicate, matches) {
  if (parentNode instanceof DebugElement__PRE_R3__) {
    parentNode.childNodes.forEach(function (node) {
      if (predicate(node)) {
        matches.push(node);
      }
      if (node instanceof DebugElement__PRE_R3__) {
        _queryNodeChildren(node, predicate, matches);
      }
    });
  }
}
var DebugNode__POST_R3__ = (function () {
  function DebugNode__POST_R3__(nativeNode) {
    this.nativeNode = nativeNode;
  }
  Object.defineProperty(DebugNode__POST_R3__.prototype, "parent", {
    get: function () {
      var parent = this.nativeNode.parentNode;
      return parent ? new DebugElement__POST_R3__(parent) : null;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugNode__POST_R3__.prototype, "injector", {
    get: function () {
      return getInjector(this.nativeNode);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugNode__POST_R3__.prototype, "componentInstance", {
    get: function () {
      var nativeElement = this.nativeNode;
      return nativeElement && (getComponent(nativeElement) || getViewComponent(nativeElement));
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugNode__POST_R3__.prototype, "context", {
    get: function () {
      return getComponent(this.nativeNode) || getContext$1(this.nativeNode);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugNode__POST_R3__.prototype, "listeners", {
    get: function () {
      return getListeners(this.nativeNode).filter(isBrowserEvents);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugNode__POST_R3__.prototype, "references", {
    get: function () {
      return getLocalRefs(this.nativeNode);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugNode__POST_R3__.prototype, "providerTokens", {
    get: function () {
      return getInjectionTokens(this.nativeNode);
    },
    enumerable: true,
    configurable: true
  });
  return DebugNode__POST_R3__;
})();
var DebugElement__POST_R3__ = (function (_super) {
  tslib_1.__extends(DebugElement__POST_R3__, _super);
  function DebugElement__POST_R3__(nativeNode) {
    var _this = this;
    ngDevMode && assertDomNode(nativeNode);
    _this = _super.call(this, nativeNode) || this;
    return _this;
  }
  Object.defineProperty(DebugElement__POST_R3__.prototype, "nativeElement", {
    get: function () {
      return this.nativeNode.nodeType == Node.ELEMENT_NODE ? this.nativeNode : null;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugElement__POST_R3__.prototype, "name", {
    get: function () {
      return this.nativeElement.nodeName;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugElement__POST_R3__.prototype, "properties", {
    get: function () {
      var context = loadLContext(this.nativeNode);
      var lView = context.lView;
      var tData = lView[TVIEW].data;
      var tNode = tData[context.nodeIndex];
      var properties = collectPropertyBindings(tNode, lView, tData);
      var hostProperties = collectHostPropertyBindings(tNode, lView, tData);
      var className = collectClassNames(this);
      var output = tslib_1.__assign({}, properties, hostProperties);
      if (className) {
        output["className"] = output["className"] ? output["className"] + (" " + className) : className;
      }
      return output;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugElement__POST_R3__.prototype, "attributes", {
    get: function () {
      var attributes = {};
      var element = this.nativeElement;
      if (!element) {
        return attributes;
      }
      var context = loadLContext(element);
      var lView = context.lView;
      var tNodeAttrs = lView[TVIEW].data[context.nodeIndex].attrs;
      var lowercaseTNodeAttrs = [];
      if (tNodeAttrs) {
        var i = 0;
        while (i < tNodeAttrs.length) {
          var attrName = tNodeAttrs[i];
          if (typeof attrName !== "string") break;
          var attrValue = tNodeAttrs[i + 1];
          attributes[attrName] = attrValue;
          lowercaseTNodeAttrs.push(attrName.toLowerCase());
          i += 2;
        }
      }
      var eAttrs = element.attributes;
      for (var i = 0; i < eAttrs.length; i++) {
        var attr = eAttrs[i];
        if (lowercaseTNodeAttrs.indexOf(attr.name) === -1) {
          attributes[attr.name] = attr.value;
        }
      }
      return attributes;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugElement__POST_R3__.prototype, "styles", {
    get: function () {
      return _getStylingDebugInfo(this.nativeElement, false);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugElement__POST_R3__.prototype, "classes", {
    get: function () {
      return _getStylingDebugInfo(this.nativeElement, true);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugElement__POST_R3__.prototype, "childNodes", {
    get: function () {
      var childNodes = this.nativeNode.childNodes;
      var children = [];
      for (var i = 0; i < childNodes.length; i++) {
        var element = childNodes[i];
        children.push(getDebugNode__POST_R3__(element));
      }
      return children;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugElement__POST_R3__.prototype, "children", {
    get: function () {
      var nativeElement = this.nativeElement;
      if (!nativeElement) return [];
      var childNodes = nativeElement.children;
      var children = [];
      for (var i = 0; i < childNodes.length; i++) {
        var element = childNodes[i];
        children.push(getDebugNode__POST_R3__(element));
      }
      return children;
    },
    enumerable: true,
    configurable: true
  });
  DebugElement__POST_R3__.prototype.query = function (predicate) {
    var results = this.queryAll(predicate);
    return results[0] || null;
  };
  DebugElement__POST_R3__.prototype.queryAll = function (predicate) {
    var matches = [];
    _queryAllR3(this, predicate, matches, true);
    return matches;
  };
  DebugElement__POST_R3__.prototype.queryAllNodes = function (predicate) {
    var matches = [];
    _queryAllR3(this, predicate, matches, false);
    return matches;
  };
  DebugElement__POST_R3__.prototype.triggerEventHandler = function (eventName, eventObj) {
    this.listeners.forEach(function (listener) {
      if (listener.name === eventName) {
        listener.callback(eventObj);
      }
    });
  };
  return DebugElement__POST_R3__;
})(DebugNode__POST_R3__);
function _getStylingDebugInfo(element, isClassBased) {
  if (element) {
    var context = loadLContextFromNode(element);
    var lView = context.lView;
    var tData = lView[TVIEW].data;
    var tNode = tData[context.nodeIndex];
    if (isClassBased) {
      return isStylingContext(tNode.classes) ? new NodeStylingDebug(tNode.classes, lView, true).values : stylingMapToStringMap(tNode.classes);
    } else {
      return isStylingContext(tNode.styles) ? new NodeStylingDebug(tNode.styles, lView, false).values : stylingMapToStringMap(tNode.styles);
    }
  }
  return {};
}
function _queryAllR3(parentElement, predicate, matches, elementsOnly) {
  var context = loadLContext(parentElement.nativeNode);
  var parentTNode = context.lView[TVIEW].data[context.nodeIndex];
  _queryNodeChildrenR3(parentTNode, context.lView, predicate, matches, elementsOnly, parentElement.nativeNode);
}
function _queryNodeChildrenR3(tNode, lView, predicate, matches, elementsOnly, rootNativeNode) {
  var e_1, _a;
  var nativeNode = getNativeByTNodeOrNull(tNode, lView);
  if (tNode.type === 3 || tNode.type === 4) {
    _addQueryMatchR3(nativeNode, predicate, matches, elementsOnly, rootNativeNode);
    if (isComponent(tNode)) {
      var componentView = getComponentViewByIndex(tNode.index, lView);
      if (componentView && componentView[TVIEW].firstChild) {
        _queryNodeChildrenR3(componentView[TVIEW].firstChild, componentView, predicate, matches, elementsOnly, rootNativeNode);
      }
    } else {
      if (tNode.child) {
        _queryNodeChildrenR3(tNode.child, lView, predicate, matches, elementsOnly, rootNativeNode);
      }
      nativeNode && _queryNativeNodeDescendants(nativeNode, predicate, matches, elementsOnly);
    }
    var nodeOrContainer = lView[tNode.index];
    if (isLContainer(nodeOrContainer)) {
      _queryNodeChildrenInContainerR3(nodeOrContainer, predicate, matches, elementsOnly, rootNativeNode);
    }
  } else if (tNode.type === 0) {
    var lContainer = lView[tNode.index];
    _addQueryMatchR3(lContainer[NATIVE], predicate, matches, elementsOnly, rootNativeNode);
    _queryNodeChildrenInContainerR3(lContainer, predicate, matches, elementsOnly, rootNativeNode);
  } else if (tNode.type === 1) {
    var componentView = findComponentView(lView);
    var componentHost = componentView[T_HOST];
    var head = componentHost.projection[tNode.projection];
    if (Array.isArray(head)) {
      try {
        for (var head_1 = tslib_1.__values(head), head_1_1 = head_1.next(); !head_1_1.done; head_1_1 = head_1.next()) {
          var nativeNode_1 = head_1_1.value;
          _addQueryMatchR3(nativeNode_1, predicate, matches, elementsOnly, rootNativeNode);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (head_1_1 && !head_1_1.done && (_a = head_1.return)) _a.call(head_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    } else if (head) {
      var nextLView = componentView[PARENT];
      var nextTNode = nextLView[TVIEW].data[head.index];
      _queryNodeChildrenR3(nextTNode, nextLView, predicate, matches, elementsOnly, rootNativeNode);
    }
  } else if (tNode.child) {
    _queryNodeChildrenR3(tNode.child, lView, predicate, matches, elementsOnly, rootNativeNode);
  }
  if (rootNativeNode !== nativeNode) {
    var nextTNode = tNode.flags & 2 ? tNode.projectionNext : tNode.next;
    if (nextTNode) {
      _queryNodeChildrenR3(nextTNode, lView, predicate, matches, elementsOnly, rootNativeNode);
    }
  }
}
function _queryNodeChildrenInContainerR3(lContainer, predicate, matches, elementsOnly, rootNativeNode) {
  for (var i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
    var childView = lContainer[i];
    _queryNodeChildrenR3(childView[TVIEW].node, childView, predicate, matches, elementsOnly, rootNativeNode);
  }
}
function _addQueryMatchR3(nativeNode, predicate, matches, elementsOnly, rootNativeNode) {
  if (rootNativeNode !== nativeNode) {
    var debugNode = getDebugNode(nativeNode);
    if (!debugNode) {
      return;
    }
    if (elementsOnly && debugNode instanceof DebugElement__POST_R3__ && predicate(debugNode) && matches.indexOf(debugNode) === -1) {
      matches.push(debugNode);
    } else if (!elementsOnly && predicate(debugNode) && matches.indexOf(debugNode) === -1) {
      matches.push(debugNode);
    }
  }
}
function _queryNativeNodeDescendants(parentNode, predicate, matches, elementsOnly) {
  var nodes = parentNode.childNodes;
  var length = nodes.length;
  for (var i = 0; i < length; i++) {
    var node = nodes[i];
    var debugNode = getDebugNode(node);
    if (debugNode) {
      if (elementsOnly && debugNode instanceof DebugElement__POST_R3__ && predicate(debugNode) && matches.indexOf(debugNode) === -1) {
        matches.push(debugNode);
      } else if (!elementsOnly && predicate(debugNode) && matches.indexOf(debugNode) === -1) {
        matches.push(debugNode);
      }
      _queryNativeNodeDescendants(node, predicate, matches, elementsOnly);
    }
  }
}
function collectPropertyBindings(tNode, lView, tData) {
  var properties = {};
  var bindingIndex = getFirstBindingIndex(tNode.propertyMetadataStartIndex, tData);
  while (bindingIndex < tNode.propertyMetadataEndIndex) {
    var value = void 0;
    var propMetadata = tData[bindingIndex];
    while (!isPropMetadataString(propMetadata)) {
      value = (value || "") + renderStringify(lView[bindingIndex]) + tData[bindingIndex];
      propMetadata = tData[++bindingIndex];
    }
    value = value === undefined ? lView[bindingIndex] : value += lView[bindingIndex];
    var metadataParts = propMetadata.split(INTERPOLATION_DELIMITER);
    var propertyName = metadataParts[0];
    if (propertyName) {
      properties[propertyName] = metadataParts[1] && metadataParts[2] ? metadataParts[1] + value + metadataParts[2] : value;
    }
    bindingIndex++;
  }
  return properties;
}
function getFirstBindingIndex(metadataIndex, tData) {
  var currentBindingIndex = metadataIndex - 1;
  var currentValue = tData[currentBindingIndex];
  while (typeof currentValue === "string" && !isPropMetadataString(currentValue)) {
    currentValue = tData[--currentBindingIndex];
  }
  return currentBindingIndex + 1;
}
function collectHostPropertyBindings(tNode, lView, tData) {
  var properties = {};
  var hostPropIndex = tNode.directiveEnd;
  var propMetadata = tData[hostPropIndex];
  while (typeof propMetadata === "string") {
    var propertyName = propMetadata.split(INTERPOLATION_DELIMITER)[0];
    properties[propertyName] = lView[hostPropIndex];
    propMetadata = tData[++hostPropIndex];
  }
  return properties;
}
function collectClassNames(debugElement) {
  var e_2, _a;
  var classes = debugElement.classes;
  var output = "";
  try {
    for (var _b = tslib_1.__values(Object.keys(classes)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var className = _c.value;
      if (classes[className]) {
        output = output ? output + (" " + className) : className;
      }
    }
  } catch (e_2_1) {
    e_2 = {
      error: e_2_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_2) throw e_2.error;
    }
  }
  return output;
}
var _nativeNodeToDebugNode = new Map();
function getDebugNode__PRE_R3__(nativeNode) {
  return _nativeNodeToDebugNode.get(nativeNode) || null;
}
var NG_DEBUG_PROPERTY = "__ng_debug__";
function getDebugNode__POST_R3__(nativeNode) {
  if (nativeNode instanceof Node) {
    if (!nativeNode.hasOwnProperty(NG_DEBUG_PROPERTY)) {
      nativeNode[NG_DEBUG_PROPERTY] = nativeNode.nodeType == Node.ELEMENT_NODE ? new DebugElement__POST_R3__(nativeNode) : new DebugNode__POST_R3__(nativeNode);
    }
    return nativeNode[NG_DEBUG_PROPERTY];
  }
  return null;
}
exports.ɵgetDebugNode__POST_R3__ = getDebugNode__POST_R3__;
var getDebugNode = getDebugNode__PRE_R3__;
exports.getDebugNode = getDebugNode;
function getAllDebugNodes() {
  return Array.from(_nativeNodeToDebugNode.values());
}
function indexDebugNode(node) {
  _nativeNodeToDebugNode.set(node.nativeNode, node);
}
function removeDebugNodeFromIndex(node) {
  _nativeNodeToDebugNode.delete(node.nativeNode);
}
var DebugNode = DebugNode__PRE_R3__;
exports.DebugNode = DebugNode;
var DebugElement = DebugElement__PRE_R3__;
exports.DebugElement = DebugElement;
var _CORE_PLATFORM_PROVIDERS = [{
  provide: PLATFORM_ID,
  useValue: "unknown"
}, {
  provide: PlatformRef,
  deps: [Injector]
}, {
  provide: TestabilityRegistry,
  deps: []
}, {
  provide: Console,
  deps: []
}];
var platformCore = createPlatformFactory(null, "core", _CORE_PLATFORM_PROVIDERS);
exports.platformCore = platformCore;
function _iterableDiffersFactory() {
  return defaultIterableDiffers;
}
exports.ɵangular_packages_core_core_n = _iterableDiffersFactory;
function _keyValueDiffersFactory() {
  return defaultKeyValueDiffers;
}
exports.ɵangular_packages_core_core_o = _keyValueDiffersFactory;
function _localeFactory(locale) {
  if (locale) {
    if (ivyEnabled) {
      setLocaleId(locale);
    }
    return locale;
  }
  if (ngI18nClosureMode && typeof goog !== "undefined" && goog.LOCALE !== "en") {
    if (ivyEnabled) {
      setLocaleId(goog.LOCALE);
    }
    return goog.LOCALE;
  }
  return DEFAULT_LOCALE_ID;
}
exports.ɵangular_packages_core_core_p = _localeFactory;
var APPLICATION_MODULE_PROVIDERS = [{
  provide: ApplicationRef,
  useClass: ApplicationRef,
  deps: [NgZone, Console, Injector, ErrorHandler, ComponentFactoryResolver, ApplicationInitStatus]
}, {
  provide: SCHEDULER,
  deps: [NgZone],
  useFactory: zoneSchedulerFactory
}, {
  provide: ApplicationInitStatus,
  useClass: ApplicationInitStatus,
  deps: [[new Optional(), APP_INITIALIZER]]
}, {
  provide: Compiler,
  useClass: Compiler,
  deps: []
}, APP_ID_RANDOM_PROVIDER, {
  provide: IterableDiffers,
  useFactory: _iterableDiffersFactory,
  deps: []
}, {
  provide: KeyValueDiffers,
  useFactory: _keyValueDiffersFactory,
  deps: []
}, {
  provide: LOCALE_ID$1,
  useFactory: _localeFactory,
  deps: [[new Inject(LOCALE_ID$1), new Optional(), new SkipSelf()]]
}];
exports.ɵangular_packages_core_core_q = APPLICATION_MODULE_PROVIDERS;
function zoneSchedulerFactory(ngZone) {
  var queue = [];
  ngZone.onStable.subscribe(function () {
    while (queue.length) {
      queue.pop()();
    }
  });
  return function (fn) {
    queue.push(fn);
  };
}
exports.ɵangular_packages_core_core_r = zoneSchedulerFactory;
var ApplicationModule = (function () {
  function ApplicationModule(appRef) {}
  exports.ApplicationModule = ApplicationModule;
  ApplicationModule = tslib_1.__decorate([NgModule({
    providers: APPLICATION_MODULE_PROVIDERS
  }), tslib_1.__metadata("design:paramtypes", [ApplicationRef])], ApplicationModule);
  return ApplicationModule;
})();
exports.ApplicationModule = ApplicationModule;
function anchorDef(flags, matchedQueriesDsl, ngContentIndex, childCount, handleEvent, templateFactory) {
  flags |= 1;
  var _a = splitMatchedQueriesDsl(matchedQueriesDsl), matchedQueries = _a.matchedQueries, references = _a.references, matchedQueryIds = _a.matchedQueryIds;
  var template = templateFactory ? resolveDefinition(templateFactory) : null;
  return {
    nodeIndex: -1,
    parent: null,
    renderParent: null,
    bindingIndex: -1,
    outputIndex: -1,
    flags: flags,
    checkIndex: -1,
    childFlags: 0,
    directChildFlags: 0,
    childMatchedQueries: 0,
    matchedQueries: matchedQueries,
    matchedQueryIds: matchedQueryIds,
    references: references,
    ngContentIndex: ngContentIndex,
    childCount: childCount,
    bindings: [],
    bindingFlags: 0,
    outputs: [],
    element: {
      ns: null,
      name: null,
      attrs: null,
      template: template,
      componentProvider: null,
      componentView: null,
      componentRendererType: null,
      publicProviders: null,
      allProviders: null,
      handleEvent: handleEvent || NOOP
    },
    provider: null,
    text: null,
    query: null,
    ngContent: null
  };
}
exports.ɵand = anchorDef;
function elementDef(checkIndex, flags, matchedQueriesDsl, ngContentIndex, childCount, namespaceAndName, fixedAttrs, bindings, outputs, handleEvent, componentView, componentRendererType) {
  var _a;
  if (fixedAttrs === void 0) {
    fixedAttrs = [];
  }
  if (!handleEvent) {
    handleEvent = NOOP;
  }
  var _b = splitMatchedQueriesDsl(matchedQueriesDsl), matchedQueries = _b.matchedQueries, references = _b.references, matchedQueryIds = _b.matchedQueryIds;
  var ns = null;
  var name = null;
  if (namespaceAndName) {
    (_a = tslib_1.__read(splitNamespace(namespaceAndName), 2), ns = _a[0], name = _a[1]);
  }
  bindings = bindings || [];
  var bindingDefs = new Array(bindings.length);
  for (var i = 0; i < bindings.length; i++) {
    var _c = tslib_1.__read(bindings[i], 3), bindingFlags = _c[0], namespaceAndName_1 = _c[1], suffixOrSecurityContext = _c[2];
    var _d = tslib_1.__read(splitNamespace(namespaceAndName_1), 2), ns_1 = _d[0], name_1 = _d[1];
    var securityContext = undefined;
    var suffix = undefined;
    switch (bindingFlags & 15) {
      case 4:
        suffix = suffixOrSecurityContext;
        break;
      case 1:
      case 8:
        securityContext = suffixOrSecurityContext;
        break;
    }
    bindingDefs[i] = {
      flags: bindingFlags,
      ns: ns_1,
      name: name_1,
      nonMinifiedName: name_1,
      securityContext: securityContext,
      suffix: suffix
    };
  }
  outputs = outputs || [];
  var outputDefs = new Array(outputs.length);
  for (var i = 0; i < outputs.length; i++) {
    var _e = tslib_1.__read(outputs[i], 2), target = _e[0], eventName = _e[1];
    outputDefs[i] = {
      type: 0,
      target: target,
      eventName: eventName,
      propName: null
    };
  }
  fixedAttrs = fixedAttrs || [];
  var attrs = fixedAttrs.map(function (_a) {
    var _b = tslib_1.__read(_a, 2), namespaceAndName = _b[0], value = _b[1];
    var _c = tslib_1.__read(splitNamespace(namespaceAndName), 2), ns = _c[0], name = _c[1];
    return [ns, name, value];
  });
  componentRendererType = resolveRendererType2(componentRendererType);
  if (componentView) {
    flags |= 33554432;
  }
  flags |= 1;
  return {
    nodeIndex: -1,
    parent: null,
    renderParent: null,
    bindingIndex: -1,
    outputIndex: -1,
    checkIndex: checkIndex,
    flags: flags,
    childFlags: 0,
    directChildFlags: 0,
    childMatchedQueries: 0,
    matchedQueries: matchedQueries,
    matchedQueryIds: matchedQueryIds,
    references: references,
    ngContentIndex: ngContentIndex,
    childCount: childCount,
    bindings: bindingDefs,
    bindingFlags: calcBindingFlags(bindingDefs),
    outputs: outputDefs,
    element: {
      ns: ns,
      name: name,
      attrs: attrs,
      template: null,
      componentProvider: null,
      componentView: componentView || null,
      componentRendererType: componentRendererType,
      publicProviders: null,
      allProviders: null,
      handleEvent: handleEvent || NOOP
    },
    provider: null,
    text: null,
    query: null,
    ngContent: null
  };
}
exports.ɵeld = elementDef;
function createElement(view, renderHost, def) {
  var elDef = def.element;
  var rootSelectorOrNode = view.root.selectorOrNode;
  var renderer = view.renderer;
  var el;
  if (view.parent || !rootSelectorOrNode) {
    if (elDef.name) {
      el = renderer.createElement(elDef.name, elDef.ns);
    } else {
      el = renderer.createComment("");
    }
    var parentEl = getParentRenderElement(view, renderHost, def);
    if (parentEl) {
      renderer.appendChild(parentEl, el);
    }
  } else {
    var preserveContent = !!elDef.componentRendererType && elDef.componentRendererType.encapsulation === ViewEncapsulation.ShadowDom;
    el = renderer.selectRootElement(rootSelectorOrNode, preserveContent);
  }
  if (elDef.attrs) {
    for (var i = 0; i < elDef.attrs.length; i++) {
      var _a = tslib_1.__read(elDef.attrs[i], 3), ns = _a[0], name_2 = _a[1], value = _a[2];
      renderer.setAttribute(el, name_2, value, ns);
    }
  }
  return el;
}
function listenToElementOutputs(view, compView, def, el) {
  for (var i = 0; i < def.outputs.length; i++) {
    var output = def.outputs[i];
    var handleEventClosure = renderEventHandlerClosure(view, def.nodeIndex, elementEventFullName(output.target, output.eventName));
    var listenTarget = output.target;
    var listenerView = view;
    if (output.target === "component") {
      listenTarget = null;
      listenerView = compView;
    }
    var disposable = listenerView.renderer.listen(listenTarget || el, output.eventName, handleEventClosure);
    view.disposables[def.outputIndex + i] = disposable;
  }
}
function renderEventHandlerClosure(view, index, eventName) {
  return function (event) {
    return dispatchEvent(view, index, eventName, event);
  };
}
function checkAndUpdateElementInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
  var bindLen = def.bindings.length;
  var changed = false;
  if (bindLen > 0 && checkAndUpdateElementValue(view, def, 0, v0)) changed = true;
  if (bindLen > 1 && checkAndUpdateElementValue(view, def, 1, v1)) changed = true;
  if (bindLen > 2 && checkAndUpdateElementValue(view, def, 2, v2)) changed = true;
  if (bindLen > 3 && checkAndUpdateElementValue(view, def, 3, v3)) changed = true;
  if (bindLen > 4 && checkAndUpdateElementValue(view, def, 4, v4)) changed = true;
  if (bindLen > 5 && checkAndUpdateElementValue(view, def, 5, v5)) changed = true;
  if (bindLen > 6 && checkAndUpdateElementValue(view, def, 6, v6)) changed = true;
  if (bindLen > 7 && checkAndUpdateElementValue(view, def, 7, v7)) changed = true;
  if (bindLen > 8 && checkAndUpdateElementValue(view, def, 8, v8)) changed = true;
  if (bindLen > 9 && checkAndUpdateElementValue(view, def, 9, v9)) changed = true;
  return changed;
}
function checkAndUpdateElementDynamic(view, def, values) {
  var changed = false;
  for (var i = 0; i < values.length; i++) {
    if (checkAndUpdateElementValue(view, def, i, values[i])) changed = true;
  }
  return changed;
}
function checkAndUpdateElementValue(view, def, bindingIdx, value) {
  if (!checkAndUpdateBinding(view, def, bindingIdx, value)) {
    return false;
  }
  var binding = def.bindings[bindingIdx];
  var elData = asElementData(view, def.nodeIndex);
  var renderNode = elData.renderElement;
  var name = binding.name;
  switch (binding.flags & 15) {
    case 1:
      setElementAttribute(view, binding, renderNode, binding.ns, name, value);
      break;
    case 2:
      setElementClass(view, renderNode, name, value);
      break;
    case 4:
      setElementStyle(view, binding, renderNode, name, value);
      break;
    case 8:
      var bindView = def.flags & 33554432 && binding.flags & 32 ? elData.componentView : view;
      setElementProperty(bindView, binding, renderNode, name, value);
      break;
  }
  return true;
}
function setElementAttribute(view, binding, renderNode, ns, name, value) {
  var securityContext = binding.securityContext;
  var renderValue = securityContext ? view.root.sanitizer.sanitize(securityContext, value) : value;
  renderValue = renderValue != null ? renderValue.toString() : null;
  var renderer = view.renderer;
  if (value != null) {
    renderer.setAttribute(renderNode, name, renderValue, ns);
  } else {
    renderer.removeAttribute(renderNode, name, ns);
  }
}
function setElementClass(view, renderNode, name, value) {
  var renderer = view.renderer;
  if (value) {
    renderer.addClass(renderNode, name);
  } else {
    renderer.removeClass(renderNode, name);
  }
}
function setElementStyle(view, binding, renderNode, name, value) {
  var renderValue = view.root.sanitizer.sanitize(SecurityContext.STYLE, value);
  if (renderValue != null) {
    renderValue = renderValue.toString();
    var unit = binding.suffix;
    if (unit != null) {
      renderValue = renderValue + unit;
    }
  } else {
    renderValue = null;
  }
  var renderer = view.renderer;
  if (renderValue != null) {
    renderer.setStyle(renderNode, name, renderValue);
  } else {
    renderer.removeStyle(renderNode, name);
  }
}
function setElementProperty(view, binding, renderNode, name, value) {
  var securityContext = binding.securityContext;
  var renderValue = securityContext ? view.root.sanitizer.sanitize(securityContext, value) : value;
  view.renderer.setProperty(renderNode, name, renderValue);
}
function queryDef(flags, id, bindings) {
  var bindingDefs = [];
  for (var propName in bindings) {
    var bindingType = bindings[propName];
    bindingDefs.push({
      propName: propName,
      bindingType: bindingType
    });
  }
  return {
    nodeIndex: -1,
    parent: null,
    renderParent: null,
    bindingIndex: -1,
    outputIndex: -1,
    checkIndex: -1,
    flags: flags,
    childFlags: 0,
    directChildFlags: 0,
    childMatchedQueries: 0,
    ngContentIndex: -1,
    matchedQueries: {},
    matchedQueryIds: 0,
    references: {},
    childCount: 0,
    bindings: [],
    bindingFlags: 0,
    outputs: [],
    element: null,
    provider: null,
    text: null,
    query: {
      id: id,
      filterId: filterQueryId(id),
      bindings: bindingDefs
    },
    ngContent: null
  };
}
exports.ɵqud = queryDef;
function createQuery() {
  return new QueryList();
}
function dirtyParentQueries(view) {
  var queryIds = view.def.nodeMatchedQueries;
  while (view.parent && isEmbeddedView(view)) {
    var tplDef = view.parentNodeDef;
    view = view.parent;
    var end = tplDef.nodeIndex + tplDef.childCount;
    for (var i = 0; i <= end; i++) {
      var nodeDef = view.def.nodes[i];
      if (nodeDef.flags & 67108864 && nodeDef.flags & 536870912 && (nodeDef.query.filterId & queryIds) === nodeDef.query.filterId) {
        asQueryList(view, i).setDirty();
      }
      if (nodeDef.flags & 1 && i + nodeDef.childCount < tplDef.nodeIndex || !(nodeDef.childFlags & 67108864) || !(nodeDef.childFlags & 536870912)) {
        i += nodeDef.childCount;
      }
    }
  }
  if (view.def.nodeFlags & 134217728) {
    for (var i = 0; i < view.def.nodes.length; i++) {
      var nodeDef = view.def.nodes[i];
      if (nodeDef.flags & 134217728 && nodeDef.flags & 536870912) {
        asQueryList(view, i).setDirty();
      }
      i += nodeDef.childCount;
    }
  }
}
function checkAndUpdateQuery(view, nodeDef) {
  var queryList = asQueryList(view, nodeDef.nodeIndex);
  if (!queryList.dirty) {
    return;
  }
  var directiveInstance;
  var newValues = undefined;
  if (nodeDef.flags & 67108864) {
    var elementDef = nodeDef.parent.parent;
    exports.ɵeld = elementDef;
    newValues = calcQueryValues(view, elementDef.nodeIndex, elementDef.nodeIndex + elementDef.childCount, nodeDef.query, []);
    directiveInstance = asProviderData(view, nodeDef.parent.nodeIndex).instance;
  } else if (nodeDef.flags & 134217728) {
    newValues = calcQueryValues(view, 0, view.def.nodes.length - 1, nodeDef.query, []);
    directiveInstance = view.component;
  }
  queryList.reset(newValues);
  var bindings = nodeDef.query.bindings;
  var notify = false;
  for (var i = 0; i < bindings.length; i++) {
    var binding = bindings[i];
    var boundValue = void 0;
    switch (binding.bindingType) {
      case 0:
        boundValue = queryList.first;
        break;
      case 1:
        boundValue = queryList;
        notify = true;
        break;
    }
    directiveInstance[binding.propName] = boundValue;
  }
  if (notify) {
    queryList.notifyOnChanges();
  }
}
function calcQueryValues(view, startIndex, endIndex, queryDef, values) {
  for (var i = startIndex; i <= endIndex; i++) {
    var nodeDef = view.def.nodes[i];
    var valueType = nodeDef.matchedQueries[queryDef.id];
    if (valueType != null) {
      values.push(getQueryValue(view, nodeDef, valueType));
    }
    if (nodeDef.flags & 1 && nodeDef.element.template && (nodeDef.element.template.nodeMatchedQueries & queryDef.filterId) === queryDef.filterId) {
      var elementData = asElementData(view, i);
      if ((nodeDef.childMatchedQueries & queryDef.filterId) === queryDef.filterId) {
        calcQueryValues(view, i + 1, i + nodeDef.childCount, queryDef, values);
        i += nodeDef.childCount;
      }
      if (nodeDef.flags & 16777216) {
        var embeddedViews = elementData.viewContainer._embeddedViews;
        for (var k = 0; k < embeddedViews.length; k++) {
          var embeddedView = embeddedViews[k];
          var dvc = declaredViewContainer(embeddedView);
          if (dvc && dvc === elementData) {
            calcQueryValues(embeddedView, 0, embeddedView.def.nodes.length - 1, queryDef, values);
          }
        }
      }
      var projectedViews = elementData.template._projectedViews;
      if (projectedViews) {
        for (var k = 0; k < projectedViews.length; k++) {
          var projectedView = projectedViews[k];
          calcQueryValues(projectedView, 0, projectedView.def.nodes.length - 1, queryDef, values);
        }
      }
    }
    if ((nodeDef.childMatchedQueries & queryDef.filterId) !== queryDef.filterId) {
      i += nodeDef.childCount;
    }
  }
  return values;
}
function getQueryValue(view, nodeDef, queryValueType) {
  if (queryValueType != null) {
    switch (queryValueType) {
      case 1:
        return asElementData(view, nodeDef.nodeIndex).renderElement;
      case 0:
        return new ElementRef(asElementData(view, nodeDef.nodeIndex).renderElement);
      case 2:
        return asElementData(view, nodeDef.nodeIndex).template;
      case 3:
        return asElementData(view, nodeDef.nodeIndex).viewContainer;
      case 4:
        return asProviderData(view, nodeDef.nodeIndex).instance;
    }
  }
}
function ngContentDef(ngContentIndex, index) {
  return {
    nodeIndex: -1,
    parent: null,
    renderParent: null,
    bindingIndex: -1,
    outputIndex: -1,
    checkIndex: -1,
    flags: 8,
    childFlags: 0,
    directChildFlags: 0,
    childMatchedQueries: 0,
    matchedQueries: {},
    matchedQueryIds: 0,
    references: {},
    ngContentIndex: ngContentIndex,
    childCount: 0,
    bindings: [],
    bindingFlags: 0,
    outputs: [],
    element: null,
    provider: null,
    text: null,
    query: null,
    ngContent: {
      index: index
    }
  };
}
exports.ɵncd = ngContentDef;
function appendNgContent(view, renderHost, def) {
  var parentEl = getParentRenderElement(view, renderHost, def);
  if (!parentEl) {
    return;
  }
  var ngContentIndex = def.ngContent.index;
  visitProjectedRenderNodes(view, ngContentIndex, 1, parentEl, null, undefined);
}
function purePipeDef(checkIndex, argCount) {
  return _pureExpressionDef(128, checkIndex, new Array(argCount + 1));
}
exports.ɵppd = purePipeDef;
function pureArrayDef(checkIndex, argCount) {
  return _pureExpressionDef(32, checkIndex, new Array(argCount));
}
exports.ɵpad = pureArrayDef;
function pureObjectDef(checkIndex, propToIndex) {
  var keys = Object.keys(propToIndex);
  var nbKeys = keys.length;
  var propertyNames = new Array(nbKeys);
  for (var i = 0; i < nbKeys; i++) {
    var key = keys[i];
    var index = propToIndex[key];
    propertyNames[index] = key;
  }
  return _pureExpressionDef(64, checkIndex, propertyNames);
}
exports.ɵpod = pureObjectDef;
function _pureExpressionDef(flags, checkIndex, propertyNames) {
  var bindings = new Array(propertyNames.length);
  for (var i = 0; i < propertyNames.length; i++) {
    var prop = propertyNames[i];
    bindings[i] = {
      flags: 8,
      name: prop,
      ns: null,
      nonMinifiedName: prop,
      securityContext: null,
      suffix: null
    };
  }
  return {
    nodeIndex: -1,
    parent: null,
    renderParent: null,
    bindingIndex: -1,
    outputIndex: -1,
    checkIndex: checkIndex,
    flags: flags,
    childFlags: 0,
    directChildFlags: 0,
    childMatchedQueries: 0,
    matchedQueries: {},
    matchedQueryIds: 0,
    references: {},
    ngContentIndex: -1,
    childCount: 0,
    bindings: bindings,
    bindingFlags: calcBindingFlags(bindings),
    outputs: [],
    element: null,
    provider: null,
    text: null,
    query: null,
    ngContent: null
  };
}
function createPureExpression(view, def) {
  return {
    value: undefined
  };
}
function checkAndUpdatePureExpressionInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
  var bindings = def.bindings;
  var changed = false;
  var bindLen = bindings.length;
  if (bindLen > 0 && checkAndUpdateBinding(view, def, 0, v0)) changed = true;
  if (bindLen > 1 && checkAndUpdateBinding(view, def, 1, v1)) changed = true;
  if (bindLen > 2 && checkAndUpdateBinding(view, def, 2, v2)) changed = true;
  if (bindLen > 3 && checkAndUpdateBinding(view, def, 3, v3)) changed = true;
  if (bindLen > 4 && checkAndUpdateBinding(view, def, 4, v4)) changed = true;
  if (bindLen > 5 && checkAndUpdateBinding(view, def, 5, v5)) changed = true;
  if (bindLen > 6 && checkAndUpdateBinding(view, def, 6, v6)) changed = true;
  if (bindLen > 7 && checkAndUpdateBinding(view, def, 7, v7)) changed = true;
  if (bindLen > 8 && checkAndUpdateBinding(view, def, 8, v8)) changed = true;
  if (bindLen > 9 && checkAndUpdateBinding(view, def, 9, v9)) changed = true;
  if (changed) {
    var data = asPureExpressionData(view, def.nodeIndex);
    var value = void 0;
    switch (def.flags & 201347067) {
      case 32:
        value = new Array(bindings.length);
        if (bindLen > 0) value[0] = v0;
        if (bindLen > 1) value[1] = v1;
        if (bindLen > 2) value[2] = v2;
        if (bindLen > 3) value[3] = v3;
        if (bindLen > 4) value[4] = v4;
        if (bindLen > 5) value[5] = v5;
        if (bindLen > 6) value[6] = v6;
        if (bindLen > 7) value[7] = v7;
        if (bindLen > 8) value[8] = v8;
        if (bindLen > 9) value[9] = v9;
        break;
      case 64:
        value = {};
        if (bindLen > 0) value[bindings[0].name] = v0;
        if (bindLen > 1) value[bindings[1].name] = v1;
        if (bindLen > 2) value[bindings[2].name] = v2;
        if (bindLen > 3) value[bindings[3].name] = v3;
        if (bindLen > 4) value[bindings[4].name] = v4;
        if (bindLen > 5) value[bindings[5].name] = v5;
        if (bindLen > 6) value[bindings[6].name] = v6;
        if (bindLen > 7) value[bindings[7].name] = v7;
        if (bindLen > 8) value[bindings[8].name] = v8;
        if (bindLen > 9) value[bindings[9].name] = v9;
        break;
      case 128:
        var pipe = v0;
        switch (bindLen) {
          case 1:
            value = pipe.transform(v0);
            break;
          case 2:
            value = pipe.transform(v1);
            break;
          case 3:
            value = pipe.transform(v1, v2);
            break;
          case 4:
            value = pipe.transform(v1, v2, v3);
            break;
          case 5:
            value = pipe.transform(v1, v2, v3, v4);
            break;
          case 6:
            value = pipe.transform(v1, v2, v3, v4, v5);
            break;
          case 7:
            value = pipe.transform(v1, v2, v3, v4, v5, v6);
            break;
          case 8:
            value = pipe.transform(v1, v2, v3, v4, v5, v6, v7);
            break;
          case 9:
            value = pipe.transform(v1, v2, v3, v4, v5, v6, v7, v8);
            break;
          case 10:
            value = pipe.transform(v1, v2, v3, v4, v5, v6, v7, v8, v9);
            break;
        }
        break;
    }
    data.value = value;
  }
  return changed;
}
function checkAndUpdatePureExpressionDynamic(view, def, values) {
  var bindings = def.bindings;
  var changed = false;
  for (var i = 0; i < values.length; i++) {
    if (checkAndUpdateBinding(view, def, i, values[i])) {
      changed = true;
    }
  }
  if (changed) {
    var data = asPureExpressionData(view, def.nodeIndex);
    var value = void 0;
    switch (def.flags & 201347067) {
      case 32:
        value = values;
        break;
      case 64:
        value = {};
        for (var i = 0; i < values.length; i++) {
          value[bindings[i].name] = values[i];
        }
        break;
      case 128:
        var pipe = values[0];
        var params = values.slice(1);
        value = pipe.transform.apply(pipe, tslib_1.__spread(params));
        break;
    }
    data.value = value;
  }
  return changed;
}
function textDef(checkIndex, ngContentIndex, staticText) {
  var bindings = new Array(staticText.length - 1);
  for (var i = 1; i < staticText.length; i++) {
    bindings[i - 1] = {
      flags: 8,
      name: null,
      ns: null,
      nonMinifiedName: null,
      securityContext: null,
      suffix: staticText[i]
    };
  }
  return {
    nodeIndex: -1,
    parent: null,
    renderParent: null,
    bindingIndex: -1,
    outputIndex: -1,
    checkIndex: checkIndex,
    flags: 2,
    childFlags: 0,
    directChildFlags: 0,
    childMatchedQueries: 0,
    matchedQueries: {},
    matchedQueryIds: 0,
    references: {},
    ngContentIndex: ngContentIndex,
    childCount: 0,
    bindings: bindings,
    bindingFlags: 8,
    outputs: [],
    element: null,
    provider: null,
    text: {
      prefix: staticText[0]
    },
    query: null,
    ngContent: null
  };
}
exports.ɵted = textDef;
function createText(view, renderHost, def) {
  var renderNode;
  var renderer = view.renderer;
  renderNode = renderer.createText(def.text.prefix);
  var parentEl = getParentRenderElement(view, renderHost, def);
  if (parentEl) {
    renderer.appendChild(parentEl, renderNode);
  }
  return {
    renderText: renderNode
  };
}
function checkAndUpdateTextInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
  var changed = false;
  var bindings = def.bindings;
  var bindLen = bindings.length;
  if (bindLen > 0 && checkAndUpdateBinding(view, def, 0, v0)) changed = true;
  if (bindLen > 1 && checkAndUpdateBinding(view, def, 1, v1)) changed = true;
  if (bindLen > 2 && checkAndUpdateBinding(view, def, 2, v2)) changed = true;
  if (bindLen > 3 && checkAndUpdateBinding(view, def, 3, v3)) changed = true;
  if (bindLen > 4 && checkAndUpdateBinding(view, def, 4, v4)) changed = true;
  if (bindLen > 5 && checkAndUpdateBinding(view, def, 5, v5)) changed = true;
  if (bindLen > 6 && checkAndUpdateBinding(view, def, 6, v6)) changed = true;
  if (bindLen > 7 && checkAndUpdateBinding(view, def, 7, v7)) changed = true;
  if (bindLen > 8 && checkAndUpdateBinding(view, def, 8, v8)) changed = true;
  if (bindLen > 9 && checkAndUpdateBinding(view, def, 9, v9)) changed = true;
  if (changed) {
    var value = def.text.prefix;
    if (bindLen > 0) value += _addInterpolationPart(v0, bindings[0]);
    if (bindLen > 1) value += _addInterpolationPart(v1, bindings[1]);
    if (bindLen > 2) value += _addInterpolationPart(v2, bindings[2]);
    if (bindLen > 3) value += _addInterpolationPart(v3, bindings[3]);
    if (bindLen > 4) value += _addInterpolationPart(v4, bindings[4]);
    if (bindLen > 5) value += _addInterpolationPart(v5, bindings[5]);
    if (bindLen > 6) value += _addInterpolationPart(v6, bindings[6]);
    if (bindLen > 7) value += _addInterpolationPart(v7, bindings[7]);
    if (bindLen > 8) value += _addInterpolationPart(v8, bindings[8]);
    if (bindLen > 9) value += _addInterpolationPart(v9, bindings[9]);
    var renderNode = asTextData(view, def.nodeIndex).renderText;
    view.renderer.setValue(renderNode, value);
  }
  return changed;
}
function checkAndUpdateTextDynamic(view, def, values) {
  var bindings = def.bindings;
  var changed = false;
  for (var i = 0; i < values.length; i++) {
    if (checkAndUpdateBinding(view, def, i, values[i])) {
      changed = true;
    }
  }
  if (changed) {
    var value = "";
    for (var i = 0; i < values.length; i++) {
      value = value + _addInterpolationPart(values[i], bindings[i]);
    }
    value = def.text.prefix + value;
    var renderNode = asTextData(view, def.nodeIndex).renderText;
    view.renderer.setValue(renderNode, value);
  }
  return changed;
}
function _addInterpolationPart(value, binding) {
  var valueStr = value != null ? value.toString() : "";
  return valueStr + binding.suffix;
}
function viewDef(flags, nodes, updateDirectives, updateRenderer) {
  var viewBindingCount = 0;
  var viewDisposableCount = 0;
  var viewNodeFlags = 0;
  var viewRootNodeFlags = 0;
  var viewMatchedQueries = 0;
  var currentParent = null;
  var currentRenderParent = null;
  var currentElementHasPublicProviders = false;
  var currentElementHasPrivateProviders = false;
  var lastRenderRootNode = null;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.nodeIndex = i;
    node.parent = currentParent;
    node.bindingIndex = viewBindingCount;
    node.outputIndex = viewDisposableCount;
    node.renderParent = currentRenderParent;
    viewNodeFlags |= node.flags;
    viewMatchedQueries |= node.matchedQueryIds;
    if (node.element) {
      var elDef = node.element;
      elDef.publicProviders = currentParent ? currentParent.element.publicProviders : Object.create(null);
      elDef.allProviders = elDef.publicProviders;
      currentElementHasPublicProviders = false;
      currentElementHasPrivateProviders = false;
      if (node.element.template) {
        viewMatchedQueries |= node.element.template.nodeMatchedQueries;
      }
    }
    validateNode(currentParent, node, nodes.length);
    viewBindingCount += node.bindings.length;
    viewDisposableCount += node.outputs.length;
    if (!currentRenderParent && node.flags & 3) {
      lastRenderRootNode = node;
    }
    if (node.flags & 20224) {
      if (!currentElementHasPublicProviders) {
        currentElementHasPublicProviders = true;
        currentParent.element.publicProviders = Object.create(currentParent.element.publicProviders);
        currentParent.element.allProviders = currentParent.element.publicProviders;
      }
      var isPrivateService = (node.flags & 8192) !== 0;
      var isComponent = (node.flags & 32768) !== 0;
      if (!isPrivateService || isComponent) {
        currentParent.element.publicProviders[tokenKey(node.provider.token)] = node;
      } else {
        if (!currentElementHasPrivateProviders) {
          currentElementHasPrivateProviders = true;
          currentParent.element.allProviders = Object.create(currentParent.element.publicProviders);
        }
        currentParent.element.allProviders[tokenKey(node.provider.token)] = node;
      }
      if (isComponent) {
        currentParent.element.componentProvider = node;
      }
    }
    if (currentParent) {
      currentParent.childFlags |= node.flags;
      currentParent.directChildFlags |= node.flags;
      currentParent.childMatchedQueries |= node.matchedQueryIds;
      if (node.element && node.element.template) {
        currentParent.childMatchedQueries |= node.element.template.nodeMatchedQueries;
      }
    } else {
      viewRootNodeFlags |= node.flags;
    }
    if (node.childCount > 0) {
      currentParent = node;
      if (!isNgContainer(node)) {
        currentRenderParent = node;
      }
    } else {
      while (currentParent && i === currentParent.nodeIndex + currentParent.childCount) {
        var newParent = currentParent.parent;
        if (newParent) {
          newParent.childFlags |= currentParent.childFlags;
          newParent.childMatchedQueries |= currentParent.childMatchedQueries;
        }
        currentParent = newParent;
        if (currentParent && isNgContainer(currentParent)) {
          currentRenderParent = currentParent.renderParent;
        } else {
          currentRenderParent = currentParent;
        }
      }
    }
  }
  var handleEvent = function (view, nodeIndex, eventName, event) {
    return nodes[nodeIndex].element.handleEvent(view, eventName, event);
  };
  return {
    factory: null,
    nodeFlags: viewNodeFlags,
    rootNodeFlags: viewRootNodeFlags,
    nodeMatchedQueries: viewMatchedQueries,
    flags: flags,
    nodes: nodes,
    updateDirectives: updateDirectives || NOOP,
    updateRenderer: updateRenderer || NOOP,
    handleEvent: handleEvent,
    bindingCount: viewBindingCount,
    outputCount: viewDisposableCount,
    lastRenderRootNode: lastRenderRootNode
  };
}
exports.ɵvid = viewDef;
function isNgContainer(node) {
  return (node.flags & 1) !== 0 && node.element.name === null;
}
function validateNode(parent, node, nodeCount) {
  var template = node.element && node.element.template;
  if (template) {
    if (!template.lastRenderRootNode) {
      throw new Error("Illegal State: Embedded templates without nodes are not allowed!");
    }
    if (template.lastRenderRootNode && template.lastRenderRootNode.flags & 16777216) {
      throw new Error("Illegal State: Last root node of a template can't have embedded views, at index " + node.nodeIndex + "!");
    }
  }
  if (node.flags & 20224) {
    var parentFlags = parent ? parent.flags : 0;
    if ((parentFlags & 1) === 0) {
      throw new Error("Illegal State: StaticProvider/Directive nodes need to be children of elements or anchors, at index " + node.nodeIndex + "!");
    }
  }
  if (node.query) {
    if (node.flags & 67108864 && (!parent || (parent.flags & 16384) === 0)) {
      throw new Error("Illegal State: Content Query nodes need to be children of directives, at index " + node.nodeIndex + "!");
    }
    if (node.flags & 134217728 && parent) {
      throw new Error("Illegal State: View Query nodes have to be top level nodes, at index " + node.nodeIndex + "!");
    }
  }
  if (node.childCount) {
    var parentEnd = parent ? parent.nodeIndex + parent.childCount : nodeCount - 1;
    if (node.nodeIndex <= parentEnd && node.nodeIndex + node.childCount > parentEnd) {
      throw new Error("Illegal State: childCount of node leads outside of parent, at index " + node.nodeIndex + "!");
    }
  }
}
function createEmbeddedView(parent, anchorDef, viewDef, context) {
  var view = createView(parent.root, parent.renderer, parent, anchorDef, viewDef);
  initView(view, parent.component, context);
  createViewNodes(view);
  return view;
}
function createRootView(root, def, context) {
  var view = createView(root, root.renderer, null, null, def);
  initView(view, context, context);
  createViewNodes(view);
  return view;
}
function createComponentView(parentView, nodeDef, viewDef, hostElement) {
  var rendererType = nodeDef.element.componentRendererType;
  var compRenderer;
  if (!rendererType) {
    compRenderer = parentView.root.renderer;
  } else {
    compRenderer = parentView.root.rendererFactory.createRenderer(hostElement, rendererType);
  }
  return createView(parentView.root, compRenderer, parentView, nodeDef.element.componentProvider, viewDef);
}
function createView(root, renderer, parent, parentNodeDef, def) {
  var nodes = new Array(def.nodes.length);
  var disposables = def.outputCount ? new Array(def.outputCount) : null;
  var view = {
    def: def,
    parent: parent,
    viewContainerParent: null,
    parentNodeDef: parentNodeDef,
    context: null,
    component: null,
    nodes: nodes,
    state: 13,
    root: root,
    renderer: renderer,
    oldValues: new Array(def.bindingCount),
    disposables: disposables,
    initIndex: -1
  };
  return view;
}
function initView(view, component, context) {
  view.component = component;
  view.context = context;
}
function createViewNodes(view) {
  var renderHost;
  if (isComponentView(view)) {
    var hostDef = view.parentNodeDef;
    renderHost = asElementData(view.parent, hostDef.parent.nodeIndex).renderElement;
  }
  var def = view.def;
  var nodes = view.nodes;
  for (var i = 0; i < def.nodes.length; i++) {
    var nodeDef = def.nodes[i];
    Services.setCurrentNode(view, i);
    var nodeData = void 0;
    switch (nodeDef.flags & 201347067) {
      case 1:
        var el = createElement(view, renderHost, nodeDef);
        var componentView = undefined;
        if (nodeDef.flags & 33554432) {
          var compViewDef = resolveDefinition(nodeDef.element.componentView);
          componentView = Services.createComponentView(view, nodeDef, compViewDef, el);
        }
        listenToElementOutputs(view, componentView, nodeDef, el);
        nodeData = {
          renderElement: el,
          componentView: componentView,
          viewContainer: null,
          template: nodeDef.element.template ? createTemplateData(view, nodeDef) : undefined
        };
        if (nodeDef.flags & 16777216) {
          nodeData.viewContainer = createViewContainerData(view, nodeDef, nodeData);
        }
        break;
      case 2:
        nodeData = createText(view, renderHost, nodeDef);
        break;
      case 512:
      case 1024:
      case 2048:
      case 256:
        {
          nodeData = nodes[i];
          if (!nodeData && !(nodeDef.flags & 4096)) {
            var instance = createProviderInstance(view, nodeDef);
            nodeData = {
              instance: instance
            };
          }
          break;
        }
      case 16:
        {
          var instance = createPipeInstance(view, nodeDef);
          nodeData = {
            instance: instance
          };
          break;
        }
      case 16384:
        {
          nodeData = nodes[i];
          if (!nodeData) {
            var instance = createDirectiveInstance(view, nodeDef);
            nodeData = {
              instance: instance
            };
          }
          if (nodeDef.flags & 32768) {
            var compView = asElementData(view, nodeDef.parent.nodeIndex).componentView;
            initView(compView, nodeData.instance, nodeData.instance);
          }
          break;
        }
      case 32:
      case 64:
      case 128:
        nodeData = createPureExpression(view, nodeDef);
        break;
      case 67108864:
      case 134217728:
        nodeData = createQuery();
        break;
      case 8:
        appendNgContent(view, renderHost, nodeDef);
        nodeData = undefined;
        break;
    }
    nodes[i] = nodeData;
  }
  execComponentViewsAction(view, ViewAction.CreateViewNodes);
  execQueriesAction(view, 67108864 | 134217728, 268435456, 0);
}
function checkNoChangesView(view) {
  markProjectedViewsForCheck(view);
  Services.updateDirectives(view, 1);
  execEmbeddedViewsAction(view, ViewAction.CheckNoChanges);
  Services.updateRenderer(view, 1);
  execComponentViewsAction(view, ViewAction.CheckNoChanges);
  view.state &= ~(64 | 32);
}
function checkAndUpdateView(view) {
  if (view.state & 1) {
    view.state &= ~1;
    view.state |= 2;
  } else {
    view.state &= ~2;
  }
  shiftInitState(view, 0, 256);
  markProjectedViewsForCheck(view);
  Services.updateDirectives(view, 0);
  execEmbeddedViewsAction(view, ViewAction.CheckAndUpdate);
  execQueriesAction(view, 67108864, 536870912, 0);
  var callInit = shiftInitState(view, 256, 512);
  callLifecycleHooksChildrenFirst(view, 2097152 | (callInit ? 1048576 : 0));
  Services.updateRenderer(view, 0);
  execComponentViewsAction(view, ViewAction.CheckAndUpdate);
  execQueriesAction(view, 134217728, 536870912, 0);
  callInit = shiftInitState(view, 512, 768);
  callLifecycleHooksChildrenFirst(view, 8388608 | (callInit ? 4194304 : 0));
  if (view.def.flags & 2) {
    view.state &= ~8;
  }
  view.state &= ~(64 | 32);
  shiftInitState(view, 768, 1024);
}
function checkAndUpdateNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
  if (argStyle === 0) {
    return checkAndUpdateNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
  } else {
    return checkAndUpdateNodeDynamic(view, nodeDef, v0);
  }
}
function markProjectedViewsForCheck(view) {
  var def = view.def;
  if (!(def.nodeFlags & 4)) {
    return;
  }
  for (var i = 0; i < def.nodes.length; i++) {
    var nodeDef = def.nodes[i];
    if (nodeDef.flags & 4) {
      var projectedViews = asElementData(view, i).template._projectedViews;
      if (projectedViews) {
        for (var i_1 = 0; i_1 < projectedViews.length; i_1++) {
          var projectedView = projectedViews[i_1];
          projectedView.state |= 32;
          markParentViewsForCheckProjectedViews(projectedView, view);
        }
      }
    } else if ((nodeDef.childFlags & 4) === 0) {
      i += nodeDef.childCount;
    }
  }
}
function checkAndUpdateNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
  switch (nodeDef.flags & 201347067) {
    case 1:
      return checkAndUpdateElementInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
    case 2:
      return checkAndUpdateTextInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
    case 16384:
      return checkAndUpdateDirectiveInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
    case 32:
    case 64:
    case 128:
      return checkAndUpdatePureExpressionInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
    default:
      throw "unreachable";
  }
}
function checkAndUpdateNodeDynamic(view, nodeDef, values) {
  switch (nodeDef.flags & 201347067) {
    case 1:
      return checkAndUpdateElementDynamic(view, nodeDef, values);
    case 2:
      return checkAndUpdateTextDynamic(view, nodeDef, values);
    case 16384:
      return checkAndUpdateDirectiveDynamic(view, nodeDef, values);
    case 32:
    case 64:
    case 128:
      return checkAndUpdatePureExpressionDynamic(view, nodeDef, values);
    default:
      throw "unreachable";
  }
}
function checkNoChangesNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
  if (argStyle === 0) {
    checkNoChangesNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
  } else {
    checkNoChangesNodeDynamic(view, nodeDef, v0);
  }
  return false;
}
function checkNoChangesNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
  var bindLen = nodeDef.bindings.length;
  if (bindLen > 0) checkBindingNoChanges(view, nodeDef, 0, v0);
  if (bindLen > 1) checkBindingNoChanges(view, nodeDef, 1, v1);
  if (bindLen > 2) checkBindingNoChanges(view, nodeDef, 2, v2);
  if (bindLen > 3) checkBindingNoChanges(view, nodeDef, 3, v3);
  if (bindLen > 4) checkBindingNoChanges(view, nodeDef, 4, v4);
  if (bindLen > 5) checkBindingNoChanges(view, nodeDef, 5, v5);
  if (bindLen > 6) checkBindingNoChanges(view, nodeDef, 6, v6);
  if (bindLen > 7) checkBindingNoChanges(view, nodeDef, 7, v7);
  if (bindLen > 8) checkBindingNoChanges(view, nodeDef, 8, v8);
  if (bindLen > 9) checkBindingNoChanges(view, nodeDef, 9, v9);
}
function checkNoChangesNodeDynamic(view, nodeDef, values) {
  for (var i = 0; i < values.length; i++) {
    checkBindingNoChanges(view, nodeDef, i, values[i]);
  }
}
function checkNoChangesQuery(view, nodeDef) {
  var queryList = asQueryList(view, nodeDef.nodeIndex);
  if (queryList.dirty) {
    throw expressionChangedAfterItHasBeenCheckedError(Services.createDebugContext(view, nodeDef.nodeIndex), "Query " + nodeDef.query.id + " not dirty", "Query " + nodeDef.query.id + " dirty", (view.state & 1) !== 0);
  }
}
function destroyView(view) {
  if (view.state & 128) {
    return;
  }
  execEmbeddedViewsAction(view, ViewAction.Destroy);
  execComponentViewsAction(view, ViewAction.Destroy);
  callLifecycleHooksChildrenFirst(view, 131072);
  if (view.disposables) {
    for (var i = 0; i < view.disposables.length; i++) {
      view.disposables[i]();
    }
  }
  detachProjectedView(view);
  if (view.renderer.destroyNode) {
    destroyViewNodes(view);
  }
  if (isComponentView(view)) {
    view.renderer.destroy();
  }
  view.state |= 128;
}
function destroyViewNodes(view) {
  var len = view.def.nodes.length;
  for (var i = 0; i < len; i++) {
    var def = view.def.nodes[i];
    if (def.flags & 1) {
      view.renderer.destroyNode(asElementData(view, i).renderElement);
    } else if (def.flags & 2) {
      view.renderer.destroyNode(asTextData(view, i).renderText);
    } else if (def.flags & 67108864 || def.flags & 134217728) {
      asQueryList(view, i).destroy();
    }
  }
}
var ViewAction;
(function (ViewAction) {
  ViewAction[ViewAction["CreateViewNodes"] = 0] = "CreateViewNodes";
  ViewAction[ViewAction["CheckNoChanges"] = 1] = "CheckNoChanges";
  ViewAction[ViewAction["CheckNoChangesProjectedViews"] = 2] = "CheckNoChangesProjectedViews";
  ViewAction[ViewAction["CheckAndUpdate"] = 3] = "CheckAndUpdate";
  ViewAction[ViewAction["CheckAndUpdateProjectedViews"] = 4] = "CheckAndUpdateProjectedViews";
  ViewAction[ViewAction["Destroy"] = 5] = "Destroy";
})(ViewAction || (ViewAction = {}));
function execComponentViewsAction(view, action) {
  var def = view.def;
  if (!(def.nodeFlags & 33554432)) {
    return;
  }
  for (var i = 0; i < def.nodes.length; i++) {
    var nodeDef = def.nodes[i];
    if (nodeDef.flags & 33554432) {
      callViewAction(asElementData(view, i).componentView, action);
    } else if ((nodeDef.childFlags & 33554432) === 0) {
      i += nodeDef.childCount;
    }
  }
}
function execEmbeddedViewsAction(view, action) {
  var def = view.def;
  if (!(def.nodeFlags & 16777216)) {
    return;
  }
  for (var i = 0; i < def.nodes.length; i++) {
    var nodeDef = def.nodes[i];
    if (nodeDef.flags & 16777216) {
      var embeddedViews = asElementData(view, i).viewContainer._embeddedViews;
      for (var k = 0; k < embeddedViews.length; k++) {
        callViewAction(embeddedViews[k], action);
      }
    } else if ((nodeDef.childFlags & 16777216) === 0) {
      i += nodeDef.childCount;
    }
  }
}
function callViewAction(view, action) {
  var viewState = view.state;
  switch (action) {
    case ViewAction.CheckNoChanges:
      if ((viewState & 128) === 0) {
        if ((viewState & 12) === 12) {
          checkNoChangesView(view);
        } else if (viewState & 64) {
          execProjectedViewsAction(view, ViewAction.CheckNoChangesProjectedViews);
        }
      }
      break;
    case ViewAction.CheckNoChangesProjectedViews:
      if ((viewState & 128) === 0) {
        if (viewState & 32) {
          checkNoChangesView(view);
        } else if (viewState & 64) {
          execProjectedViewsAction(view, action);
        }
      }
      break;
    case ViewAction.CheckAndUpdate:
      if ((viewState & 128) === 0) {
        if ((viewState & 12) === 12) {
          checkAndUpdateView(view);
        } else if (viewState & 64) {
          execProjectedViewsAction(view, ViewAction.CheckAndUpdateProjectedViews);
        }
      }
      break;
    case ViewAction.CheckAndUpdateProjectedViews:
      if ((viewState & 128) === 0) {
        if (viewState & 32) {
          checkAndUpdateView(view);
        } else if (viewState & 64) {
          execProjectedViewsAction(view, action);
        }
      }
      break;
    case ViewAction.Destroy:
      destroyView(view);
      break;
    case ViewAction.CreateViewNodes:
      createViewNodes(view);
      break;
  }
}
function execProjectedViewsAction(view, action) {
  execEmbeddedViewsAction(view, action);
  execComponentViewsAction(view, action);
}
function execQueriesAction(view, queryFlags, staticDynamicQueryFlag, checkType) {
  if (!(view.def.nodeFlags & queryFlags) || !(view.def.nodeFlags & staticDynamicQueryFlag)) {
    return;
  }
  var nodeCount = view.def.nodes.length;
  for (var i = 0; i < nodeCount; i++) {
    var nodeDef = view.def.nodes[i];
    if (nodeDef.flags & queryFlags && nodeDef.flags & staticDynamicQueryFlag) {
      Services.setCurrentNode(view, nodeDef.nodeIndex);
      switch (checkType) {
        case 0:
          checkAndUpdateQuery(view, nodeDef);
          break;
        case 1:
          checkNoChangesQuery(view, nodeDef);
          break;
      }
    }
    if (!(nodeDef.childFlags & queryFlags) || !(nodeDef.childFlags & staticDynamicQueryFlag)) {
      i += nodeDef.childCount;
    }
  }
}
var initialized = false;
function initServicesIfNeeded() {
  if (initialized) {
    return;
  }
  initialized = true;
  var services = isDevMode() ? createDebugServices() : createProdServices();
  Services.setCurrentNode = services.setCurrentNode;
  Services.createRootView = services.createRootView;
  Services.createEmbeddedView = services.createEmbeddedView;
  Services.createComponentView = services.createComponentView;
  Services.createNgModuleRef = services.createNgModuleRef;
  Services.overrideProvider = services.overrideProvider;
  Services.overrideComponentView = services.overrideComponentView;
  Services.clearOverrides = services.clearOverrides;
  Services.checkAndUpdateView = services.checkAndUpdateView;
  Services.checkNoChangesView = services.checkNoChangesView;
  Services.destroyView = services.destroyView;
  Services.resolveDep = resolveDep;
  Services.createDebugContext = services.createDebugContext;
  Services.handleEvent = services.handleEvent;
  Services.updateDirectives = services.updateDirectives;
  Services.updateRenderer = services.updateRenderer;
  Services.dirtyParentQueries = dirtyParentQueries;
}
exports.ɵinitServicesIfNeeded = initServicesIfNeeded;
function createProdServices() {
  return {
    setCurrentNode: function () {},
    createRootView: createProdRootView,
    createEmbeddedView: createEmbeddedView,
    createComponentView: createComponentView,
    createNgModuleRef: createNgModuleRef,
    overrideProvider: NOOP,
    overrideComponentView: NOOP,
    clearOverrides: NOOP,
    checkAndUpdateView: checkAndUpdateView,
    checkNoChangesView: checkNoChangesView,
    destroyView: destroyView,
    createDebugContext: function (view, nodeIndex) {
      return new DebugContext_(view, nodeIndex);
    },
    handleEvent: function (view, nodeIndex, eventName, event) {
      return view.def.handleEvent(view, nodeIndex, eventName, event);
    },
    updateDirectives: function (view, checkType) {
      return view.def.updateDirectives(checkType === 0 ? prodCheckAndUpdateNode : prodCheckNoChangesNode, view);
    },
    updateRenderer: function (view, checkType) {
      return view.def.updateRenderer(checkType === 0 ? prodCheckAndUpdateNode : prodCheckNoChangesNode, view);
    }
  };
}
function createDebugServices() {
  return {
    setCurrentNode: debugSetCurrentNode,
    createRootView: debugCreateRootView,
    createEmbeddedView: debugCreateEmbeddedView,
    createComponentView: debugCreateComponentView,
    createNgModuleRef: debugCreateNgModuleRef,
    overrideProvider: debugOverrideProvider,
    overrideComponentView: debugOverrideComponentView,
    clearOverrides: debugClearOverrides,
    checkAndUpdateView: debugCheckAndUpdateView,
    checkNoChangesView: debugCheckNoChangesView,
    destroyView: debugDestroyView,
    createDebugContext: function (view, nodeIndex) {
      return new DebugContext_(view, nodeIndex);
    },
    handleEvent: debugHandleEvent,
    updateDirectives: debugUpdateDirectives,
    updateRenderer: debugUpdateRenderer
  };
}
function createProdRootView(elInjector, projectableNodes, rootSelectorOrNode, def, ngModule, context) {
  var rendererFactory = ngModule.injector.get(RendererFactory2);
  return createRootView(createRootData(elInjector, ngModule, rendererFactory, projectableNodes, rootSelectorOrNode), def, context);
}
function debugCreateRootView(elInjector, projectableNodes, rootSelectorOrNode, def, ngModule, context) {
  var rendererFactory = ngModule.injector.get(RendererFactory2);
  var root = createRootData(elInjector, ngModule, new DebugRendererFactory2(rendererFactory), projectableNodes, rootSelectorOrNode);
  var defWithOverride = applyProviderOverridesToView(def);
  return callWithDebugContext(DebugAction.create, createRootView, null, [root, defWithOverride, context]);
}
function createRootData(elInjector, ngModule, rendererFactory, projectableNodes, rootSelectorOrNode) {
  var sanitizer = ngModule.injector.get(Sanitizer);
  var errorHandler = ngModule.injector.get(ErrorHandler);
  var renderer = rendererFactory.createRenderer(null, null);
  return {
    ngModule: ngModule,
    injector: elInjector,
    projectableNodes: projectableNodes,
    selectorOrNode: rootSelectorOrNode,
    sanitizer: sanitizer,
    rendererFactory: rendererFactory,
    renderer: renderer,
    errorHandler: errorHandler
  };
}
function debugCreateEmbeddedView(parentView, anchorDef, viewDef, context) {
  var defWithOverride = applyProviderOverridesToView(viewDef);
  return callWithDebugContext(DebugAction.create, createEmbeddedView, null, [parentView, anchorDef, defWithOverride, context]);
}
function debugCreateComponentView(parentView, nodeDef, viewDef, hostElement) {
  var overrideComponentView = viewDefOverrides.get(nodeDef.element.componentProvider.provider.token);
  exports.ɵoverrideComponentView = overrideComponentView;
  if (overrideComponentView) {
    viewDef = overrideComponentView;
  } else {
    viewDef = applyProviderOverridesToView(viewDef);
  }
  return callWithDebugContext(DebugAction.create, createComponentView, null, [parentView, nodeDef, viewDef, hostElement]);
}
function debugCreateNgModuleRef(moduleType, parentInjector, bootstrapComponents, def) {
  var defWithOverride = applyProviderOverridesToNgModule(def);
  return createNgModuleRef(moduleType, parentInjector, bootstrapComponents, defWithOverride);
}
var providerOverrides = new Map();
var providerOverridesWithScope = new Map();
var viewDefOverrides = new Map();
function debugOverrideProvider(override) {
  providerOverrides.set(override.token, override);
  var injectableDef;
  if (typeof override.token === "function" && (injectableDef = getInjectableDef(override.token)) && typeof injectableDef.providedIn === "function") {
    providerOverridesWithScope.set(override.token, override);
  }
}
function debugOverrideComponentView(comp, compFactory) {
  var hostViewDef = resolveDefinition(getComponentViewDefinitionFactory(compFactory));
  var compViewDef = resolveDefinition(hostViewDef.nodes[0].element.componentView);
  viewDefOverrides.set(comp, compViewDef);
}
function debugClearOverrides() {
  providerOverrides.clear();
  providerOverridesWithScope.clear();
  viewDefOverrides.clear();
}
function applyProviderOverridesToView(def) {
  if (providerOverrides.size === 0) {
    return def;
  }
  var elementIndicesWithOverwrittenProviders = findElementIndicesWithOverwrittenProviders(def);
  if (elementIndicesWithOverwrittenProviders.length === 0) {
    return def;
  }
  def = def.factory(function () {
    return NOOP;
  });
  for (var i = 0; i < elementIndicesWithOverwrittenProviders.length; i++) {
    applyProviderOverridesToElement(def, elementIndicesWithOverwrittenProviders[i]);
  }
  return def;
  function findElementIndicesWithOverwrittenProviders(def) {
    var elIndicesWithOverwrittenProviders = [];
    var lastElementDef = null;
    for (var i = 0; i < def.nodes.length; i++) {
      var nodeDef = def.nodes[i];
      if (nodeDef.flags & 1) {
        lastElementDef = nodeDef;
      }
      if (lastElementDef && nodeDef.flags & 3840 && providerOverrides.has(nodeDef.provider.token)) {
        elIndicesWithOverwrittenProviders.push(lastElementDef.nodeIndex);
        lastElementDef = null;
      }
    }
    return elIndicesWithOverwrittenProviders;
  }
  function applyProviderOverridesToElement(viewDef, elIndex) {
    for (var i = elIndex + 1; i < viewDef.nodes.length; i++) {
      var nodeDef = viewDef.nodes[i];
      if (nodeDef.flags & 1) {
        return;
      }
      if (nodeDef.flags & 3840) {
        var provider = nodeDef.provider;
        var override = providerOverrides.get(provider.token);
        if (override) {
          nodeDef.flags = nodeDef.flags & ~3840 | override.flags;
          provider.deps = splitDepsDsl(override.deps);
          provider.value = override.value;
        }
      }
    }
  }
}
function applyProviderOverridesToNgModule(def) {
  var _a = calcHasOverrides(def), hasOverrides = _a.hasOverrides, hasDeprecatedOverrides = _a.hasDeprecatedOverrides;
  if (!hasOverrides) {
    return def;
  }
  def = def.factory(function () {
    return NOOP;
  });
  applyProviderOverrides(def);
  return def;
  function calcHasOverrides(def) {
    var hasOverrides = false;
    var hasDeprecatedOverrides = false;
    if (providerOverrides.size === 0) {
      return {
        hasOverrides: hasOverrides,
        hasDeprecatedOverrides: hasDeprecatedOverrides
      };
    }
    def.providers.forEach(function (node) {
      var override = providerOverrides.get(node.token);
      if (node.flags & 3840 && override) {
        hasOverrides = true;
        hasDeprecatedOverrides = hasDeprecatedOverrides || override.deprecatedBehavior;
      }
    });
    def.modules.forEach(function (module) {
      providerOverridesWithScope.forEach(function (override, token) {
        if (getInjectableDef(token).providedIn === module) {
          hasOverrides = true;
          hasDeprecatedOverrides = hasDeprecatedOverrides || override.deprecatedBehavior;
        }
      });
    });
    return {
      hasOverrides: hasOverrides,
      hasDeprecatedOverrides: hasDeprecatedOverrides
    };
  }
  function applyProviderOverrides(def) {
    for (var i = 0; i < def.providers.length; i++) {
      var provider = def.providers[i];
      if (hasDeprecatedOverrides) {
        provider.flags |= 4096;
      }
      var override = providerOverrides.get(provider.token);
      if (override) {
        provider.flags = provider.flags & ~3840 | override.flags;
        provider.deps = splitDepsDsl(override.deps);
        provider.value = override.value;
      }
    }
    if (providerOverridesWithScope.size > 0) {
      var moduleSet_1 = new Set(def.modules);
      providerOverridesWithScope.forEach(function (override, token) {
        if (moduleSet_1.has(getInjectableDef(token).providedIn)) {
          var provider = {
            token: token,
            flags: override.flags | (hasDeprecatedOverrides ? 4096 : 0),
            deps: splitDepsDsl(override.deps),
            value: override.value,
            index: def.providers.length
          };
          def.providers.push(provider);
          def.providersByKey[tokenKey(token)] = provider;
        }
      });
    }
  }
}
function prodCheckAndUpdateNode(view, checkIndex, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
  var nodeDef = view.def.nodes[checkIndex];
  checkAndUpdateNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
  return nodeDef.flags & 224 ? asPureExpressionData(view, checkIndex).value : undefined;
}
function prodCheckNoChangesNode(view, checkIndex, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
  var nodeDef = view.def.nodes[checkIndex];
  checkNoChangesNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
  return nodeDef.flags & 224 ? asPureExpressionData(view, checkIndex).value : undefined;
}
function debugCheckAndUpdateView(view) {
  return callWithDebugContext(DebugAction.detectChanges, checkAndUpdateView, null, [view]);
}
function debugCheckNoChangesView(view) {
  return callWithDebugContext(DebugAction.checkNoChanges, checkNoChangesView, null, [view]);
}
function debugDestroyView(view) {
  return callWithDebugContext(DebugAction.destroy, destroyView, null, [view]);
}
var DebugAction;
(function (DebugAction) {
  DebugAction[DebugAction["create"] = 0] = "create";
  DebugAction[DebugAction["detectChanges"] = 1] = "detectChanges";
  DebugAction[DebugAction["checkNoChanges"] = 2] = "checkNoChanges";
  DebugAction[DebugAction["destroy"] = 3] = "destroy";
  DebugAction[DebugAction["handleEvent"] = 4] = "handleEvent";
})(DebugAction || (DebugAction = {}));
var _currentAction;
var _currentView;
var _currentNodeIndex;
function debugSetCurrentNode(view, nodeIndex) {
  _currentView = view;
  _currentNodeIndex = nodeIndex;
}
function debugHandleEvent(view, nodeIndex, eventName, event) {
  debugSetCurrentNode(view, nodeIndex);
  return callWithDebugContext(DebugAction.handleEvent, view.def.handleEvent, null, [view, nodeIndex, eventName, event]);
}
function debugUpdateDirectives(view, checkType) {
  if (view.state & 128) {
    throw viewDestroyedError(DebugAction[_currentAction]);
  }
  debugSetCurrentNode(view, nextDirectiveWithBinding(view, 0));
  return view.def.updateDirectives(debugCheckDirectivesFn, view);
  function debugCheckDirectivesFn(view, nodeIndex, argStyle) {
    var values = [];
    for (var _i = 3; _i < arguments.length; _i++) {
      values[_i - 3] = arguments[_i];
    }
    var nodeDef = view.def.nodes[nodeIndex];
    if (checkType === 0) {
      debugCheckAndUpdateNode(view, nodeDef, argStyle, values);
    } else {
      debugCheckNoChangesNode(view, nodeDef, argStyle, values);
    }
    if (nodeDef.flags & 16384) {
      debugSetCurrentNode(view, nextDirectiveWithBinding(view, nodeIndex));
    }
    return nodeDef.flags & 224 ? asPureExpressionData(view, nodeDef.nodeIndex).value : undefined;
  }
}
function debugUpdateRenderer(view, checkType) {
  if (view.state & 128) {
    throw viewDestroyedError(DebugAction[_currentAction]);
  }
  debugSetCurrentNode(view, nextRenderNodeWithBinding(view, 0));
  return view.def.updateRenderer(debugCheckRenderNodeFn, view);
  function debugCheckRenderNodeFn(view, nodeIndex, argStyle) {
    var values = [];
    for (var _i = 3; _i < arguments.length; _i++) {
      values[_i - 3] = arguments[_i];
    }
    var nodeDef = view.def.nodes[nodeIndex];
    if (checkType === 0) {
      debugCheckAndUpdateNode(view, nodeDef, argStyle, values);
    } else {
      debugCheckNoChangesNode(view, nodeDef, argStyle, values);
    }
    if (nodeDef.flags & 3) {
      debugSetCurrentNode(view, nextRenderNodeWithBinding(view, nodeIndex));
    }
    return nodeDef.flags & 224 ? asPureExpressionData(view, nodeDef.nodeIndex).value : undefined;
  }
}
function debugCheckAndUpdateNode(view, nodeDef, argStyle, givenValues) {
  var changed = checkAndUpdateNode.apply(void 0, tslib_1.__spread([view, nodeDef, argStyle], givenValues));
  if (changed) {
    var values = argStyle === 1 ? givenValues[0] : givenValues;
    if (nodeDef.flags & 16384) {
      var bindingValues = {};
      for (var i = 0; i < nodeDef.bindings.length; i++) {
        var binding = nodeDef.bindings[i];
        var value = values[i];
        if (binding.flags & 8) {
          bindingValues[normalizeDebugBindingName(binding.nonMinifiedName)] = normalizeDebugBindingValue(value);
        }
      }
      var elDef = nodeDef.parent;
      var el = asElementData(view, elDef.nodeIndex).renderElement;
      if (!elDef.element.name) {
        view.renderer.setValue(el, "bindings=" + JSON.stringify(bindingValues, null, 2));
      } else {
        for (var attr in bindingValues) {
          var value = bindingValues[attr];
          if (value != null) {
            view.renderer.setAttribute(el, attr, value);
          } else {
            view.renderer.removeAttribute(el, attr);
          }
        }
      }
    }
  }
}
function debugCheckNoChangesNode(view, nodeDef, argStyle, values) {
  checkNoChangesNode.apply(void 0, tslib_1.__spread([view, nodeDef, argStyle], values));
}
function nextDirectiveWithBinding(view, nodeIndex) {
  for (var i = nodeIndex; i < view.def.nodes.length; i++) {
    var nodeDef = view.def.nodes[i];
    if (nodeDef.flags & 16384 && nodeDef.bindings && nodeDef.bindings.length) {
      return i;
    }
  }
  return null;
}
function nextRenderNodeWithBinding(view, nodeIndex) {
  for (var i = nodeIndex; i < view.def.nodes.length; i++) {
    var nodeDef = view.def.nodes[i];
    if (nodeDef.flags & 3 && nodeDef.bindings && nodeDef.bindings.length) {
      return i;
    }
  }
  return null;
}
var DebugContext_ = (function () {
  function DebugContext_(view, nodeIndex) {
    this.view = view;
    this.nodeIndex = nodeIndex;
    if (nodeIndex == null) {
      this.nodeIndex = nodeIndex = 0;
    }
    this.nodeDef = view.def.nodes[nodeIndex];
    var elDef = this.nodeDef;
    var elView = view;
    while (elDef && (elDef.flags & 1) === 0) {
      elDef = elDef.parent;
    }
    if (!elDef) {
      while (!elDef && elView) {
        elDef = viewParentEl(elView);
        elView = elView.parent;
      }
    }
    this.elDef = elDef;
    this.elView = elView;
  }
  Object.defineProperty(DebugContext_.prototype, "elOrCompView", {
    get: function () {
      return asElementData(this.elView, this.elDef.nodeIndex).componentView || this.view;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugContext_.prototype, "injector", {
    get: function () {
      return createInjector$1(this.elView, this.elDef);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugContext_.prototype, "component", {
    get: function () {
      return this.elOrCompView.component;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugContext_.prototype, "context", {
    get: function () {
      return this.elOrCompView.context;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugContext_.prototype, "providerTokens", {
    get: function () {
      var tokens = [];
      if (this.elDef) {
        for (var i = this.elDef.nodeIndex + 1; i <= this.elDef.nodeIndex + this.elDef.childCount; i++) {
          var childDef = this.elView.def.nodes[i];
          if (childDef.flags & 20224) {
            tokens.push(childDef.provider.token);
          }
          i += childDef.childCount;
        }
      }
      return tokens;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugContext_.prototype, "references", {
    get: function () {
      var references = {};
      if (this.elDef) {
        collectReferences(this.elView, this.elDef, references);
        for (var i = this.elDef.nodeIndex + 1; i <= this.elDef.nodeIndex + this.elDef.childCount; i++) {
          var childDef = this.elView.def.nodes[i];
          if (childDef.flags & 20224) {
            collectReferences(this.elView, childDef, references);
          }
          i += childDef.childCount;
        }
      }
      return references;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugContext_.prototype, "componentRenderElement", {
    get: function () {
      var elData = findHostElement(this.elOrCompView);
      return elData ? elData.renderElement : undefined;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DebugContext_.prototype, "renderNode", {
    get: function () {
      return this.nodeDef.flags & 2 ? renderNode(this.view, this.nodeDef) : renderNode(this.elView, this.elDef);
    },
    enumerable: true,
    configurable: true
  });
  DebugContext_.prototype.logError = function (console) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      values[_i - 1] = arguments[_i];
    }
    var logViewDef;
    var logNodeIndex;
    if (this.nodeDef.flags & 2) {
      logViewDef = this.view.def;
      logNodeIndex = this.nodeDef.nodeIndex;
    } else {
      logViewDef = this.elView.def;
      logNodeIndex = this.elDef.nodeIndex;
    }
    var renderNodeIndex = getRenderNodeIndex(logViewDef, logNodeIndex);
    var currRenderNodeIndex = -1;
    var nodeLogger = function () {
      var _a;
      currRenderNodeIndex++;
      if (currRenderNodeIndex === renderNodeIndex) {
        return (_a = console.error).bind.apply(_a, tslib_1.__spread([console], values));
      } else {
        return NOOP;
      }
    };
    logViewDef.factory(nodeLogger);
    if (currRenderNodeIndex < renderNodeIndex) {
      console.error("Illegal state: the ViewDefinitionFactory did not call the logger!");
      console.error.apply(console, tslib_1.__spread(values));
    }
  };
  return DebugContext_;
})();
function getRenderNodeIndex(viewDef, nodeIndex) {
  var renderNodeIndex = -1;
  for (var i = 0; i <= nodeIndex; i++) {
    var nodeDef = viewDef.nodes[i];
    if (nodeDef.flags & 3) {
      renderNodeIndex++;
    }
  }
  return renderNodeIndex;
}
function findHostElement(view) {
  while (view && !isComponentView(view)) {
    view = view.parent;
  }
  if (view.parent) {
    return asElementData(view.parent, viewParentEl(view).nodeIndex);
  }
  return null;
}
function collectReferences(view, nodeDef, references) {
  for (var refName in nodeDef.references) {
    references[refName] = getQueryValue(view, nodeDef, nodeDef.references[refName]);
  }
}
function callWithDebugContext(action, fn, self, args) {
  var oldAction = _currentAction;
  var oldView = _currentView;
  var oldNodeIndex = _currentNodeIndex;
  try {
    _currentAction = action;
    var result = fn.apply(self, args);
    _currentView = oldView;
    _currentNodeIndex = oldNodeIndex;
    _currentAction = oldAction;
    return result;
  } catch (e) {
    if (isViewDebugError(e) || !_currentView) {
      throw e;
    }
    throw viewWrappedDebugError(e, getCurrentDebugContext());
  }
}
function getCurrentDebugContext() {
  return _currentView ? new DebugContext_(_currentView, _currentNodeIndex) : null;
}
var DebugRendererFactory2 = (function () {
  function DebugRendererFactory2(delegate) {
    this.delegate = delegate;
  }
  DebugRendererFactory2.prototype.createRenderer = function (element, renderData) {
    return new DebugRenderer2(this.delegate.createRenderer(element, renderData));
  };
  DebugRendererFactory2.prototype.begin = function () {
    if (this.delegate.begin) {
      this.delegate.begin();
    }
  };
  DebugRendererFactory2.prototype.end = function () {
    if (this.delegate.end) {
      this.delegate.end();
    }
  };
  DebugRendererFactory2.prototype.whenRenderingDone = function () {
    if (this.delegate.whenRenderingDone) {
      return this.delegate.whenRenderingDone();
    }
    return Promise.resolve(null);
  };
  return DebugRendererFactory2;
})();
var DebugRenderer2 = (function () {
  function DebugRenderer2(delegate) {
    this.delegate = delegate;
    this.debugContextFactory = getCurrentDebugContext;
    this.data = this.delegate.data;
  }
  DebugRenderer2.prototype.createDebugContext = function (nativeElement) {
    return this.debugContextFactory(nativeElement);
  };
  DebugRenderer2.prototype.destroyNode = function (node) {
    var debugNode = getDebugNode(node);
    removeDebugNodeFromIndex(debugNode);
    if (debugNode instanceof DebugNode__PRE_R3__) {
      debugNode.listeners.length = 0;
    }
    if (this.delegate.destroyNode) {
      this.delegate.destroyNode(node);
    }
  };
  DebugRenderer2.prototype.destroy = function () {
    this.delegate.destroy();
  };
  DebugRenderer2.prototype.createElement = function (name, namespace) {
    var el = this.delegate.createElement(name, namespace);
    var debugCtx = this.createDebugContext(el);
    if (debugCtx) {
      var debugEl = new DebugElement__PRE_R3__(el, null, debugCtx);
      debugEl.name = name;
      indexDebugNode(debugEl);
    }
    return el;
  };
  DebugRenderer2.prototype.createComment = function (value) {
    var comment = this.delegate.createComment(value);
    var debugCtx = this.createDebugContext(comment);
    if (debugCtx) {
      indexDebugNode(new DebugNode__PRE_R3__(comment, null, debugCtx));
    }
    return comment;
  };
  DebugRenderer2.prototype.createText = function (value) {
    var text = this.delegate.createText(value);
    var debugCtx = this.createDebugContext(text);
    if (debugCtx) {
      indexDebugNode(new DebugNode__PRE_R3__(text, null, debugCtx));
    }
    return text;
  };
  DebugRenderer2.prototype.appendChild = function (parent, newChild) {
    var debugEl = getDebugNode(parent);
    var debugChildEl = getDebugNode(newChild);
    if (debugEl && debugChildEl && debugEl instanceof DebugElement__PRE_R3__) {
      debugEl.addChild(debugChildEl);
    }
    this.delegate.appendChild(parent, newChild);
  };
  DebugRenderer2.prototype.insertBefore = function (parent, newChild, refChild) {
    var debugEl = getDebugNode(parent);
    var debugChildEl = getDebugNode(newChild);
    var debugRefEl = getDebugNode(refChild);
    if (debugEl && debugChildEl && debugEl instanceof DebugElement__PRE_R3__) {
      debugEl.insertBefore(debugRefEl, debugChildEl);
    }
    this.delegate.insertBefore(parent, newChild, refChild);
  };
  DebugRenderer2.prototype.removeChild = function (parent, oldChild) {
    var debugEl = getDebugNode(parent);
    var debugChildEl = getDebugNode(oldChild);
    if (debugEl && debugChildEl && debugEl instanceof DebugElement__PRE_R3__) {
      debugEl.removeChild(debugChildEl);
    }
    this.delegate.removeChild(parent, oldChild);
  };
  DebugRenderer2.prototype.selectRootElement = function (selectorOrNode, preserveContent) {
    var el = this.delegate.selectRootElement(selectorOrNode, preserveContent);
    var debugCtx = getCurrentDebugContext();
    if (debugCtx) {
      indexDebugNode(new DebugElement__PRE_R3__(el, null, debugCtx));
    }
    return el;
  };
  DebugRenderer2.prototype.setAttribute = function (el, name, value, namespace) {
    var debugEl = getDebugNode(el);
    if (debugEl && debugEl instanceof DebugElement__PRE_R3__) {
      var fullName = namespace ? namespace + ":" + name : name;
      debugEl.attributes[fullName] = value;
    }
    this.delegate.setAttribute(el, name, value, namespace);
  };
  DebugRenderer2.prototype.removeAttribute = function (el, name, namespace) {
    var debugEl = getDebugNode(el);
    if (debugEl && debugEl instanceof DebugElement__PRE_R3__) {
      var fullName = namespace ? namespace + ":" + name : name;
      debugEl.attributes[fullName] = null;
    }
    this.delegate.removeAttribute(el, name, namespace);
  };
  DebugRenderer2.prototype.addClass = function (el, name) {
    var debugEl = getDebugNode(el);
    if (debugEl && debugEl instanceof DebugElement__PRE_R3__) {
      debugEl.classes[name] = true;
    }
    this.delegate.addClass(el, name);
  };
  DebugRenderer2.prototype.removeClass = function (el, name) {
    var debugEl = getDebugNode(el);
    if (debugEl && debugEl instanceof DebugElement__PRE_R3__) {
      debugEl.classes[name] = false;
    }
    this.delegate.removeClass(el, name);
  };
  DebugRenderer2.prototype.setStyle = function (el, style, value, flags) {
    var debugEl = getDebugNode(el);
    if (debugEl && debugEl instanceof DebugElement__PRE_R3__) {
      debugEl.styles[style] = value;
    }
    this.delegate.setStyle(el, style, value, flags);
  };
  DebugRenderer2.prototype.removeStyle = function (el, style, flags) {
    var debugEl = getDebugNode(el);
    if (debugEl && debugEl instanceof DebugElement__PRE_R3__) {
      debugEl.styles[style] = null;
    }
    this.delegate.removeStyle(el, style, flags);
  };
  DebugRenderer2.prototype.setProperty = function (el, name, value) {
    var debugEl = getDebugNode(el);
    if (debugEl && debugEl instanceof DebugElement__PRE_R3__) {
      debugEl.properties[name] = value;
    }
    this.delegate.setProperty(el, name, value);
  };
  DebugRenderer2.prototype.listen = function (target, eventName, callback) {
    if (typeof target !== "string") {
      var debugEl = getDebugNode(target);
      if (debugEl) {
        debugEl.listeners.push(new DebugEventListener(eventName, callback));
      }
    }
    return this.delegate.listen(target, eventName, callback);
  };
  DebugRenderer2.prototype.parentNode = function (node) {
    return this.delegate.parentNode(node);
  };
  DebugRenderer2.prototype.nextSibling = function (node) {
    return this.delegate.nextSibling(node);
  };
  DebugRenderer2.prototype.setValue = function (node, value) {
    return this.delegate.setValue(node, value);
  };
  return DebugRenderer2;
})();
function overrideProvider(override) {
  initServicesIfNeeded();
  return Services.overrideProvider(override);
}
exports.ɵoverrideProvider = overrideProvider;
function overrideComponentView(comp, componentFactory) {
  initServicesIfNeeded();
  return Services.overrideComponentView(comp, componentFactory);
}
exports.ɵoverrideComponentView = overrideComponentView;
function clearOverrides() {
  initServicesIfNeeded();
  return Services.clearOverrides();
}
exports.ɵclearOverrides = clearOverrides;
function createNgModuleFactory(ngModuleType, bootstrapComponents, defFactory) {
  return new NgModuleFactory_(ngModuleType, bootstrapComponents, defFactory);
}
exports.ɵcmf = createNgModuleFactory;
function cloneNgModuleDefinition(def) {
  var providers = Array.from(def.providers);
  var modules = Array.from(def.modules);
  var providersByKey = {};
  for (var key in def.providersByKey) {
    providersByKey[key] = def.providersByKey[key];
  }
  return {
    factory: def.factory,
    isRoot: def.isRoot,
    providers: providers,
    modules: modules,
    providersByKey: providersByKey
  };
}
var NgModuleFactory_ = (function (_super) {
  tslib_1.__extends(NgModuleFactory_, _super);
  function NgModuleFactory_(moduleType, _bootstrapComponents, _ngModuleDefFactory) {
    var _this = _super.call(this) || this;
    _this.moduleType = moduleType;
    _this._bootstrapComponents = _bootstrapComponents;
    _this._ngModuleDefFactory = _ngModuleDefFactory;
    return _this;
  }
  NgModuleFactory_.prototype.create = function (parentInjector) {
    initServicesIfNeeded();
    var def = cloneNgModuleDefinition(resolveDefinition(this._ngModuleDefFactory));
    return Services.createNgModuleRef(this.moduleType, parentInjector || Injector.NULL, this._bootstrapComponents, def);
  };
  return NgModuleFactory_;
})(NgModuleFactory);

