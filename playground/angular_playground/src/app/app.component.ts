import { Component } from '@angular/core';
import { HeroService } from './services/HeroService';
import { OtherService } from './services/OtherService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'hello!1!!';
  constructor(private heroService: HeroService, otherService: OtherService) {
    console.log(otherService);
    console.log(heroService.getHeroes());
  }
}
