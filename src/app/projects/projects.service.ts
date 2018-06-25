import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ProjectModel } from './project.model';
import { DatabasesService } from '../shared/database.service';

@Injectable()
export class ProjectsService extends DatabasesService {
  public projectCollection: AngularFirestoreCollection<ProjectModel>;
  public projects$: BehaviorSubject<Array<ProjectModel>> = new BehaviorSubject(new Array(new ProjectModel()));

  constructor() {
    super('projects');
    super.database().subscribe((data) => {
      this.projects$.next(data);
    });
    super.start();
  }

  public save(task: ProjectModel) {
    super.save(task);
  }

  public remove(id: string) {
    super.remove(id);
  }

}
