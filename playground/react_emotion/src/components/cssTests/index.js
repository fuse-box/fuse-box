import { css } from '@emotion/core';
import * as React from 'react';

const styles1 = css`
  width: 50%;
  text-align: center;
  background: url('this-super-dope-logo.jpg');
  h1,
  h2,
  h3,
  h4 {
    color: hotpink;
  }
  ${{ color: 'white' }}
  ${css`
    background-color: white;
  `}
  ${'' /* font-size: 12px; */}
`;

const h1styles = css`
  color: hotpink;
`;
const h2styles = css`
  ${css`
    color: deeppink
  `}
`;
const h3styles = css({
  backgroundColor: 'white',
  color: 'fuchsia'
});

export const CssTests = () => (
  <div css={styles1}>
    <h1 css={h1styles}>🚀 Jättesnabb 🚀</h1>
    <h2 css={h2styles}>🚀 jättesnabb 🚀</h2>
    <h3 css={h3styles}>🚀 Jättesnabb 🚀</h3>
    <h4>🚀 jättesnabb 🚀</h4>
    <h5 css={css`
      color: lime;
    `}>🚀 Jättesnabb 🚀</h5>
  </div>
);


export default null;


