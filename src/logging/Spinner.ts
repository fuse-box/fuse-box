import { spawn } from 'child_process';
import * as path from 'path';
import { env } from '../env';

function sendAction(action: string, args?: Array<any>) {
  const obj: any = { action };
  if (args) {
    obj.args = args;
  }
  return JSON.stringify(obj);
}
export interface ISpinnerInterface {
  start: () => void;
  setText: (str: string) => void;
  stop: () => void;
}
export interface ISpinnerProps {
  onStop: () => void;
}
export function getSpinner(props?: ISpinnerProps): ISpinnerInterface {
  var options = {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  };

  const pathToSpinner = path.join(env.FUSE_MODULES, 'fuse-box-spinner/launch.js');
  var args = [pathToSpinner];
  const spinner = spawn('node', args, options);

  return {
    start: () => {
      spinner.send(sendAction('start'));
    },
    setText: str => {
      spinner.send(sendAction('text', [str]));
    },
    stop: () => {
      if (props && props.onStop) props.onStop();
      spinner.send(sendAction('stop'));
    },
  };
}
