import "jstree/dist/jstree.js";
import "jstree/dist/themes/default/style.css";
import "./styles.css";

console.log(process.env);

$(function () {
    $('#container').jstree();
});