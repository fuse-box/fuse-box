console.log('----- worker -----');
import * as path from 'path';
self.addEventListener(
  'message',
  function(e) {
    setInterval(() => {
      console.log(path.join('a', 'b'));
      self.postMessage('oioioio');
    }, 1000);
  },
  false,
);
