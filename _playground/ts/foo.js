(function(FuseBox) {
    FuseBox.pkg("myLib", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.default = typeof window === "undefined";

        });
    });
    FuseBox.expose([{ "alias": "myLib", "pkg": "myLib/index.js" }]);
    FuseBox.main("myLib/index.js");
})
(function(e) { var r = "undefined" != typeof window && window.navigator;
    r && (window.global = window), e = r && "undefined" == typeof __fbx__dnm__ ? e : module.exports; var t = r ? window.__fsbx__ = window.__fsbx__ || {} : global.$fsbx = global.$fsbx || {};
    r || (global.require = require); var n = t.p = t.p || {},
        i = t.e = t.e || {},
        o = function(e) { if (/^([@a-z].*)$/.test(e)) { if ("@" === e[0]) { var r = e.split("/"),
                        t = r.splice(2, r.length).join("/"); return [r[0] + "/" + r[1], t || void 0] } return e.split(/\/(.+)?/) } },
        a = function(e) { return e.substring(0, e.lastIndexOf("/")) || "./" },
        f = function() { for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r]; for (var t = [], n = 0, i = arguments.length; n < i; n++) t = t.concat(arguments[n].split("/")); for (var o = [], n = 0, i = t.length; n < i; n++) { var a = t[n];
                a && "." !== a && (".." === a ? o.pop() : o.push(a)) } return "" === t[0] && o.unshift(""), o.join("/") || (o.length ? "/" : ".") },
        u = function(e) { var r = e.match(/\.(\w{1,})$/); if (r) { var t = r[1]; return t ? e : e + ".js" } return e + ".js" },
        s = function(e) { if (r) { var t, n = document,
                    i = n.getElementsByTagName("head")[0]; /\.css$/.test(e) ? (t = n.createElement("link"), t.rel = "stylesheet", t.type = "text/css", t.href = e) : (t = n.createElement("script"), t.type = "text/javascript", t.src = e, t.async = !0), i.insertBefore(t, i.firstChild) } },
        l = function(e, t) { var i = t.path || "./",
                a = t.pkg || "default",
                s = o(e);
            s && (i = "./", a = s[0], t.v && t.v[a] && (a = a + "@" + t.v[a]), e = s[1]), /^~/.test(e) && (e = e.slice(2, e.length), i = "./"); var l = n[a]; if (!l) { if (r) throw 'Package was not found "' + a + '"'; return { serverReference: require(a) } }
            e || (e = "./" + l.s.entry); var c, v = f(i, e),
                p = u(v),
                d = l.f[p]; return !d && /\*/.test(p) && (c = p), d || c || (p = f(v, "/", "index.js"), d = l.f[p], d || (p = v + ".js", d = l.f[p]), d || (d = l.f[v + ".jsx"])), { file: d, wildcard: c, pkgName: a, versions: l.v, filePath: v, validPath: p } },
        c = function(e, t) { if (!r) return t(/\.(js|json)$/.test(e) ? global.require(e) : ""); var n;
            n = new XMLHttpRequest, n.onreadystatechange = function() { if (4 == n.readyState && 200 == n.status) { var r = n.getResponseHeader("Content-Type"),
                        i = n.responseText; /json/.test(r) ? i = "module.exports = " + i : /javascript/.test(r) || (i = "module.exports = " + JSON.stringify(i)); var o = f("./", e);
                    d.dynamic(o, i), t(d.import(e, {})) } }, n.open("GET", e, !0), n.send() },
        v = function(e, r) { var t = i[e]; if (t)
                for (var n in t) { var o = t[n].apply(null, r); if (o === !1) return !1 } },
        p = function(e, t) { if (void 0 === t && (t = {}), /^(http(s)?:|\/\/)/.test(e)) return s(e); var i = l(e, t); if (i.serverReference) return i.serverReference; var o = i.file; if (i.wildcard) { var f = new RegExp(i.wildcard.replace(/\*/g, "@").replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&").replace(/@/g, "[a-z0-9$_-]+")),
                    u = n[i.pkgName]; if (u) { var d = {}; for (var g in u.f) f.test(g) && (d[g] = p(i.pkgName + "/" + g)); return d } } if (!o) { var m = "function" == typeof t,
                    _ = v("async", [e, t]); if (_ === !1) return; return c(e, function(e) { if (m) return t(e) }) } var h = i.validPath,
                x = i.pkgName; if (o.locals && o.locals.module) return o.locals.module.exports; var w = o.locals = {},
                b = a(h);
            w.exports = {}, w.module = { exports: w.exports }, w.require = function(e, r) { return p(e, { pkg: x, path: b, v: i.versions }) }, w.require.main = { filename: r ? "./" : global.require.main.filename }; var y = [w.module.exports, w.require, w.module, h, b, x]; return v("before-import", y), o.fn.apply(0, y), v("after-import", y), w.module.exports },
        d = function() {
            function t() {} return Object.defineProperty(t, "isBrowser", { get: function() { return void 0 !== r }, enumerable: !0, configurable: !0 }), Object.defineProperty(t, "isServer", { get: function() { return !r }, enumerable: !0, configurable: !0 }), t.global = function(e, t) { var n = r ? window : global; return void 0 === t ? n[e] : void(n[e] = t) }, t.import = function(e, r) { return p(e, r) }, t.on = function(e, r) { i[e] = i[e] || [], i[e].push(r) }, t.exists = function(e) { var r = l(e, {}); return void 0 !== r.file }, t.remove = function(e) { var r = l(e, {}),
                    t = n[r.pkgName];
                t && t.f[r.validPath] && delete t.f[r.validPath] }, t.main = function(e) { return t.import(e, {}) }, t.expose = function(r) { for (var t in r) { var n = r[t],
                        i = p(n.pkg);
                    e[n.alias] = i } }, t.dynamic = function(r, t) { this.pkg("default", {}, function(n) { n.file(r, function(r, n, i, o, a) { var f = new Function("__fbx__dnm__", "exports", "require", "module", "__filename", "__dirname", "__root__", t);
                        f(!0, r, n, i, o, a, e) }) }) }, t.pkg = function(e, r, t) { if (n[e]) return t(n[e].s); var i = n[e] = {},
                    o = i.f = {};
                i.v = r; var a = i.s = { file: function(e, r) { o[e] = { fn: r } } }; return t(a) }, t }(); return e.FuseBox = d }(this))