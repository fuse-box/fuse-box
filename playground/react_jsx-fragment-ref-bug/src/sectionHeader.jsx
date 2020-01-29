import { css } from '@emotion/core'
import React from 'react';

const styles = css`
  color: white;
`;

export const SectionHeader = ({ breadcrumbs, header }) => (
  <>
    <label css={styles}>{header}</label>
    {breadcrumbs.map(({ link, text }, key) => (<a href={link} key={key}>{text}</a>))}
  </>
)
