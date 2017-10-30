import { Component } from '@angular/core';
import { SkyModalInstance } from '@blackbaud/skyux/dist/core';
import { TaskModel } from './task.model';
import { ProjectsService } from '../projects/projects.service';
import { ProjectModel } from '../projects/project.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'task-form-modal',
  templateUrl: './task-form.component.html',
  styleUrls: ['task-form.component.scss']
})

export class TaskFormComponent {
  public projectView: BehaviorSubject<Array<ProjectModel>> = new BehaviorSubject([]);

  constructor(
    public model: TaskModel,
    public instance: SkyModalInstance,
    private projects: ProjectsService
  ) {

    this.projects.projects$.subscribe(project => {
      if (project) { this.projectView.next(project); }
    });
  }
}
