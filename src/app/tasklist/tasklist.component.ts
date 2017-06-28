import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { TaskListContext } from './tasklist.context';
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
    private db: AngularFireDatabase,
    private modal: SkyModalService) {

    /*
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
*/
    // Setup SW Toolbox - verbose.
    
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
    
    // Connect to the database and get a list of tasks
    this.tasks = db.list('/tasks', { preserveSnapshot: true });
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
  // Skyux Modal with a form inside. 
  public openModal(type: string) {
    let context = new TaskListContext();
    let windowMode: any = {
      'defaultModal': {
        'providers': [{ provide: TaskListContext, useValue: context }]
      }
    };
    // Make a modal Instance

  }
}
