import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../shared/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TaskModel } from './task.model';
import { OrganizationModel } from '../shared/organization.model';

@Injectable()
export class TasksService {
  public tasksCollection: AngularFirestoreCollection<TaskModel>;
  public task$: BehaviorSubject<Array<TaskModel>> = new BehaviorSubject(new Array(new TaskModel()));

  constructor(
    private auth: AuthService,
    private db: AngularFirestore) {
    this.auth.org$.subscribe((org: OrganizationModel) => {
      let collectionUrl = `/organizations/${org.id}/tasks/`;

      this.tasksCollection = this.db.collection<TaskModel>(collectionUrl);
      this.tasksCollection
        .snapshotChanges().map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as TaskModel;
            const id = action.payload.doc.id;
            return { id, ...data };
          });
        }).subscribe((data) => {
          if (data.length > 0) {
            this.updateView(data);
          }
        });
    });
  }

  public save(task: TaskModel) {
    if (task.id) {
      this.tasksCollection.doc(task.id).update(Object.assign({}, task));
    } else {
      this.tasksCollection.add(Object.assign({}, task));
    }
  }

  public update(id: string, ...data: any[]) {
    let change: TaskModel = this.task$.getValue().find(task => task.id === id);
    data.forEach((item) => {
      Object.assign(change, item);
    });
    this.save(change);
  }

  public remove(id: string) {
    this.tasksCollection.doc(id).delete();
  }

  private updateView(task: Array<TaskModel>) {
    this.task$.next(task.reverse());
  }
}
