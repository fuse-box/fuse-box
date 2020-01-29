import { createPublicKey } from 'crypto';
import * as React from 'react';
import { Details } from '../details/Details';
import './Application.scss';

export function Application() {
  function click() {
    const result = process.env.NODE_ENV;
    console.log('i am clicked', result);
  }
  return (
    <div className="Application">
      <div className="top">
        <div className="logo" />
      </div>
      <div className="welcome" onClick={click}>
        FuseBox ❤️ JSX/TSX!!!
      </div>

      <Details />
    </div>
  );
}
