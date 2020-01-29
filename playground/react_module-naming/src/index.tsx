import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';

import { logger } from './react';

const App = () => {
  useEffect(() => {
    logger("I'm a hook");
  });

  return <div>Hello, world!</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
