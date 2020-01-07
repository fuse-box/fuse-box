const { dynamicFunc } = import('../dynamic/')

export const alsoNotSoStaticFunc = () => {
  console.log('hi, my name is alsoNotSoStaticFunc');

  dynamicFunc();
}
