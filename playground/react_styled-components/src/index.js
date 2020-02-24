import * as React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import { App } from './app';

const reactRootId = 'app';
const appNode = document.getElementById(reactRootId);

if (!appNode) {
  throw new Error(`Can't find the "${reactRootId}" element in the document`);
}

const StyledDiv = styled.div`
  font-size: 5em;
  color: red;
`;

render(<StyledDiv><span>Foo</span></StyledDiv>, appNode);
