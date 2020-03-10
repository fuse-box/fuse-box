import * as React from 'react';

import { CssTests } from '../../components/cssTests';
import { CustomCssTests } from '../../components/customCssTests';
import { CustomStyledTests } from '../../components/customStyledTests';
import { CssExoticButton, StyledExoticButton } from '../../components/exoticTests';
import { StyledTests } from '../../components/styledTests';

export const Home = ({ children }) => (
  <div style={{
    alignItems: 'stretch',
    flex: '1 0 auto',
    flexDirection: 'column',
    flexGrow: '1'
  }}>
    {children}
    {/* <!-- Components that use the css fn --> */}
    <CssTests />

    {/* <!-- Components that use a custom specified css fn --> */}
    <CustomCssTests />

    {/* <!-- Exotic edge case test --> */}
    <StyledExoticButton primary>
      This StyledButton has the primary prop
    </StyledExoticButton>
    <StyledExoticButton>
      This StyledButton doesn't
    </StyledExoticButton>
    <CssExoticButton primary>
      This CssButton  has the primary prop
    </CssExoticButton>
    <CssExoticButton>
      This CssButton doesn't
    </CssExoticButton>

    {/* <!-- Components that use the styled fn --> */}
    <StyledTests />
    {/* <!-- Components that use a custom specified styled fn --> */}
    <CustomStyledTests />
  </div>
);

export default null;
