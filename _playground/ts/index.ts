require(`./foo.css`);
const path = require("path");
console.log(path.dirname(process.cwd()));
console.log(path.join("a", "b", "c"));
export let foo = "hello";

