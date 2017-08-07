import { Component } from '@angular/core';
import { SkyTileDashboardConfig } from '@blackbaud/skyux/dist/core';
import { ProjectsService } from '../projects/projects.service';
import { ProjectModel } from '../projects/project.model';

@Component({
    selector: 'uapi-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {
    public projects: Array<ProjectModel> = [];
    public dashboardConfig: SkyTileDashboardConfig;

    constructor(private service: ProjectsService) {
        this.service.projects$.subscribe(projects => {
            this.projects = projects;
        });
    }
}
