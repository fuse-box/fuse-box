const path = require("path");
console.log(path.join("./a", "b/", "/c", "../foo/../"));

const $pathJoin = function(...string) {
    let parts = [];
    for (let i = 0, l = arguments.length; i < l; i++) {
        parts = parts.concat(arguments[i].split("/"));
    }
    let newParts = [];
    for (let i = 0, l = parts.length; i < l; i++) {
        let part = parts[i];
        if (!part || part === ".") { continue; }
        if (part === "..") { newParts.pop(); } else { newParts.push(part); }
    }
    if (parts[0] === "") { newParts.unshift(""); }
    return newParts.join("/") || (newParts.length ? "/" : ".");
}

const $foo = function() {
    let parts = [];
    for (let i = 0, l = arguments.length; i < l; i++) {
        parts = parts.concat(arguments[i].split("/").filter((value) => {
            return value;
        }));
    }
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === '.') {
            parts.splice(i, 1);
        } else if (last === '..') {
            parts.splice(i, 1);
            up++;
        } else if (up) {
            parts.splice(i, 1);
            up--;
        }
    }
    return parts.join("/");
}

const args = ["./foo", "/lib", "../", "//after_foo/", "../../"];
console.log("foo", $foo.apply(this, args));
console.log("native", path.join.apply(this, args));