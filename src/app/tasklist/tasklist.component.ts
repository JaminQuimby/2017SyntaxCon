import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { TaskListContext } from './tasklist.context';
import { TaskListModalComponent } from './tasklistmodal.component';
import * as toolbox from 'sw-toolbox';

@Component({
  selector: 'my-tasklist',
  templateUrl: './tasklist.component.html'
})
export class TaskListComponent {
  public tasks: FirebaseListObservable<any>;
  public items: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  public nItems: Array<any> = [];
  private user: Object;
  constructor(
    private af: AngularFire,
    private modal: SkyModalService) {
    this.af.auth.subscribe(user => {
      if (user) {
        // user logged in
        this.user = user;
      }
      else {
        // user not logged in
        this.user = {};
      }
    });
    toolbox.options.debug = false;
    toolbox.router.post('(.*)', toolbox.networkFirst);
    toolbox.router.get('/tasklist(.*)', toolbox.networkFirst, {
      debug: false,
      networkTimeoutSeconds: 4,
      cache: {
        name: 'tasklist-cache-v1',
        maxEntries: 10,
        maxAgeSeconds: 200
      }
    });

    this.tasks = af.database.list('/tasks', { preserveSnapshot: true });
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

  public openModal(type: string) {
    let context = new TaskListContext();
    let windowMode: any = {
      'defaultModal': {
        'providers': [{ provide: TaskListContext, useValue: context }]
      }
    };
    let modalInstance = this.modal.open(TaskListModalComponent, windowMode[type]);
    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      console.log('Modal closed with reason: ' + result.reason + ' and data: ' + result.data);
      console.log(result.data.description)
      this.tasks.push({
        'person': result.data.person || '',
        'task': result.data.task || '',
        'description': result.data.description || ''
      });
    });
  }
}
