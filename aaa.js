var sh = require("shorthash");
const fs = require("fs")
var XXHash = require('xxhash');
const murmurhashNative = require('murmurhash-native')
const contents = fs.readFileSync(__dirname + "/bin.js");

var start = new Date().getTime();
for (let i = 0; i <= 2000; i++) {
    murmurhashNative.murmurHash64(contents)
}
console.log('murmurhash-native', new Date().getTime() - start);


var start = new Date().getTime();
for (let i = 0; i <= 2000; i++) {
    sh.unique(contents.toString())
}
console.log('shorthash', new Date().getTime() - start);


// a3eab8756bfeaf91
// 706301570