import { Component, OnInit } from '@angular/core';
import { SkyModalInstance } from '@blackbaud/skyux/dist/core';
import { TaskListContext } from './tasklist.context';
import { PeerService } from '../shared/peer.service';

@Component({
  selector: 'tasklist-form-modal',
  templateUrl: './tasklist-form.component.html'
})

export class TasklistFormModalComponent implements OnInit {
  public peerid: string;

  constructor(
    public context: TaskListContext,
    public instance: SkyModalInstance,
    private peerservice: PeerService) { }

  public ngOnInit() {
    this.peerservice.getPeerId()
      .subscribe(item => this.peerid = item);
  }
}
