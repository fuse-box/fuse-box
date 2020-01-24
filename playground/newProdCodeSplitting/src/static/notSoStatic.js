async function load() {
  const dynamicFunc = await import('../dynamic/dynamic');
  const dynamicFuncTwo = await import('../dynamic/dynamicTwo');
  dynamicFunc();
  dynamicFuncTwo();
}

export const notSoStaticFunc = () => {
  console.log('hi, my name is notSoStaticFunc');

  load();
};
