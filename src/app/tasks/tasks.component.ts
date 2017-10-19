import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
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
  // public tasks: AngularFireList<Array<firebase.database.DataSnapshot>>;
  public tasksCollection: AngularFirestoreCollection<TaskModel>;
  public taskView: BehaviorSubject<Array<TaskModel>> = new BehaviorSubject([]);

  constructor(
    private auth: AuthService,
    private db: AngularFirestore,
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
    this.auth.org$.subscribe(org => {
      // setup database
      this.tasksCollection = this.db.collection<TaskModel>('/organizations/' + org.id + '/tasks/');
      // does not contain ids //  this.tasks$ = this.tasksCollection.valueChanges();

      this.tasksCollection.snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as TaskModel;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      }).subscribe((data) => {
        this.updateView(data, true);
      });
    });
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
    this.tasksCollection.doc(id).delete();
  }
  private save(task: TaskModel) {
    if (task.id) {
      this.tasksCollection.doc(task.id).update(Object.assign({}, task));
    } else {
      this.tasksCollection.add(Object.assign({}, task));
    }
  }

  private updateView(tasks: Array<TaskModel>, reverse?: boolean) {
    if (reverse) {
      this.taskView.next(tasks.reverse());
    } else {
      this.taskView.next(tasks);
    }
  }

}
