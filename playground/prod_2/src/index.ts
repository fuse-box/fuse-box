//import './main.scss';
import * as some from './text/some.scss';
console.log('some', some);

import './hello.css';
import * as components from './components';

// import '@uirouter/angular-hybrid/';
// angular.module('myApp', ['ui.router', 'ui.router.upgrade']);
// angular.bootstrap(document, ['myApp']);

// console.log(components);
function hello() {}

class FooBarka {
  constructor() {
    console.log('oi oi');
  }

  public oi() {
    console.log('oi');
  }
}
const bar = new FooBarka();
console.log(1);

document.querySelector('#root').addEventListener('click', () => {
  bar.oi();
});
console.log('yes');

const myWorker = new Worker('./worker/worker.ts');
myWorker.onmessage = function(e) {
  console.log('Message received from worker');
};
