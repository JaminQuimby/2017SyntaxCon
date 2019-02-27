import { Component, ChangeDetectionStrategy } from '@angular/core';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import { TaskModel } from './task.model';
import { Container } from '../shared/database.decorator';
import { Subject } from 'rxjs';
import { ModalBuilderComponent } from '../shared/form-builder/modal-builder/modal-builder.component';
import { ModalBuilderModel } from '../shared/form-builder/modal-builder/modal-builder.model';

@Component({
  selector: 'uapi-tasks',
  templateUrl: './tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TaskComponent {

  @Container(`users/tasks`)
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
        type: 'dropdown',
        name: 'project',
        label: 'Project',
        required: true,
        container: 'users/projects'
      },
      {
        type: 'dropdown',
        name: 'status',
        label: 'Status',
        required: true,
        options: [
          { id: 'New', name: 'New' },
          { id: 'Ready', name: 'Ready' },
          { id: 'In Progress', name: 'In Progress' },
          { id: 'Review', name: 'Review' },
          { id: 'Done', name: 'Done' },
          { id: 'Archived', name: 'Archived' }
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
        label: 'Description',
        placeholder: '',
        multiline: true
      }
    ];
    model.title = 'Tasks';
    if (task) { model = { ...model, ...task }; }
    const provider = { 'providers': [{ provide: ModalBuilderModel, useValue: model }] };
    // Make a modal Instance
    this.modal
      .open(ModalBuilderComponent, provider)
      .closed.subscribe((result: SkyModalCloseArgs) => {
        if (result.reason === 'save') {
          this.tasks.next([{ ...new TaskModel(), ...result.data }]);
        }
      });
  }
}
