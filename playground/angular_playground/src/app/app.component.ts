import { Component } from '@angular/core';
import { HeroService } from './services/HeroService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'hello world! YO';
  constructor(heroService: HeroService) {
    console.log(heroService.getHeroes());
  }
}
