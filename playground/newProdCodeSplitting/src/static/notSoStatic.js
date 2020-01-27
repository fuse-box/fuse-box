async function load() {
  const dynamicFunc = await import('../dynamic/dynamic');
  const dynamicFuncTwo = await import('../dynamic/dynamicTwo');
  dynamicFunc.default();
  dynamicFuncTwo.default();
}

export const notSoStaticFunc = () => {
  console.log('hi, my name is notSoStaticFunc');

  load();
};
