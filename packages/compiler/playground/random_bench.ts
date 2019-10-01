import { bench, getRandomInt } from './bench';
import { ADDRGETNETWORKPARAMS } from 'dns';
import * as Big from 'big.js';
const b = bench({ iterations: 100000 });

const benchPushAndIndex = () => {
  const arr1 = [];
  const arr2 = [];
  b.measure('push', i => {
    arr1.push(i);
  });

  b.measure('index[]', i => {
    arr2[arr2.length] = i;
  });
  b.start();
};

const benchArrayCheck = () => {
  b.measure('Array.inArray', () => {
    const res = Array.isArray(getRandomInt(1, 10) === 5 ? [] : true);
  });

  b.measure('Array instance of', () => {
    const d = getRandomInt(1, 10) === 5 ? [] : true;
    const res = d instanceof Array;
  });

  b.start();
};

const benchIndexOf = () => {
  const data = [];
  for (let i = 0; i < 10000; i++) {
    data.push(i);
  }

  b.measure('indexOf', () => {
    data.indexOf(getRandomInt(1, 10000));
  });

  // b.measure("findIndex", () => {
  //   data.findIndex(i => i === getRandomInt(1, 10000));
  // });

  b.measure('includes', () => {
    data.includes(getRandomInt(1, 10000));
  });
  b.start();
};

//benchIndexOf();

function benchArrVersusObj() {
  const arr = [];
  const obj = {};
  for (let i = 0; i < 10000; i++) {
    arr.push(i);
    obj[i] = 1;
  }

  b.measure('Array.indexOf', () => {
    arr.indexOf(getRandomInt(1, 10000));
  });
  b.measure('Array.includes', () => {
    arr.includes(getRandomInt(1, 10000));
  });

  b.measure('in object', () => {
    if (obj[getRandomInt(1, 10000)]) {
    }
  });

  b.start();
}

function benchObjCopy() {
  const b = bench({ iterations: 1000 });
  const arr = [];
  const obj = {};
  for (let i = 0; i < 10000; i++) {
    obj[i] = 1;
  }

  b.measure('for const key in obj', () => {
    const newArray: any = {};
    for (const key in obj) {
      newArray[key] = 1;
    }
  });

  b.measure('spread operator', () => {
    const newArray = { ...obj };
  });

  b.measure('Object.assign', () => {
    Object.assign({}, obj);
  });

  b.start();
}
//benchObjCopy();
//benchArrVersusObj();

function benchIterators() {
  const b = bench({ iterations: 1000 });
  const arr = [];

  for (let i = 0; i < 10000; i++) {
    arr.push(i);
  }

  b.measure('for (const i of arr) {}', () => {
    for (const i of arr) {
    }
  });

  b.measure('while(i < arr.length){ i++ }', () => {
    let i = 0;
    while (i < arr.length) {
      i++;
    }
  });

  b.start();
}

///benchIterators();

//console.log('5' + ('5' * '20') / '10');

function benchCompute() {
  const b = bench({ iterations: 1000 });
  const arr = [];

  b.measure('Big', () => {
    Big('5')
      .plus('5')
      .times('20')
      .div('10')
      .toString();
  });

  b.measure('parseFloat', () => {
    parseFloat('5') + (parseFloat('5') * parseFloat('20')) / parseFloat('10');
  });

  b.start();
}
benchCompute();
