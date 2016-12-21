import * as React from 'react';
import { render } from 'react-dom';
import App from './App';

const props = { store: 'someStore' };

render(<App />, document.getElementById('root'));