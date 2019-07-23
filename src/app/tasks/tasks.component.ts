import { BuilderAnchorComponent } from '../shared/form-builder/builder-anchor.component';
import { BuilderAnchorItem } from '../shared/form-builder/builder-anchor.items';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Container } from '../shared/database.decorator';
import { Subject } from 'rxjs';
import { TaskModel, taskSchematics } from './task.model';

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
    const pageConfig = { 'title': 'Task' };
    let dataModel = new TaskModel();
    dataModel.fields = taskSchematics;
    const anchor = new BuilderAnchorItem(BuilderAnchorComponent, dataModel, this.tasks, pageConfig);
    this.anchors.push(anchor);
  }
}
