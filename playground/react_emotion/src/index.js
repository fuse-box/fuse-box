import * as React from 'react';
import { hydrate, render, unmountComponentAtNode } from 'react-dom';

import { App } from './app';

const reactRootId = 'app';
const appNode = document.getElementById(reactRootId);

if (!appNode) {
  throw new Error(`Can't find the "${reactRootId}" element in the document`);
}

render(<App />, appNode);
