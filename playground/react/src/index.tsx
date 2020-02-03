import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';

import { Application } from './components/application/Application';
import { some } from './foo';
import { logger } from './react';
// console.log(some);
// import stuff from 'stuff/Stuff';
// console.log(stuff);

console.log(some);
function some(some) {}
const App = () => {
  useEffect(() => {
    logger("I'm a hook");
  });

  return <Application />;
};

ReactDOM.render(<App />, document.getElementById('root'));
console.log('here');
