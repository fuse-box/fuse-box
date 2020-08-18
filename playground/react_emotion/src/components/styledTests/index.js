import styled from '@emotion/styled';
import * as React from 'react';

const RegularDiv = styled.div({
  backgroundColor: 'orange',
  color: 'white'
});
const Container = styled.div(props => ({
  display: 'flex',
  flexDirection: props.column && 'column',
  width: '50%'
}));

// regular button
const Button = styled.button`
  color: turquoise;
`;
// button with props
const ButtonWithProps = styled.button`
  ${props => props.primary
    ? `color: hotpink;`
    : `color: green;`
  }
`;

const RegularDivTTE = styled('div')`
	background-color: black;
  color: white;
`;
const RegularDivOE = styled('div')({
  backgroundColor: 'red',
  color: 'white'
});
// Styling any component
const Basic = ({ className }) => (
  <div className={className}>Some text</div>
);
const Fancy = styled(Basic)`
  color: hotpink;
`;

export const StyledTests = () => (
  <div>
    <h1>🚀 Jättesnabb 🚀</h1>
    <Button>Super simple button</Button>
    <h2>🚀 Jättesnabb 🚀</h2>
    <Container column>
      <ButtonWithProps>This is a regular button.</ButtonWithProps>
      <ButtonWithProps primary>This is a primary button.</ButtonWithProps>
    </Container>
    <h2>🚀 Jättesnabb 🚀</h2>
    <Container>
      <RegularDivTTE>RegularDivTTE</RegularDivTTE>
      <RegularDivOE>RegularDivOE</RegularDivOE>
      <RegularDiv>RegularDiv</RegularDiv>
    </Container>
    <Fancy />
  </div>
);

export default null;
