async function load() {
  const dynamicFunc = await import('../dynamic/dynamic');
  dynamicFunc.default();
}

export const alsoNotSoStaticFunc = () => {
  console.log('hi, my name is alsoNotSoStaticFunc');

  load();
};
