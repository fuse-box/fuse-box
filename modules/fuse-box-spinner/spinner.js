const readline = require('readline');

const SPINNERS = [
  '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏',
  '⠋⠙⠚⠞⠖⠦⠴⠲⠳⠓',
  '⠄⠆⠇⠋⠙⠸⠰⠠⠰⠸⠙⠋⠇⠆',
  '⠋⠙⠚⠒⠂⠂⠒⠲⠴⠦⠖⠒⠐⠐⠒⠓⠋',
  '⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠴⠲⠒⠂⠂⠒⠚⠙⠉⠁',
  '⠈⠉⠋⠓⠒⠐⠐⠒⠖⠦⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈',
  '⠁⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈⠈',
  '⢄⢂⢁⡁⡈⡐⡠',
  '⢹⢺⢼⣸⣇⡧⡗⡏',
  '⣾⣽⣻⢿⡿⣟⣯⣷',
  '⠁⠂⠄⡀⢀⠠⠐⠈',
];

const Colours = {
  BG_BLACK: '\x1b[40m',
  BG_BLUE: '\x1b[44m',
  BG_CYAN: '\x1b[46m',
  BG_GREEN: '\x1b[42m',
  BG_MAGENTA: '\x1b[45m',
  BG_RED: '\x1b[41m',
  BG_WHITE: '\x1b[47m',
  BG_YELLOW: '\x1b[43m',
  BLINK: '\x1b[5m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  FG_BLACK: '\x1b[30m',
  FG_BLUE: '\x1b[34m',
  FG_CYAN: '\x1b[36m',
  FG_GREEN: '\x1b[32m',
  FG_MAGENTA: '\x1b[35m',
  FG_RED: '\x1b[31m',
  FG_WHITE: '\x1b[37m',
  FG_YELLOW: '\x1b[33m',
  HIDDEN: '\x1b[8m',
  RESET: '\x1b[0m',
  REVERSE: '\x1b[7m',
  UNDERSCORE: '\x1b[4m',
};
function colourise(type, text) {
  return type + text + Colours.RESET;
}

module.exports.getSpinner = function() {
  function onTick(msg) {
    clearLine();
    process.stdout.write(msg);
  }
  function clearLine() {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
  }
  let userText = '';
  let interval;
  return {
    setText: t => (userText = t),
    start: index => {
      const spinnerChars = SPINNERS[index || 0];
      let current = 0;
      function iteration() {
        const spinnerText = colourise(
          Colours.FG_YELLOW,
          ' ' +
            (userText.indexOf('%s') > -1 ? userText.replace('%s', spinnerChars[current]) : spinnerChars[current] + ' '),
        );
        onTick(spinnerText + userText);
        current = ++current % spinnerChars.length;
      }
      iteration();
      interval = setInterval(iteration, 50);
    },
    stop: () => {
      clearInterval(interval);
      clearLine();
      process.exit(0);
    },
  };
};
