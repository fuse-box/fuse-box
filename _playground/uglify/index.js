var str1 =require('./file-1.js');
var str2 = require('./file-2.js');

module.exports = function () {
	return str1 + ' ' + str2;
};