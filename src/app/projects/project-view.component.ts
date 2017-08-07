import { Component, Input } from '@angular/core';

@Component({
    selector: 'uapi-project-view',
    templateUrl: './project-view.component.html',
    styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent {
    @Input()
    public projectId: string;
    constructor() {
        console.log(this.projectId);
    }

}
