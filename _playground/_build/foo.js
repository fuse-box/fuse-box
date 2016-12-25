(function(FuseBox) {
    FuseBox.pkg("myLib", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {

            "use strict";
            var HelloMyLib = (function() {
                function HelloMyLib() {}
                return HelloMyLib;
            }());
            exports.HelloMyLib = HelloMyLib;

        });
    });
    FuseBox.expose([{ "alias": "myLib", "pkg": "myLib/index.js" }]);
    FuseBox.main("myLib/index.js");
})
(function(e) { var r = "undefined" != typeof window && window.navigator;
    r && (window.global = window), e = r && "undefined" == typeof __fbx__dnm__ ? e : module.exports; var n = r ? window.__fsbx__ = window.__fsbx__ || {} : global.$fsbx = global.$fsbx || {};
    r || (global.require = require); var t = n.p = n.p || {},
        i = n.e = n.e || {},
        o = function(e) { if (/^([@a-z].*)$/.test(e)) { if ("@" === e[0]) { var r = e.split("/"),
                        n = r.splice(2, r.length).join("/"); return [r[0] + "/" + r[1], n || void 0] } return e.split(/\/(.+)?/) } },
        a = function(e) { return e.substring(0, e.lastIndexOf("/")) || "./" },
        f = function() { for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r]; for (var n = [], t = 0, i = arguments.length; t < i; t++) n = n.concat(arguments[t].split("/")); for (var o = [], t = 0, i = n.length; t < i; t++) { var a = n[t];
                a && "." !== a && (".." === a ? o.pop() : o.push(a)) } return "" === n[0] && o.unshift(""), o.join("/") || (o.length ? "/" : ".") },
        u = function(e) { var r = e.match(/\.(\w{1,})$/); if (r) { var n = r[1]; return n ? e : e + ".js" } return e + ".js" },
        s = function(e) { if (r) { var n, t = document,
                    i = t.getElementsByTagName("head")[0]; /\.css$/.test(e) ? (n = t.createElement("link"), n.rel = "stylesheet", n.type = "text/css", n.href = e) : (n = t.createElement("script"), n.type = "text/javascript", n.src = e, n.async = !0), i.insertBefore(n, i.firstChild) } },
        l = function(e, n) { var i = n.path || "./",
                a = n.pkg || "default",
                s = o(e);
            s && (i = "./", a = s[0], n.v && n.v[a] && (a = a + "@" + n.v[a]), e = s[1]), /^~/.test(e) && (e = e.slice(2, e.length), i = "./"); var l = t[a]; if (!l) { if (r) throw 'Package was not found "' + a + '"'; return { serverReference: require(a) } }
            e || (e = "./" + l.s.entry); var c = f(i, e),
                v = u(c),
                p = l.f[v]; return p || (v = f(c, "/", "index.js"), p = l.f[v], p || (v = c + ".js", p = l.f[v])), { file: p, pkgName: a, versions: l.v, filePath: c, validPath: v } },
        c = function(e, n) { if (!r) return n(/\.(js|json)$/.test(e) ? global.require(e) : ""); var t;
            t = new XMLHttpRequest, t.onreadystatechange = function() { if (4 == t.readyState && 200 == t.status) { var r = t.getResponseHeader("Content-Type"),
                        i = t.responseText; /json/.test(r) ? i = "module.exports = " + i : /javascript/.test(r) || (i = "module.exports = " + JSON.stringify(i)); var o = f("./", e);
                    d.dynamic(o, i), n(d.import(e, {})) } }, t.open("GET", e, !0), t.send() },
        v = function(e, r) { var n = i[e]; if (n)
                for (var t in n) { var o = n[t].apply(null, r); if (o === !1) return !1 } },
        p = function(e, n) { if (void 0 === n && (n = {}), /^(http(s)?:|\/\/)/.test(e)) return s(e); var t = l(e, n); if (t.serverReference) return t.serverReference; var i = t.file; if (!i) { var o = "function" == typeof n,
                    f = v("async", [e, n]); if (f === !1) return; return c(e, function(e) { if (o) return n(e) }) } var u = t.validPath,
                d = t.pkgName; if (i.locals && i.locals.module) return i.locals.module.exports; var m = i.locals = {},
                g = a(u);
            m.exports = {}, m.module = { exports: m.exports }, m.require = function(e, r) { return p(e, { pkg: d, path: g, v: t.versions }) }, m.require.main = { filename: r ? "./" : global.require.main.filename }; var _ = [m.module.exports, m.require, m.module, u, g, d]; return v("before-import", _), i.fn.apply(0, _), v("after-import", _), m.module.exports },
        d = function() {
            function n() {} return Object.defineProperty(n, "isBrowser", { get: function() { return void 0 !== r }, enumerable: !0, configurable: !0 }), Object.defineProperty(n, "isServer", { get: function() { return !r }, enumerable: !0, configurable: !0 }), n.global = function(e, n) { var t = r ? window : global; return void 0 === n ? t[e] : void(t[e] = n) }, n.import = function(e, r) { return p(e, r) }, n.on = function(e, r) { i[e] = i[e] || [], i[e].push(r) }, n.exists = function(e) { var r = l(e, {}); return void 0 !== r.file }, n.main = function(e) { return n.import(e, {}) }, n.expose = function(r) { for (var n in r) { var t = r[n],
                        i = p(t.pkg);
                    e[t.alias] = i } }, n.dynamic = function(r, n) { this.pkg("default", {}, function(t) { t.file(r, function(r, t, i, o, a) { var f = new Function("__fbx__dnm__", "exports", "require", "module", "__filename", "__dirname", "__root__", n);
                        f(!0, r, t, i, o, a, e) }) }) }, n.pkg = function(e, r, n) { if (t[e]) return n(t[e].s); var i = t[e] = {},
                    o = i.f = {};
                i.v = r; var a = i.s = { file: function(e, r) { o[e] = { fn: r } } }; return n(a) }, n }(); return e.FuseBox = d }(this))