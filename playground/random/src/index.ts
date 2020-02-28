console.log('hello world');
// import * as lodash from 'lodash-es';
// console.log(lodash);

// import * as one from './bench/one/Three';
// import * as three from './bench/three/Three';
// import * as two from './bench/two/Three';

//console.log(one, two, three);
// import foo from 'proj4/lib/constants/Ellipsoid.js';

import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
sprite.tint = 0xff0000;
sprite.position.set(0, 0);
sprite.width = 50;
sprite.height = 50;
console.log(sprite);
app.stage.addChild(sprite);
