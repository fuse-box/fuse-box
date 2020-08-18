const a: any = { b: { c: () => 'yes' } };

const res = typeof a !== 'undefined' && typeof a.b !== 'undefined' ? a.b.c() : void 0;
console.log(res);
