import { Component, Input } from '@angular/core';

@Component({
    selector: 'uapi-task-view',
    templateUrl: './task-view.component.html',
    styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent {
    @Input()
    public taskId: string;
    constructor() {
        console.log(this.taskId);
    }

}
