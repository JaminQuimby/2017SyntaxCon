import { Component, OnInit } from '@angular/core';
import { SkyModalInstance } from '@blackbaud/skyux/dist/core';
import { TaskListModel } from './tasklist.model';
import { ProjectsService } from '../projects/projects.service';
import { ProjectModel } from '../projects/project.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'tasklist-form-modal',
  templateUrl: './tasklist-form.component.html'
})

export class TasklistFormComponent implements OnInit {
  public projectView: BehaviorSubject<Array<ProjectModel>> = new BehaviorSubject([]);
  constructor(
    public model: TaskListModel,
    public instance: SkyModalInstance,
    private projects: ProjectsService) { }

  public ngOnInit() {
    this.projects.projects$.subscribe(projects => {
      if (projects) { this.projectView.next(projects); }
      console.log(this.projectView.getValue());
    });

  }
}
