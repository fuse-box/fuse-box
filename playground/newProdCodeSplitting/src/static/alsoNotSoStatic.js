async function load() {
  const dynamicFunc = await import('../dynamic/dynamic');
  dynamicFunc();
}

export const alsoNotSoStaticFunc = () => {
  console.log('hi, my name is alsoNotSoStaticFunc');

  load();
}
