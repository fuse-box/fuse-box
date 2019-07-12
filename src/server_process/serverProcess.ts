import { spawn } from 'child_process';

export interface IServerProcessProps {
  absPath?: string;
}

export interface IServerProcess {
  kill: () => void;
  start: () => void;
  exec: (args?: Array<string>) => void;
}
export function createServerProcess(props: IServerProcessProps): IServerProcess {
  let node, storedArgs;
  const obj = {
    kill: () => {
      if (node) node.kill();
    },
    start: () => {
      obj.kill();
      obj.exec(storedArgs);
    },
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
    },
  };
  return obj;
}
