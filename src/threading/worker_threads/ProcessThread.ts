import { parentPort } from 'worker_threads';
import { randomHash } from '../../utils/utils';
import { moduleCompiler } from '../compile/moduleCompiler';

const onResolve = {};

parentPort.on('message', msg => {
  const { method, payload } = msg;

  if (method === 'onResolve') {
    if (onResolve[msg.localSession]) {
      onResolve[msg.localSession](msg.payload);
    }
  }

  if (method === 'compile') {
    const mainSession = msg.mainSession;
    moduleCompiler({
      ...payload,
      onError: opts => {
        parentPort.postMessage({ mainSession, method: 'onError', payload: opts });
      },
      onFatal: e => {
        parentPort.postMessage({ mainSession, method: 'onFatal', payload: e });
      },
      onReady: opts => {
        parentPort.postMessage({ mainSession, method: 'onReady', payload: opts });
      },
      onResolve: async opts => {
        const localSession = randomHash();
        return new Promise((resolve, reject) => {
          parentPort.postMessage({ localSession, mainSession, method: 'onResolve', payload: opts });
          onResolve[localSession] = resolve;
        });
      },
    });
  }
});
