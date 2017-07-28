import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { TaskListContext } from './tasklist.context';
import { TasklistFormModalComponent } from './tasklist-form.component';
import * as toolbox from 'sw-toolbox';
import { PeerService } from '../shared/peer.service';

@Component({
  selector: 'my-tasklist',
  templateUrl: './tasklist.component.html'
})

export class TaskListComponent implements OnInit {

  public tasks: FirebaseListObservable<any>;
  public items: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  public nItems: Array<any> = [];
  public peerid: any;
  public anotherid: string;
  public peerconn: any;
  constructor(
    private db: AngularFireDatabase,
    private modal: SkyModalService,
    private peerservice: PeerService,
    private zone: NgZone) {

    // Setup SW Toolbox - verbose.
    toolbox.options.debug = false;
    toolbox.router.post('(.*)', toolbox.fastest);
    toolbox.router.get('/tasklist(.*)', toolbox.fastest, {
      debug: false,
      networkTimeoutSeconds: 4,
      cache: {
        name: 'tasklist-cache-v1',
        maxEntries: 10,
        maxAgeSeconds: 200
      }
    });

    // Connect to the database and get a list of tasks
    this.tasks = this.db.list('/tasks', { preserveSnapshot: true });

    // Do not close the connection! Subscribe to the connection and on each push update the user.
    this.tasks.subscribe(data => {
      this.nItems = [];
      data.forEach((x: any) => {
        this.nItems.push({
          'id': x.key,
          'person': x.val().person,
          'task': x.val().task,
          'description': x.val().description
        });

      });
      this.items.next(this.nItems.reverse());
    });
  }

  public ngOnInit() {
    this.peerservice.startPeer();

    this.peerservice.peerid.subscribe((id) => {
      this.peerid = id;
    });
    this.peerservice.msg.subscribe((message) => {
      this.zone.run(() => {
        let items = [];
        items.push(message);
        let nItems = this.nItems;
        nItems = items.concat(nItems);
        this.items.next(nItems);
      });

    });
  }

  // Skyux Modal with a form inside.
  public openModal(type: string) {

    let context = new TaskListContext();
    let windowMode: any = {
      'defaultModal': {
        'providers': [{ provide: TaskListContext, useValue: context }]
      }
    };
    // Make a modal Instance
    let modalInstance = this.modal.open(TasklistFormModalComponent, windowMode[type]);
    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      console.log('Modal closed with reason: ' + result.reason + ' and data: ' + result.data);
      this.tasks.push({
        'person': result.data.person || '',
        'task': result.data.task || '',
        'description': result.data.description || ''
      });
    });
  }
}
