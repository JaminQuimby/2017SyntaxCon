import { Component } from '@angular/core';
import { SkyModalInstance } from '@blackbaud/skyux/dist/core';
import { TaskModel } from './task.model';
import { ProjectModel } from '../projects/project.model';
import { Container } from '../shared/database.service';

@Component({
  selector: 'task-form-modal',
  templateUrl: './task-form.component.html',
  styleUrls: ['task-form.component.scss']
})

export class TaskFormComponent {

  @Container('user/$uid$/projects')
  public projects: ProjectModel;

  constructor(
    public model: TaskModel,
    public instance: SkyModalInstance
  ) { }
}
