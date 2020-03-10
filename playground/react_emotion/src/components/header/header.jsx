import { css } from '@emotion/core';
import styled from '@emotion/styled';
import * as React from 'react';
import { useState } from 'react';

import logo from '../../assets/fuse-box-logo.svg';
import github from '../../assets/github.svg';
import hamburger from '../../assets/hamburger.svg';

const navItemStyles = props => css`
  float: left;
  display: block;
  color: #f2f2f2;
  text-decoration: none;
  padding: 0 16px;
  text-align: center;
  vertical-align: middle;
  line-height: 56px;

  &:hover {
    background-color: #515151;
  }

  ${props.active
    ? `
      background-color: #1d79bf;
      color: white;
      `
    : ``
  }
`;

const StyledLogoItem = styled('a')`
  float: ${props => props.float || 'left'};
  display: block;
  width: ${props => props.width || '40px'};
  height: ${props => props.height || props.width || '40px'};
  padding: ${props => props.width ? Math.round((56 - parseInt(props.width, 10)) / 2) : 8}px;
  margin-left: 12px;
  margin-right: 12px;
`;

const hamburgerStyles = css({
  cursor: 'pointer',
  display: 'none',
  height: '30px',
  lineHeight: '0',
  padding: '16px 13px 10px',
  position: 'absolute',
  right: 0,
  textAlign: 'center',
  top: 0,
  verticalAlign: 'middle',
  width: '30px'
});

const NavigationContainer = styled.div`
  background-color: #223351;
  overflow: hidden;

  @media screen and (max-width: 600px) {
    a:not(:first-of-type) {
      display: none;
    }
    a.icon {
      display: block;
    }
  }

  @media screen and (max-width: 600px) {
    ${props => props.showNav
    ? `
      position: relative;
      > .github-text {
        display: block;
      }
      > .github-logo {
        display: none !important;
      }
      > a.icon {
        background-color: #1d79bf;
      }

      > a {
        float: none;
        display: block !important;
        text-align: left;
      }
      `
    : ``
  }
  }
`;

const NavigationItem = ({ active, children, style, to }) => (
  <a css={navItemStyles({ active })} href={to} style={style}>
    {children}
  </a>
);

export const Header = () => {
  const [showNav, updateShowNav] = useState(false);

  return (
    <NavigationContainer showNav={showNav}>
      <StyledLogoItem href='/'>
        <img alt='FuseBox Logo' height='100%' src={logo} />
      </StyledLogoItem>
      <NavigationItem to='#news'>
        Documentation
      </NavigationItem>
      <NavigationItem to='#about'>
        Plugins
      </NavigationItem>
      <NavigationItem to='#about'>
        Release notes
      </NavigationItem>
      <NavigationItem style={{ display: 'none' }} to='https://github.com/fuse-box/fuse-box'>
        Github
      </NavigationItem>
      <StyledLogoItem className='github-logo' float='right' href='https://github.com/fuse-box/fuse-box' width='32px'>
        <img alt={`FuseBox's github`} src={github} />
      </StyledLogoItem>
      <a className='icon' css={hamburgerStyles} onClick={() => updateShowNav(!showNav)}>
        <img alt='Show top navigation' src={hamburger} />
      </a>
    </NavigationContainer>
  );
};
