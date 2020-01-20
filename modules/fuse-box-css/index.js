/**
 * Listens to 'async' requets and if the name is a css file
 * wires it to `__fsbx_css`
 */

var cssHandler = function(__filename, contents) {
  var styleId = __filename.replace(/[\.\/]+/g, '-');
  if (styleId.charAt(0) === '-') styleId = styleId.substring(1);
  var exists = document.getElementById(styleId);
  if (!exists) {
    //<link href="//fonts.googleapis.com/css?family=Covered+By+Your+Grace" rel="stylesheet" type="text/css">
    var s = document.createElement(contents ? 'style' : 'link');
    s.id = styleId;
    s.type = 'text/css';
    if (contents) {
      s.innerHTML = contents;
    } else {
      s.rel = 'stylesheet';
      s.href = __filename;
    }
    document.getElementsByTagName('head')[0].appendChild(s);
  } else {
    if (contents) exists.innerHTML = contents;
  }
};

module.exports = cssHandler;
