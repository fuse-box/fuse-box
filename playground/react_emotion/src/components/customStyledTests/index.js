// this doesn't work in FuseBox... / so no need to test???
// import styled as emotionStyled from '@emotion/styled';
import styled from '@emotion/styled';

import * as React from 'react';

const RegularDiv = styled.div({
  backgroundColor: 'darkorange',
  color: 'white'
});

export const CustomStyledTests = () => <RegularDiv>RegularDiv</RegularDiv>;

export default null;
