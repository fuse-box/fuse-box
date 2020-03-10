describe('WebIndex integration test', () => {
  it('should refactor', () => {});
  // it('should verify webindex scripts ', async () => {
  //   const test = createTestBundle(
  //     { entry: 'index.js', homeDir: __dirname, webIndex: { template: 'index.html' } },
  //     createFileSet(__dirname, { 'index.js': 'console.log(1)', 'index.html': `$bundles` }),
  //   );
  //   await test.fuse.runDev();
  //   const indexFile = test.helper.findInDist('index.html');
  //   const scripts = test.helper.extractScripts(indexFile.contents);
  //   expect(scripts.jsPaths).toHaveLength(3);

  //   scripts.jsPaths.forEach(p => {
  //     expect(p[0]).toEqual('/');
  //   });

  //   test.mock.flush();
  // });

  // describe('public path', () => {
  //   it('should verify webindex scripts publicPath 1', async () => {
  //     const test = createTestBundle(
  //       { entry: 'index.js', homeDir: __dirname, webIndex: { template: 'index.html', publicPath: '/oi' } },
  //       createFileSet(__dirname, { 'index.js': 'console.log(1)', 'index.html': `$bundles` }),
  //     );
  //     await test.fuse.runDev();
  //     const indexFile = test.helper.findInDist('index.html');
  //     const scripts = test.helper.extractScripts(indexFile.contents);
  //     expect(scripts.jsPaths).toHaveLength(3);

  //     scripts.jsPaths.forEach(p => {
  //       expect(p).toMatch(/\/oi\//);
  //     });

  //     test.mock.flush();
  //   });

  //   it('should verify webindex scripts publicPath 2', async () => {
  //     const test = createTestBundle(
  //       { entry: 'index.js', homeDir: __dirname, webIndex: { template: 'index.html', publicPath: '.' } },
  //       createFileSet(__dirname, { 'index.js': 'console.log(1)', 'index.html': `$bundles` }),
  //     );
  //     await test.fuse.runDev();
  //     const indexFile = test.helper.findInDist('index.html');
  //     const scripts = test.helper.extractScripts(indexFile.contents);
  //     expect(scripts.jsPaths).toHaveLength(3);

  //     //const listed = test.helper.listDistFiles();

  //     scripts.jsPaths.forEach(p => {
  //       expect(p[0]).not.toEqual('/');
  //     });

  //     test.mock.flush();
  //   });
  // });

  // describe('distFileName', () => {
  //   it('should be able to customise distFileName', async () => {
  //     const test = createTestBundle(
  //       { entry: 'index.js', homeDir: __dirname, webIndex: { template: 'index.html', distFileName: 'shmindex.html' } },
  //       createFileSet(__dirname, { 'index.js': 'console.log(1)', 'index.html': `$bundles` }),
  //     );
  //     await test.fuse.runDev();
  //     const indexFile = test.helper.findInDist('shmindex.html');
  //     expect(indexFile).not.toBeUndefined();
  //     expect(indexFile.name).toMatchFilePath('shmindex.html$');
  //     test.mock.flush();
  //   });
  // });

  // describe('embedIndexedBundles', () => {
  //   it('embedIndexedBundles with dev (should be the same)', async () => {
  //     const test = createTestBundle(
  //       { entry: 'index.js', homeDir: __dirname, webIndex: { template: 'index.html', embedIndexedBundles: true } },
  //       createFileSet(__dirname, { 'index.js': 'console.log(1)', 'index.html': `$bundles` }),
  //     );
  //     await test.fuse.runDev();
  //     const indexFile = test.helper.findInDist('index.html');
  //     const scripts = test.helper.extractScripts(indexFile.contents);

  //     expect(scripts.jsPaths).toHaveLength(3);

  //     const filesInDist = test.helper.listDistFiles();

  //     expect(filesInDist).toHaveLength(7);
  //     test.mock.flush();
  //   });

  //   // it.only('embedIndexedBundles with prod (should inline js)', async () => {
  //   //   const test = createTestBundle(
  //   //     { entry: 'index.js', homeDir: __dirname, webIndex: { template: 'index.html', embedIndexedBundles: true } },
  //   //     createFileSet(__dirname, { 'index.js': 'console.log(1)', 'index.html': `$bundles` }),
  //   //   );
  //   //   await test.fuse.runProd();
  //   //   // const indexFile = test.helper.findInDist('index.html');
  //   //   // const scripts = test.helper.extractScripts(indexFile.contents);

  //   //   const filesInDist = test.helper.listDistFiles();
  //   //   console.log(filesInDist);
  //   //   test.mock.flush();
  //   // });
  // });
});
