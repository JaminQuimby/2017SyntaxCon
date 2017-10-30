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
    let mutated = this.mutations(task);
    if (mutated.id) {
      this.tasksCollection.doc(mutated.id).update(Object.assign({}, mutated));
    } else {
      this.tasksCollection.add(Object.assign({}, mutated));
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

  private mutations(task: TaskModel) {
    let tags: Array<string> = [];
    if (task.tags) {
      task.tags.toString().split(',')
        .forEach((tag) => {
          tags.push(tag);
        });
    }
    task.tags = tags;
    return task;
  }
  private updateView(task: Array<TaskModel>) {
    this.task$.next(task.reverse());
  }
}
