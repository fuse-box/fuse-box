//import './main.scss';
import './hello.css';
//import './oops/Another';
//import './oops/Oops';
// import * as some from './text/some.scss';
// console.log('some', some);

// import '@uirouter/angular-hybrid/';
// angular.module('myApp', ['ui.router', 'ui.router.upgrade']);
// angular.bootstrap(document, ['myApp']);

// console.log(components);
function hello() {}

// const bar = new FooBarka();
// console.log(1);

// document.querySelector('#root').addEventListener('click', () => {
//   bar.oi();
// });

// const myWorker = new Worker('./worker/worker.ts');
// myWorker.postMessage(['hello']);
// myWorker.onmessage = function(e) {
//   console.log('Message received from worker', e);
// };
console.log('here');

document.querySelector('h1').addEventListener('click', () => {
  someStuff();
});

async function someStuff() {
  console.log('start');
  const module = await import('./lazy/lazy_main');
  console.log('shiiiet', module.lazyMain());
}
