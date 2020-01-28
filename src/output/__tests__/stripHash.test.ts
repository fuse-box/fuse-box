import { stripHash } from '../distWriter';

describe('Strip hash', () => {
  const scenarions = [
    { input: '$name.$hash.js', value: '$name.js' },
    { input: '$name.$hash.css', value: '$name.css' },
    { input: '$name.$hash.scss', value: '$name.scss' },
    { input: '$name.js', value: '$name.js' },
    { input: '$hash.$name.js', value: '$name.js' },
    { input: '$hash.$name.scss', value: '$name.scss' },

    { input: '$name-$hash.js', value: '$name.js' },
    { input: '$name-$hash.css', value: '$name.css' },
    { input: '$name-$hash.scss', value: '$name.scss' },

    { input: '$name_$hash.js', value: '$name.js' },
    { input: '$name_$hash.css', value: '$name.css' },
    { input: '$name_$hash.scss', value: '$name.scss' },
  ];
  for (const item of scenarions) {
    it(`${item.input} => ${item.value}`, () => {
      expect(stripHash(item.input)).toEqual(item.value);
    });
  }
});
