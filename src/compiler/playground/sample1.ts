import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public name: string;
  public shit: SomeShit;
  constructor(public env: Kakka, runka: Sukka) {}

  @pissa
  method1(kakka: any): Makka {
    return 1;
  }

  @paska()
  @pissa()
  method2(@runka kakka: Kakkenen, another: AnotherKakka, baba: string): Makka {
    return 1;
  }
}
