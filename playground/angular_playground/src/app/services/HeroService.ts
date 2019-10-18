import { Injectable } from '@angular/core';

@Injectable({
  // we declare that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class HeroService {
  getHeroes() {
    return [1, 2, 3];
  }
}
