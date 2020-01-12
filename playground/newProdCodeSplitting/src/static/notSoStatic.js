async function load() {
  const dynamicFunc = await import('../dynamic/dynamic');
  dynamicFunc();
}

export const notSoStaticFunc = () => {
  console.log('hi, my name is notSoStaticFunc');

  load();
}
