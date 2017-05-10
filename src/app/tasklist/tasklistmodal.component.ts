import { Component } from '@angular/core';
import { SkyModalInstance } from '@blackbaud/skyux/dist/core';
import { TaskListContext } from './tasklist.context';

@Component({
  selector: 'task-list-modal',
  templateUrl: './tasklistmodal.component.html'
})

export class TaskListModalComponent {
  constructor(public context: TaskListContext, public instance: SkyModalInstance) { }
}
