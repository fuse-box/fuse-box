console.log('no hey');
// if (process.env.NODE_ENV) {
//   console.log('that is for dev');
// }

if (FuseBox.isServer) {
  console.log('is server');
}

if (FuseBox.isBrowser) {
  console.log('is browser');
}
