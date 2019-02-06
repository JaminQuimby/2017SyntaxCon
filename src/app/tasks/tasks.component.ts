
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { TaskModel } from './task.model';
import { Container } from '../shared/database.service';
import { Subject } from 'rxjs';
import { ModalBuilderComponent } from '../shared/form-builder/modal-builder/modal-builder.component';
import { ModalBuilderModel } from '../shared/form-builder/modal-builder/modal-builder.model';

@Component({
  selector: 'uapi-tasks',
  templateUrl: './tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TaskComponent {

  @Container(`users/$uid$/tasks`)
  public tasks: Subject<Array<TaskModel>>;
  constructor(private modal: SkyModalService) { }

  // Skyux Modal with a form inside.
  public openModal(task?: TaskModel) {
    let model = new TaskModel();
    model.fields = [
      {
        type: 'hidden',
        name: 'id'
      },
      {
        type: 'text',
        name: 'project',
        label: 'Project',
        required: true
      },
      {
        type: 'dropdown',
        name: 'status',
        label: 'Status',
        required: true,
        options: [
          { key: 'New', label: 'New' },
          { key: 'Ready', label: 'Ready' },
          { key: 'In Progress', label: 'In Progress' },
          { key: 'Review', label: 'Review' },
          { key: 'Done', label: 'Done' },
          { key: 'Archived', label: 'Archived' }
        ]
      },
      {
        type: 'text',
        name: 'person',
        label: 'Person'
      },
      {
        type: 'text',
        name: 'name',
        label: 'Name'
      },
      {
        type: 'text',
        name: 'description',
        label: 'Description'
      }
    ];
    model.title = 'Tasks';
    if (task) { model = { ...model, ...task }; }
    let windowMode: any = {
      'defaultModal': {
        'providers': [{ provide: ModalBuilderModel, useValue: model }]
      }
    };
    // Make a modal Instance
    this.modal
      .open(ModalBuilderComponent, windowMode['defaultModal'])
      .closed.subscribe((result: SkyModalCloseArgs) => {
        if (result.reason === 'save') {
          const modal = new TaskModel();
          this.tasks.next([{ ...modal, ...result.data }]);
        }
      });
  }
}
