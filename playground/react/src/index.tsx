import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Application } from './components/application/Application';
import some from './foo';
console.log(some);
import stuff from 'stuff/Stuff';
console.log(stuff);
ReactDOM.render(<Application />, document.getElementById('root'));
console.log('here');
