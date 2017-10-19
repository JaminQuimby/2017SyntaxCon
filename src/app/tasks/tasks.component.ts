import { Component } from '@angular/core';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { TaskModel } from './task.model';
import { TaskFormComponent } from './task-form.component';
import { TasksService } from './tasks.service';
@Component({
  selector: 'uapi-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['tasks.component.scss']
})

export class TaskComponent {
  constructor(
    private service: TasksService,
    private modal: SkyModalService) { }

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
        this.service.save(Object.assign(new TaskModel(), result.data));
      });
  }

}
