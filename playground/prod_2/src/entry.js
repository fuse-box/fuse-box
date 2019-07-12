const myWorker = new Worker('./worker/worker.ts');
myWorker.postMessage(['hello']);
myWorker.onmessage = function(e) {
  console.log('Message received from worker', e);
};

console.log('voi void');
