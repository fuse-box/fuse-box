const { join } = require('path');
require('ts-node').register({
  dir: __dirname,
  project: join(__dirname, 'tsconfig.json'),
  transpileOnly: true,
});
require('./fuse');
