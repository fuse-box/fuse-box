import { Worker } from 'worker_threads';
import { IThreadingConfig } from '../../config/IThreadingConfig';
import { env } from '../../env';
import { randomHash } from '../../utils/utils';
import { IModuleCompilerProps } from '../compile/moduleCompiler';

function createClientSession(worker) {
  const mainSession = randomHash();
  const requests = {};
  return {
    mainSession,
    requests,
    exec: (method, payload) => {
      const data = { mainSession, method, payload };
      worker.postMessage(data);
    },
    onRequest: (method: string, fn: (arg: any) => Promise<any>) => {
      requests[method] = fn;
    },
    respond: async (localSession, method, payload) => {
      if (requests[method]) {
        const data = await requests[method](payload);
        if (data) worker.postMessage({ localSession, mainSession, method: method, payload: data });
      }
    },
  };
}

export function createWorkerClients(config: IThreadingConfig) {
  const Sessions = {};
  const WORKERS: Array<Worker> = [];

  function createWorker() {
    const worker = new Worker(env.WORKER_THREAD, {});
    WORKERS.push(worker);
    worker.on('message', data => {
      const session = Sessions[data.mainSession];
      if (session) session.respond(data.localSession, data.method, data.payload);
    });
    return worker;
  }
  let useId = -1;
  function pickWorker() {
    useId++;
    if (WORKERS[useId]) {
      return WORKERS[useId];
    }
    useId = -1;
    return WORKERS[0];
  }

  return {
    compile: (props: IModuleCompilerProps) => {
      const gotWorker = pickWorker();

      if (!gotWorker) {
        process.exit(0);
      }
      const session = createClientSession(gotWorker);
      Sessions[session.mainSession] = session;
      const serializedProps = {
        absPath: props.absPath,
        contents: props.contents,
        context: props.context,
        generateCode: props.generateCode,
      };
      session.exec('compile', serializedProps);
      session.onRequest('onResolve', arg => {
        return props.onResolve(arg);
      });

      session.onRequest('onFatal', e => {
        props.onFatal && props.onFatal(e);
        return Promise.resolve();
      });
      session.onRequest('onError', arg => {
        props.onError(arg);
        return Promise.resolve();
      });
      session.onRequest('onReady', arg => {
        props.onReady(arg);
        return Promise.resolve();
      });
    },
    launch: () => {
      for (let i = 0; i < config.threadAmount; i++) {
        createWorker();
      }
    },
    terminate: () => {
      for (const worker of WORKERS) {
        worker.terminate();
      }
    },
  };
}
