import 'reflect-metadata';

import { SigningKey, JwksClient } from 'jwks-rsa';
import jwks = require('jwks-rsa');
import { Container, Inject, Service, Token } from 'typedi';

import { assertResult } from '#/core/utils';

export function getSigningKey(jwksUri: string, kid: string): Promise<SigningKey> {
    return new Promise((resolve, reject) => {
        try {
            const jwksClient = jwks({ jwksUri });
            jwksClient.getSigningKey(kid, (err, key) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(key);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

export function getSomething() {
    const myThing = Container.get('hello');
    assertResult(myThing, 'hello');
    return myThing;
}