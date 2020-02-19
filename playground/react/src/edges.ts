let result;
if (process.env.NODE_ENV === 'production') {
  result = require('./production');
} else {
  result = require('./development');
}
console.log(require('./whitespaces'));
export default result;
