import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { TaskListModel } from './tasklist.model';
import { TasklistFormComponent } from './tasklist-form.component';
import * as toolbox from 'sw-toolbox';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'my-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['tasklist.component.scss']
})

export class TaskListComponent implements OnInit {
  public tasks: FirebaseListObservable<Array<firebase.database.DataSnapshot>>;
  public taskView: BehaviorSubject<Array<TaskListModel>> = new BehaviorSubject([]);

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
    private modal: SkyModalService) {

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

  }
  public ngOnInit() {
    this.auth.org$.subscribe(org => this.getTasksBy(org.id));
  }

  // Skyux Modal with a form inside.
  public openModal(task?: TaskListModel) {
    let model = new TaskListModel();
    if (task) { model = task; }
    let windowMode: any = {
      'defaultModal': {
        'providers': [{ provide: TaskListModel, useValue: model }]
      }
    };
    // Make a modal Instance
    let modalInstance = this.modal.open(TasklistFormComponent, windowMode['defaultModal']);
    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      this.save(Object.assign(new TaskListModel(), result.data));
    });
  }
  protected remove(id: string) {
    this.tasks.remove(id);
  }
  private save(task: TaskListModel) {
    if (task.id) {
      this.tasks.update(task.id, task);
    } else {
      this.tasks.push(task);
    }
  }

  private updateView(tasks: Array<TaskListModel>, reverse?: boolean) {
    if (reverse) {
      this.taskView.next(tasks.reverse());
    } else {
      this.taskView.next(tasks);
    }
  }

  private snapshotToArray(snapshot) {
    // change the DatabaseSnapshot to array of TaskListModel.
    let returnArray: Array<TaskListModel> = [];

    snapshot.forEach((childSnapshot) => {
      let item: TaskListModel = childSnapshot.val();
      item.id = childSnapshot.key;
      returnArray.push(item);
    });
    this.updateView(returnArray, true);

  }

  private getTasksBy(orgId) {
    if (orgId) {
      // Connect to the database and get a list of tasks
      this.tasks = this.db.list('/organizations/' + orgId + '/tasks/', { preserveSnapshot: true });
      // Do not close the connection! Subscribe to the connection and on each push update the user.
      this.tasks.subscribe(data => this.snapshotToArray(data));
    }
  }

}
