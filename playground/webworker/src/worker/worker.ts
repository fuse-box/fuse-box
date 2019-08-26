self.addEventListener(
  'message',
  function(e) {
    setInterval(() => {
      self.postMessage('I am workin g MOIKKA');
    }, 1000);
  },
  false,
);
