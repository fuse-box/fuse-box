import { getSpinner as Spinner } from './Spinner';
import { setInterval } from 'timers';

const spinner = new Spinner();

spinner.start();
let i = 0;
setInterval(() => {
  spinner.text = `Loading..${i}`;
  i++;
}, 200);
setTimeout(() => {
  spinner.stop();
}, 5000);
