import * as React from 'react';

export const Button = ({ children, onClick = () => {} }) => (
  <button onClick={onClick}>{children}</button>
);

export default null;
