import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import './main.scss';

if (environment.production) {
  enableProdMode();
}
console.log(3);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
