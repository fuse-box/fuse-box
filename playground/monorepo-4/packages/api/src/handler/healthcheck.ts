import 'reflect-metadata';

import { Container } from 'typedi';

import AWSSdk from '#/aws-sdk';

import { assertResult } from '#/core/utils';

export function getSomething() {
    const myThing = Container.get(AWSSdk.S3);
    assertResult(myThing, 'S3');
    return myThing;
}