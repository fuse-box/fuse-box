var cheerio = require("cheerio");
let $ = cheerio.load('<h2 class="title">Hello world</h2>')

$('h2.title').text('Hello there!')
$('h2').addClass('welcome')

console.log($.html());
// var babel = require('babel-standalone');
// var coreJS = require('core-js');
// var path = require("path")
//     // var buffer = require("buffer")
// console.log(path.join("a", "b"));
//require("fuse-box-testcase2");
// var asyncWatch = require("async-watch")
// var asyncWatch = require("async-watch")
// var asyncWatch = require("async-watch")
// console.log("asyncWatch", asyncWatch);
// var r = require("wires-reactive")

//require("fuse-box-testcase1")
//console.log(coreJS);


//var chars = new RegExp(`ªµºÀ-ÖØ-öø`);
// var input = 'const getMessage = () => "Hello World";';
// var output = (0, _babelStandalone.transform)(input, { presets: ['es2015'] }).code;