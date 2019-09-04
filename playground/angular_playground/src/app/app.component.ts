import { Component } from '@angular/core';
import './app.component.scss';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './hello.css'],
})
export class AppComponent {
  title = 'hello';
}
