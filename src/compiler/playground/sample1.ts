import { Component, ChangeDetectionStrategy, Renderer2 } from '@angular/core';
import { AppInitService } from '../shared/fusing/app-init.service';
import { PlatformService } from '../shared/fusing/platform.service';

@Component({
  selector: 'pm-app',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(rdr: Renderer2, ais: AppInitService, ps: PlatformService) {
    if (ps.isElectron) {
      ais.init(rdr);
    }
  }
}
