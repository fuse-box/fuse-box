import { Context } from '../../core/context';
import { moduleCompiler, IModuleCompilerProps } from '../compile/moduleCompiler';
import { createWorkerClients } from './WorkerClient';

export type CompilerHub = ReturnType<typeof createCompilerHub>;
export function createCompilerHub(ctx: Context) {
  const config = ctx.config.threading;

  let worker;
  return {
    compile: (props: IModuleCompilerProps) => {
      // doing it the normal way
      if (!config.enabled) return moduleCompiler(props);
      const size = Buffer.byteLength(props.contents, 'utf8');

      if (config.minFileSize === 0 || size >= config.minFileSize) {
        worker.compile(props);
      } else {
        moduleCompiler(props);
      }
    },
    launch: () => {
      if (config.enabled) {
        worker = createWorkerClients(config);
        worker.launch();
      }
    },
    terminate: () => {
      if (config.enabled) worker.terminate();
    },
  };
}
