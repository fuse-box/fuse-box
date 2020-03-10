import 'reflect-metadata';

function f() {
  console.log('f(): evaluated');
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('f(): called');
  };
}

function g() {
  console.log('g(): evaluated');
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('g(): called');
  };
}

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

function enumerable(value: boolean) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

const formatMetadataKey = Symbol('format');

function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}

class WithPropDecor {
  @format('Hello, %s')
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
}

@sealed
class C {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @f()
  @g()
  method() {}

  @enumerable(false)
  greet() {
    return 'Hello, ' + this.greeting;
  }
}

export default class {
  @f()
  some() {}
}

function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {}
class ParamDec {
  greet(@required name: string) {
    return 'Hello';
  }
}
