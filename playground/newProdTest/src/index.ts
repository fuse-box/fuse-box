//import * as oi from 'foo';

import './index.scss';
import { util } from './utils';

import styled from '@emotion/styled';
import * as React from 'react';
import React from 'react';
import React, { Fragment } from 'react';
import './foo';
import { bar, foo } from './foo';
import { joo, test as something } from './superAwesome';
const bar = require('./foo');
const baz = 'foo';
import _ = require('./foo');

console.log('hello world');

async function aaaa() {
  const res = await import('./split');
  console.log(res);
}
util();

async function aaaa() {
  const res = await import('./split');
}
const dynImp1 = () => import('./dyn/dyn1');
const dynImp2 = import('./dyn/dyn2');
const dynImp3Ignore = import('./dyn/dyn3');
