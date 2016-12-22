"use strict";
const less = require("less");
function render(content, options) {
    return new Promise((resolve, reject) => {
        less.render(content, options, (err, res) => {
            return err ? reject(err) : resolve(res.css);
        });
    });
}
exports.render = render;
