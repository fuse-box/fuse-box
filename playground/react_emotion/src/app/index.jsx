import { css } from '@emotion/core';
import React, { Fragment } from 'react';

import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Home } from '../screens/home';
import { GlobalStyle } from '../theme/fuse';
const styles1 = css({
  backgroundColor: 'hotpink'
});

const styles2 = css({
  color: 'white'
});

export const App = () => (
  <Fragment>
    <GlobalStyle />
    <Header />
    <Home>
      <div css={css`background-color: hotpink; color:white;`}>Super Duper</div>
      <div css={[styles1, styles2]}>Super Duper Useful</div>
      <div css={{ backgroundColor: 'hotpink', color: 'white' }}>Super Duper</div>
    </Home>
    <Footer />
  </Fragment>
);

export default null;
