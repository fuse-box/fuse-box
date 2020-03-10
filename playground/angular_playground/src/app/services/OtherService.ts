import { Injectable } from '@angular/core';

@Injectable({
  // we declare that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class OtherService {
  getSome() {
    return [1, 2, 3];
  }
}
