const { dynamicFunc } = import('../dynamic/')

export const notSoStaticFunc = () => {
  console.log('hi, my name is notSoStaticFunc');

  dynamicFunc();
}
