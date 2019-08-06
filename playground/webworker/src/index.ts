const myWorker = new Worker('./worker/worker');
myWorker.postMessage(['hello']);
myWorker.onmessage = function(e) {
  console.log('Message received from worker', e);
};

console.log('KUKKA');
