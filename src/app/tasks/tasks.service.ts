import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../shared/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TaskModel } from './task.model';
import { OrganizationModel } from '../shared/organization.model';
import * as toolbox from 'sw-toolbox';

@Injectable()
export class TasksService {
  public task$: BehaviorSubject<Array<TaskModel>> = new BehaviorSubject(new Array(new TaskModel()));
  public tasksCollection: AngularFirestoreCollection<TaskModel>;

  constructor(
    private auth: AuthService,
    private db: AngularFirestore) {
    this.auth.org$.subscribe((org: OrganizationModel) => {
      let collectionUrl = `/organizations/${org.id}/tasks/`;

      this.tasksCollection = this.db.collection<TaskModel>(collectionUrl);
      this.tasksCollection.snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as TaskModel;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      }).subscribe((data) => {
        this.task$.next(data);
        this.updateView(data, true);
      });

      // Test Offline Mode.
      /*
      this.db.firestore.collection(collectionUrl)
        .onSnapshot({ includeQueryMetadataChanges: true }, function (snapshot) {
          snapshot.docChanges.forEach(function (change) {
            if (change.type === 'added') {

            }
            let source = snapshot.metadata.fromCache ? 'local cache' : 'server';
            console.log('Data came from ' + source);
          });
        });
        */

    });

    this.tools();
  }

  public remove(id: string) {
    this.tasksCollection.doc(id).delete();
  }
  public save(task: TaskModel) {
    if (task.id) {
      this.tasksCollection.doc(task.id).update(Object.assign({}, task));
    } else {
      this.tasksCollection.add(Object.assign({}, task));
    }
  }

  private tools() {
    // Setup SW Toolbox - verbose.
    toolbox.options.debug = false;
    toolbox.router.post('(.*)', toolbox.fastest);
    toolbox.router.get('/tasklist(.*)', toolbox.fastest, {
      debug: false,
      networkTimeoutSeconds: 4,
      cache: {
        name: 'tasks-cache-v1',
        maxEntries: 10,
        maxAgeSeconds: 200
      }
    });
  }

  private updateView(task: Array<TaskModel>, reverse?: boolean) {
    if (reverse) {
      this.task$.next(task.reverse());
    } else {
      this.task$.next(task);
    }
  }

}
