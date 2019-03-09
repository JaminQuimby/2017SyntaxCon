import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TaskModel } from './task.model';
import { Container } from '../shared/database.decorator';
import { Subject } from 'rxjs';
import { BuilderAnchorItem } from '../shared/form-builder/builder-anchor.items';
import { BuilderAnchorComponent } from '../shared/form-builder/builder-anchor.component';

@Component({
  selector: 'uapi-tasks',
  template: '<uapi-builder [anchors]="anchors"></uapi-builder>',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TaskComponent {
  @Container(`users/tasks`)
  public tasks: Subject<Array<TaskModel>>;
  public anchors: BuilderAnchorItem[] = [];
  constructor() {
    let model = new TaskModel();
    model._fields = [
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
    model.title = 'Task';
    const anchor = new BuilderAnchorItem(BuilderAnchorComponent, model, this.tasks);
    this.anchors.push(anchor);
  }

}
