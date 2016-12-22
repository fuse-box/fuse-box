"use strict";
const stylus = require("stylus");
function render(content, options) {
    return new Promise((resolve, reject) => {
        stylus.render(content, options, (err, res) => {
            return err ? reject(err) : resolve(res);
        });
    });
}
exports.render = render;
