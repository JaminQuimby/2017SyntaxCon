import { Component } from '@angular/core';
import { SkyModalInstance } from '@blackbaud/skyux/dist/core';
import { TaskModel } from './task.model';
import { ProjectsService } from '../projects/projects.service';
import { ProjectModel } from '../projects/project.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormGroup, FormControl, Validators, FormBuilder }
  from '@angular/forms';

@Component({
  selector: 'task-form-modal',
  templateUrl: './task-form.component.html'
})

export class TaskFormComponent {
  public projectView: BehaviorSubject<Array<ProjectModel>> = new BehaviorSubject([]);
  public form: FormGroup;

  constructor(
    public model: TaskModel,
    public instance: SkyModalInstance,
    public fb: FormBuilder,
    private projects: ProjectsService
  ) {

    this.form = fb.group({
      'projectId': [model.projectId, Validators.required],
      'id': [model.id, Validators.required],
      'name': [model.name, Validators.required],
      'person': [model.person, ''],
      'status': [model.status, ''],
      'description': [model.description, ''],
      'tags': [model.tags, ''],
      'blocked': [model.blocked, '']
    });
    this.projects.projects$.subscribe(project => {
      if (project) { this.projectView.next(project); }
    });
  }
}
