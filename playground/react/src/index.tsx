import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';

import { Application } from './components/application/Application';
import { some } from './foo';
// import stuff from 'stuff/Stuff';
// console.log(stuff);
import * as whitespaces from './whitespaces';
console.log('whitespaces', whitespaces);

import something from './something';
console.log('oi', some);
console.log('shut');
console.log(something);

const App = () => {
  useEffect(() => {});

  return <Application />;
};

ReactDOM.render(<App />, document.getElementById('root'));
console.log('here');
