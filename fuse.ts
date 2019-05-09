import { sparky } from './src/sparky/sparky';

class Context {}
const { src } = sparky(Context);

async function a() {
  await src('src/**/**.ts')
    .tsc({ target: 'ES2017' })
    .exec();
}
a()
  .then(() => {
    console.log('good');
  })
  .catch(e => {
    console.error(e);
  });
