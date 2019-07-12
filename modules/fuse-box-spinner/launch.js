const { getSpinner } = require('./spinner');

var mySpinner = getSpinner();

process.on('message', msg => {
  const json = JSON.parse(msg);
  if (json.action === 'start') {
    mySpinner.start(0);
  }
  if (json.action === 'text') {
    mySpinner.setText(json.args[0]);
  }
  if (json.action === 'stop') {
    mySpinner.stop();
  }
});
