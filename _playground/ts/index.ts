import "./hello.js"
import "./less/styles.less";
declare const FuseBox: any;

let results = FuseBox.import("./batch/*")
console.log(results, "   ");