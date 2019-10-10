import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { rem } from 'csx';
console.log(rem(5));

if (environment.production) {
  enableProdMode();
}

console.log('well!!');

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
