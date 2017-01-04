import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ComponentA2, ComponentB } from './components';
import ComponentA from './components/componentA';


import "./hello.html";

ReactDOM.render(
    <div>
        <ComponentA></ComponentA>
        <ComponentA2></ComponentA2>
        <ComponentB></ComponentB>
    </div>
    ,
    document.getElementById('example')
);
