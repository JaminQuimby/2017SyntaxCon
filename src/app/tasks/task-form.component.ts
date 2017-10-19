import { Component, OnInit } from '@angular/core';
import { SkyModalInstance } from '@blackbaud/skyux/dist/core';
import { TaskModel } from './task.model';
import { ProjectsService } from '../projects/projects.service';
import { ProjectModel } from '../projects/project.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'task-form-modal',
  templateUrl: './task-form.component.html'
})

export class TaskFormComponent implements OnInit {
  public projectView: BehaviorSubject<Array<ProjectModel>> = new BehaviorSubject([]);
  constructor(
    public model: TaskModel,
    public instance: SkyModalInstance,
    private projects: ProjectsService) { }

  public ngOnInit() {
    this.projects.projects$.subscribe(projects => {
      if (projects) { this.projectView.next(projects); }
      console.log(this.projectView.getValue());
    });

  }
}
