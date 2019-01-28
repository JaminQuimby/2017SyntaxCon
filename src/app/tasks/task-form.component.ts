import { Component } from '@angular/core';
import { SkyModalInstance } from '@blackbaud/skyux/dist/core';
import { TaskModel } from './task.model';
import { ProjectModel } from '../projects/project.model';
import { Container } from '../shared/database.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'task-form-modal',
  templateUrl: './task-form.component.html',
  styleUrls: ['task-form.component.scss']
})

export class TaskFormComponent {

  @Container(`users/$uid$/projects`)
  public projects: ReplaySubject<ProjectModel[]>;

  constructor(
    public model: TaskModel,
    public instance: SkyModalInstance
  ) { }
}
