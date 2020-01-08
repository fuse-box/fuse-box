import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import '@angular/cdk/esm2015/bidi/directionality';
if (environment.production) {
  enableProdMode();
}
console.log(3);

import { MatDialogRef, MatDialogConfig } from '@angular/material';
const dialogConfig = new MatDialogConfig();

console.log(dialogConfig);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
