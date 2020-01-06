import { bench } from './bench';
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

  b.measure('variable.constructor === Array', () => {
    const d = getRandomInt(1, 10) === 5 ? [] : true;
    const res = d.constructor === Array;
  });

  b.start();
};
//benchArrayCheck();

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
  const b = bench({ iterations: 100 });
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
//benchCompute();
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function benchStuff() {
  const b = bench({ iterations: 1000 });
  const arr = [];

  const Chars = {
    NonBreakingSpace: 12288,
    ZeroWidthNoBreakSpace: 234234,
    ByteOrderMark: 34252345,
    Ogham: 241234,
    MathematicalSpace: 1234123,
    NarrowNoBreakSpace: 123412,
    EnQuad: 600,
    ZeroWidthSpace: 900,
    NextLine: 8,
    IdeographicSpace: 23452345,
  };
  function isUnicodeOnlySpace1(code: number): boolean {
    return (
      code === Chars.NonBreakingSpace ||
        code === Chars.ZeroWidthNoBreakSpace ||
        code === Chars.ByteOrderMark ||
        code === Chars.Ogham ||
        (code >= Chars.EnQuad && code <= Chars.ZeroWidthSpace),
      code === Chars.NarrowNoBreakSpace ||
        code === Chars.MathematicalSpace ||
        code === Chars.NextLine ||
        code === Chars.IdeographicSpace
    );
  }

  b.measure('isUnicodeOnlySpace1', () => {
    const code = getRandomInt(0, 23452345);
    isUnicodeOnlySpace1(code);
  });

  const valid = {
    [Chars.NonBreakingSpace]: Chars.NonBreakingSpace,
    [Chars.ZeroWidthNoBreakSpace]: Chars.ZeroWidthNoBreakSpace,
    [Chars.ByteOrderMark]: Chars.ZeroWidthNoBreakSpace,
    [Chars.Ogham]: Chars.ByteOrderMark,
    [Chars.MathematicalSpace]: Chars.MathematicalSpace,
    [Chars.NarrowNoBreakSpace]: Chars.NarrowNoBreakSpace,
    [Chars.NextLine]: Chars.NextLine,
    [Chars.IdeographicSpace]: Chars.IdeographicSpace,
  };
  valid[4];

  b.measure('valid', () => {
    const code = getRandomInt(0, 23452345);
    const res = valid[code];
    //res >= Chars.EnQuad && res <= Chars.ZeroWidthSpace;
  });

  const alt = [
    Chars.NonBreakingSpace,
    Chars.ZeroWidthNoBreakSpace,
    Chars.ZeroWidthNoBreakSpace,
    Chars.ByteOrderMark,
    Chars.MathematicalSpace,
    Chars.NarrowNoBreakSpace,
    Chars.NextLine,
    Chars.IdeographicSpace,
  ];

  const s = new Set(alt);

  b.measure('alt', () => {
    const code = getRandomInt(0, 23452345);
    s.has(code);
    //res >= Chars.EnQuad && res <= Chars.ZeroWidthSpace;
  });

  b.start();
}

benchStuff();
