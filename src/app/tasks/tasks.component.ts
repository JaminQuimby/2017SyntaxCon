
import { Component } from '@angular/core';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { TaskModel } from './task.model';
import { TaskFormComponent } from './task-form.component';
import { Container } from '../shared/database.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'uapi-tasks',
  templateUrl: './tasks.component.html'
})

export class TaskComponent {

  @Container(`users/$uid$/tasks`)
  public tasks: ReplaySubject<TaskModel[]>;
  constructor(private modal: SkyModalService) { }

  // Skyux Modal with a form inside.
  public openModal(task?: TaskModel) {
    let model = new TaskModel();
    if (task) { model = task; }
    let windowMode: any = {
      'defaultModal': {
        'providers': [{ provide: TaskModel, useValue: model }]
      }
    };
    // Make a modal Instance
    this.modal
      .open(TaskFormComponent, windowMode['defaultModal'])
      .closed.subscribe((result: SkyModalCloseArgs) => {
        if (result.reason === 'save') {
          const modal = new TaskModel();
          this.tasks = { ...modal, ...result.data };
        }
      });
  }
}
