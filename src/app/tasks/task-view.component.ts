import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TaskModel } from './task.model';
@Component({
  selector: 'uapi-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['task-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskViewComponent {
  @Input()
  public task: TaskModel;
  constructor() {
    // console.log(this.taskId);
  }

}
