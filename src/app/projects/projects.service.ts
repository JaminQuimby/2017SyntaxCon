import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../shared/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ProjectModel } from './project.model';
import { OrganizationModel } from '../shared/organization.model';

@Injectable()
export class ProjectsService {
  public projectCollection: AngularFirestoreCollection<ProjectModel>;
  public projects$: BehaviorSubject<Array<ProjectModel>> = new BehaviorSubject(new Array(new ProjectModel()));

  constructor(
    private auth: AuthService,
    private db: AngularFirestore) {
    this.auth.org$.subscribe((org: OrganizationModel) => {
      let collectionUrl = `/organizations/${org.id}/projects/`;

      this.projectCollection = this.db.collection<ProjectModel>(collectionUrl);
      this.projectCollection
        .snapshotChanges().map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as ProjectModel;
            const id = action.payload.doc.id;
            return { id, ...data };
          });
        }).subscribe((data) => {
          this.projects$.next(data);
          this.updateView(data);
        });
    });
  }

  public save(task: ProjectModel) {
    if (task.id) {
      this.projectCollection.doc(task.id).update(Object.assign({}, task));
    } else {
      this.projectCollection.add(Object.assign({}, task));
    }
  }

  public remove(id: string) {
    this.projectCollection.doc(id).delete();
  }

  private updateView(projects: Array<ProjectModel>, reverse?: boolean) {
    this.projects$.next(projects.reverse());
  }
}
