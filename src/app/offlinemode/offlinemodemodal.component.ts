import { Component } from '@angular/core';
import { SkyModalInstance } from '@blackbaud/skyux/dist/core';
import { OfflineModeContext } from './offlinemode.context';

@Component({
  selector: 'offline-mode-modal',
  templateUrl: './offlinemodemodal.component.html'
})

export class OfflineModeModalComponent {
  constructor(public context: OfflineModeContext, public instance: SkyModalInstance) { }
}
