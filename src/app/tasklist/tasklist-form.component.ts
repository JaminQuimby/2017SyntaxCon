import { Component } from '@angular/core';
import { SkyModalInstance } from '@blackbaud/skyux/dist/core';
import { TaskListModel } from './tasklist.model';

@Component({
  selector: 'tasklist-form-modal',
  templateUrl: './tasklist-form.component.html'
})

export class TasklistFormComponent {

  constructor(
    public model: TaskListModel,
    public instance: SkyModalInstance) { }

}
