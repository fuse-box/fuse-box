async function load() {
  console.log('loading ../dynamic/dynamic...');
  const dynamicFunc = await import('../dynamic/dynamic');
  console.log('loading ../dynamic/dynamic... DONE');
  dynamicFunc.default();
}

export const alsoNotSoStaticFunc = () => {
  console.log('hi, my name is alsoNotSoStaticFunc');

  load();
};
