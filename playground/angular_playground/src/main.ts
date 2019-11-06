import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { rem } from 'csx';
console.log(rem(5));

if (environment.production) {
  enableProdMode();
}
import * as shit from '@ngx-translate/core';
console.log(shit);

console.log(require('hammerjs'));
import { MatDialogRef, MatDialogConfig } from '@angular/material';
const dialogConfig = new MatDialogConfig();

console.log(dialogConfig);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
