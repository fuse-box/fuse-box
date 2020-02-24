import { css as emotionCss } from '@emotion/core';
import * as React from 'react';

const h1styles = emotionCss`
  color: hotpink;
`;

export const CustomCssTests = () => (
  <h1 css={h1styles}>🚀 Jättesnabb 🚀</h1>
);

export default null;
