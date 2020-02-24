import { Global, css } from '@emotion/core';
import emotionNormalize from 'emotion-normalize';
import * as React from 'react';

const globalStyles = css`
  ${emotionNormalize}

  body {
    text-rendering: optimizeLegibility;
  }
  div#app {
    font-family: Poppins, sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
`;

export const GlobalStyle = () => (
  <Global styles={globalStyles} />
);

export default null;
