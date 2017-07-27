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
  public friend: string;

  constructor(
    public context: TaskListContext,
    public instance: SkyModalInstance,
    private peerservice: PeerService) { }

  public ngOnInit() {
    this.peerservice.peerid.subscribe((id) => {
      this.peerid = id;
    });

  }

  public collaborate() {
    let obj = {
      'id': 999999,
      'task': this.context.task,
      'person': this.context.person,
      'description': this.context.description
    };
    this.peerservice.send(this.friend, obj);

  }
}
