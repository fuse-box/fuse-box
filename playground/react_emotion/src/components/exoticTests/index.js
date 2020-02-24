import styled from '@emotion/styled';
import { css } from '@emotion/core';
import * as React from 'react';

export const StyledExoticButton = styled.button`
  background-color: black;
  color: ${props => props.primary ? `hotpink` : `green`};
  font-size: 12px;
  ${{ fontWeight: 'bold' }}
  font-family: Verdana, sans-serif;
`;

export const CssExoticButton = ({ primary, children }) => (
  <button css={css`
    background-color: black;
    color: ${primary ? `hotpink` : `green`};
    font-size: 12px;
    ${{ fontWeight: 'bold' }}
    font-family: Verdana, sans-serif;
  `}>
    {children}
  </button>
);

export default null;

