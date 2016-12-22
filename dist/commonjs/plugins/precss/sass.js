"use strict";
const sass = require("node-sass");
function render(content, options) {
    if (!options)
        options = {};
    options.data = content;
    return new Promise((resolve, reject) => {
        sass.render(options, (err, res) => {
            return err ? reject(err) : resolve(res.css);
        });
    });
}
exports.render = render;
