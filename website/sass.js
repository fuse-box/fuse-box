const chokidar = require("chokidar");
var watcher = chokidar.watch("static**/**.scss", {});
const sass = require("node-sass");
const path = require("path");
const fs = require("fs");

let interval;
const entrySass = path.join(__dirname, "static/sass/main.scss");
const targetCSSFile = path.join(__dirname, "static/css/custom.css");

const compile = () => {
  clearTimeout(interval);
  interval = setTimeout(() => {
    sass.render(
      {
        includePaths: [path.dirname(entrySass)],
        file: entrySass,
        outFile: targetCSSFile,
      },
      function(err, result) {
        if (err) {
          console.error(err);
        } else {
          fs.writeFile(targetCSSFile, result.css, function(err) {
            if (!err) {
              console.log(">> Sass Compiled");
            } else {
              console.log(">> Error");
            }
          });
        }
      },
    );
  }, 100);
};
watcher.on("all", (event, path) => {
  compile();
});
