import { spawn } from 'child_process';
import { onExit } from '../utils/exit';

export interface IServerProcessProps {
  absPath?: string;
}

export interface IServerProcess {
  exec: (args?: Array<string>) => void;
  kill: () => void;
  start: () => void;
}
export function createServerProcess(props: IServerProcessProps): IServerProcess {
  let node, storedArgs;
  // onExit(() => {
  //   console.log('STOPPED SHIT');
  // });
  const obj = {
    exec: (cliArgs: Array<string> = []) => {
      storedArgs = cliArgs;
      node = spawn('node', [props.absPath, ...cliArgs], {
        stdio: 'inherit',
      });

      node.on('close', code => {
        if (code === 8) {
          console.error('Error detected, waiting for changes...');
        }
      });
      return node;
    },
    kill: () => {
      if (node) node.kill();
    },
    start: () => {
      obj.kill();
      const node = obj.exec(storedArgs);
      onExit('createServerProcess', () => {
        node.kill();
      });
    },
  };
  return obj;
}
