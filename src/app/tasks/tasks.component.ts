import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { TaskModel } from './task.model';
import { TaskFormComponent } from './task-form.component';
import * as toolbox from 'sw-toolbox';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'uapi-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['tasks.component.scss']
})

export class TaskComponent implements OnInit {
  public tasks: FirebaseListObservable<Array<firebase.database.DataSnapshot>>;
  public taskView: BehaviorSubject<Array<TaskModel>> = new BehaviorSubject([]);

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
    private modal: SkyModalService) {

    // Setup SW Toolbox - verbose.
    toolbox.options.debug = false;
    toolbox.router.post('(.*)', toolbox.fastest);
    toolbox.router.get('/tasks(.*)', toolbox.fastest, {
      debug: false,
      networkTimeoutSeconds: 4,
      cache: {
        name: 'task-cache-v1',
        maxEntries: 10,
        maxAgeSeconds: 200
      }
    });

  }
  public ngOnInit() {
    this.auth.org$.subscribe(org => this.getTasksBy(org.id));
  }

  // Skyux Modal with a form inside.
  public openModal(task?: TaskModel) {
    let model = new TaskModel();
    if (task) { model = task; }
    let windowMode: any = {
      'defaultModal': {
        'providers': [{ provide: TaskModel, useValue: model }]
      }
    };
    // Make a modal Instance
    let modalInstance = this.modal.open(TaskFormComponent, windowMode['defaultModal']);
    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      this.save(Object.assign(new TaskModel(), result.data));
    });
  }
  protected remove(id: string) {
    this.tasks.remove(id);
  }
  private save(task: TaskModel) {
    if (task.id) {
      this.tasks.update(task.id, task);
    } else {
      this.tasks.push(task);
    }
  }

  private updateView(tasks: Array<TaskModel>, reverse?: boolean) {
    if (reverse) {
      this.taskView.next(tasks.reverse());
    } else {
      this.taskView.next(tasks);
    }
  }

  private snapshotToArray(snapshot) {
    // change the DatabaseSnapshot to array of TaskModel.
    let returnArray: Array<TaskModel> = [];

    snapshot.forEach((childSnapshot) => {
      let item: TaskModel = childSnapshot.val();
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
